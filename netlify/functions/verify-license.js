// Verifies a Gumroad license key for Ambient Studio.
//
// Set GUMROAD_PRODUCT_ID in your Netlify environment variables (Site settings ->
// Environment variables). For a one-time product you can use either the numeric
// product_id or the product permalink — Gumroad's verify endpoint accepts product_id.
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
