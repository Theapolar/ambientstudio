# Paywall Setup — step by step

The app already has the **free/paid gate built in**: free visitors can mix, listen, and
export a **60-second** clip; entering a valid **Gumroad license key** unlocks all export
lengths. To make real keys work, you need to (1) create the Gumroad product, (2) deploy to
Netlify with the product ID, and (3) point the app at it. All of this is the part only you
can do (it's tied to your accounts/money). Follow these once.

---

## 1. Create the product in Gumroad  *(you)*
1. Log in to Gumroad → **Products → New product**.
2. Type: **Digital product**. Name it (e.g. "Ambient Studio — Full Version").
3. Set your price (suggested launch/founder price ~$29; you can raise it later).
4. Turn ON **"Generate a unique license key per sale"** (Product → Settings → check
   *"Generate a license key…"*). This is what the app verifies.
5. Publish the product.
6. Find the **Product ID**: open the product, and either copy the numeric ID from the URL,
   or use the product's **permalink** (the short code after gumroad.com/l/). Either works.

> For content delivery you can either let Gumroad deliver a little "Welcome — here's your key
> and the app link" file, or just rely on the key shown to buyers after purchase.

## 2. Deploy to Netlify  *(Git-connected — DONE)*

This project is now deployed via **Netlify's GitHub integration** (auto-rebuilds on every
`git push`), not the manual CLI. The pieces:

- **GitHub repo:** https://github.com/Theapolar/ambientstudio  (private; `main` branch)
- **Live site:** https://pinedesignstudio.netlify.app/
- **Build settings** (auto-detected from `netlify.toml`):
  - Build command: `bash build_public.sh`  →  assembles the clean `public/` folder
  - Publish dir: `public`  ·  Functions: `netlify/functions`
  - `NODE_VERSION = 20`

**To update the live site:** commit + `git push origin main` — Netlify rebuilds automatically.
No CLI needed.

### ⚠️ Required one-time env var (otherwise keys won't unlock)
In Netlify → **Site configuration → Environment variables**, add:
- `GUMROAD_PRODUCT_ID` = the **Product ID string** (NOT the permalink). Get it in Gumroad on
  the product's **License key** panel — "use your product ID to verify licenses through the
  API" shows a copyable string. Use that exact string.

> ⚠️ Do **not** use the permalink `ambientstudio` here. It half-works (matches the product but
> fails license verification with *"That license does not exist for the provided product"*).
> Only the real Product ID validates keys. Confirmed working 2026-06-04.

Then **Deploys → Trigger deploy → Deploy site** so the function reloads with the variable.
Until this is set, `verify-license` returns *"Server not configured: set GUMROAD_PRODUCT_ID."*

## 3. Test the whole flow
1. Open https://pinedesignstudio.netlify.app/ . Confirm it says "Free version · mix & listen freely · exports capped at 60s" and shows the "Get the full version →" link.
2. Buy your own product on Gumroad (you can refund yourself) to get a real key.
3. In the app: **Export panel → "Have a key?" → paste key → Unlock.** It should switch to
   "✓ Full version unlocked" and enable the longer export lengths.
4. Refund the test purchase in Gumroad; the key will then fail re-verification.

## 4. Sell it
- **Gumroad** = your main checkout (buyers get a key automatically).
- **Etsy** = keep selling your sample/preset packs there. To sell *app access* on Etsy too,
  list it and, when someone buys, generate a key for them in Gumroad and send it via the Etsy
  order message. The app validates the key no matter where the sale happened.
- Announce a time-limited **founder price** to your existing Etsy customers.

---

## Notes
- **Custom domain:** add it in Netlify → Domain settings (e.g. `studio.pinedesign.no` or
  `app.theaborch.com`). Update DNS as Netlify instructs.
- **Free demo elsewhere:** the current GitHub Pages copy still works as a permanent free demo
  (the license check just 404s there, so it stays in free mode). Good as a "try it" link.
- **Privacy:** `build_public.sh` copies only the app files into `public/`, so PRODUCT_PLAN.md,
  this file, and the scripts are never published.
- **Reality check:** a browser app can't be perfectly copy-proof. This gate stops casual
  sharing and makes buying the easy path — which is the right goal. Don't over-invest in DRM.
