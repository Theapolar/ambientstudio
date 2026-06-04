// Verifies a license key for Ambient Studio. Two paths:
//
// 1. Gumroad keys (unique per sale) — checked against Gumroad's API.
//    Set GUMROAD_PRODUCT_ID in Netlify env vars to the product's *Product ID* string
//    (from the product's License-key panel — NOT the permalink).
//
// 2. Shared Etsy key(s) — one reusable key handed to Etsy buyers (Etsy can't mint
//    per-sale Gumroad keys). ROTATABLE: set ETSY_UNLOCK_KEY (current) and, after a
//    rotation, ETSY_UNLOCK_KEY_PREV (the old one) so existing buyers keep working
//    during a changeover. Change these env vars + redeploy to rotate — no code change.
//    Every successful Etsy unlock is logged (timestamp, IP, browser) so a leak shows
//    up as a flood of unlocks from many different IPs in the Netlify function logs.
//
// The browser app POSTs { "license_key": "XXXX-..." } and gets back { valid, message }.

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ valid: false, message: 'Method not allowed' }) };
  }

  try {
    const { license_key } = JSON.parse(event.body || '{}');
    const productId = process.env.GUMROAD_PRODUCT_ID;

    if (!license_key) {
      return { statusCode: 200, headers: cors, body: JSON.stringify({ valid: false, message: 'No license key provided.' }) };
    }

    // --- Path 2: shared Etsy key (rotatable). Checked first so it never hits Gumroad. ---
    const submitted = String(license_key).trim().toUpperCase();
    const etsyKeys = [process.env.ETSY_UNLOCK_KEY, process.env.ETSY_UNLOCK_KEY_PREV]
      .filter(Boolean)
      .map(k => k.trim().toUpperCase());
    const matchedIdx = etsyKeys.indexOf(submitted);
    if (matchedIdx !== -1) {
      const h = event.headers || {};
      const ip = h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
      const ua = (h['user-agent'] || 'unknown').slice(0, 120);
      // Leak signal: scan Netlify function logs for [ETSY-UNLOCK]. A spike across many
      // distinct IPs = the shared key is circulating; rotate ETSY_UNLOCK_KEY.
      console.log(`[ETSY-UNLOCK] ts=${new Date().toISOString()} key=${matchedIdx === 0 ? 'current' : 'previous'} ip=${ip} ua="${ua}"`);
      return { statusCode: 200, headers: cors, body: JSON.stringify({ valid: true, message: 'Unlocked (Etsy)', source: 'etsy' }) };
    }

    if (!productId) {
      return { statusCode: 500, headers: cors, body: JSON.stringify({ valid: false, message: 'Server not configured: set GUMROAD_PRODUCT_ID.' }) };
    }

    const params = new URLSearchParams({
      product_id: productId,
      license_key: license_key,
      increment_uses_count: 'false' // just check, don't bump the counter
    });

    const resp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const data = await resp.json();

    if (data.success) {
      const p = data.purchase || {};
      // Reject refunded / charged-back / disputed / subscription-cancelled purchases
      if (p.refunded || p.chargebacked || p.disputed || p.subscription_cancelled_at) {
        return { statusCode: 200, headers: cors, body: JSON.stringify({ valid: false, message: 'This license is no longer active.' }) };
      }
      return { statusCode: 200, headers: cors, body: JSON.stringify({ valid: true, message: 'Unlocked', email: p.email || null }) };
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ valid: false, message: data.message || 'Invalid license key.' }) };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ valid: false, message: 'Verification error. Please try again.' }) };
  }
};
