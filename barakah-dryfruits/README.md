# Barakah Dryfruits

A responsive static storefront for co-owners Iflak Bhat and Shakir Nazir. Orders are reviewed and sent by the customer through WhatsApp (+91 7889826963). No payment processor, server-side order database, or WhatsApp Business API is connected.

Run `npm run build`, `npm test`, and `npm run dev`. Source assets live in `assets/`; `dist/` is rebuilt on each build. No npm dependencies are needed. Edit `catalog.json` for product descriptions, indicative prices, weights and photo galleries, then rebuild. `build.py` generates crawlable category/product/info pages, metadata, structured data, sitemap and robots.txt.

Choosing a pack and Add to bag & WhatsApp saves the pack and opens a prefilled request for that exact selection. Keep shopping saves without opening WhatsApp. The bag sends several products together with delivery PIN and notes. Customers still press Send in WhatsApp. The immediate website acknowledgement explains the message is ready, not sent or confirmed. Target response is 30 minutes from receipt; timing may vary.

User-authorized Instagram promotion: INSTA5 requests 5% off products, excluding delivery. Follow status and final offer are verified by Shakir. It is requested in the WhatsApp message, not falsely marked as verified or paid.

Business bio read from the Instagram page captured on 16 October 2026: dry fruits, saffron, honey, perfumes, attars, car and room sprays; WhatsApp 7889826963. Live anonymous Instagram inspection on 17 October was blocked by a sign-up overlay. Honey and fragrances are enquiry-only, without invented catalogue variants or prices.

All cover and homepage photography is representative licensed stock, hosted locally. Original Instagram photos appear only inside product galleries; see docs/photography.md. No saved page scripts, comments, avatars or browser session data are shipped.

Deployment preserves the existing owner-private audience. Search engines cannot index private hosting; public access, a custom domain and Search Console configuration remain owner account decisions. Change ORIGIN in build.py if the domain changes.

## WhatsApp automatic replies
The storefront cannot detect message delivery or reply from Shakir’s account. WhatsApp Business greetings/away replies can be configured in his app, or production message automation requires an authorized WhatsApp Business Platform account, approved phone setup, webhook/backend and server-side secrets. No simulated successful auto-reply is shown. Suggested greeting: “Thank you for contacting Barakah Dryfruits. We have received your message and aim to confirm availability, final price and delivery within 30 minutes. Response time may vary. Your order is confirmed once Shakir replies.”

## GitHub and Netlify

The storefront lives under `barakah-dryfruits/` in Iflaqbhat/Typescript. Existing TypeScript exercises are preserved. Source assets live in `assets/`; `dist/` is generated from a clean build.

On Netlify select the repository main branch, set base directory `barakah-dryfruits`, build command `python3 build.py`, publish directory `dist`. The repository-root netlify.toml supplies the same base automatically. The generated canonical links, social URLs and sitemap use Netlify's production `URL` environment variable. For another host, set `SITE_URL` to its HTTPS origin.

Run `npm run build && npm test` before pushing. Tests validate pricing and messages, product-image placement, every generated internal link and fragment, and source asset availability. `python3 build.py` requires Python 3.10+; browser JavaScript needs no bundle or runtime dependencies.
