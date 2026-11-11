# FEELINGS

**FEELINGS — Elite Men’s Collection**: unstitched fabric with colour selection and metre lengths (1m · 2m · 4m · 6m). Stitched shalwar kameez and dress shirts — coming soon.

Design source of truth: [`docs/feelings-design-language.pdf`](./docs/feelings-design-language.pdf)

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- Catalogue seed in `src/data/catalog.ts`; live inventory in `data/runtime-store.json` (created on first boot)
- Local cart + account (browser storage); checkout places **Cash on Delivery** order requests
- **Admin panel** at `/admin` for products, collections, media, and COD orders

## Run locally

```bash
npm install
npm run build && npm run start
```

Server defaults to port **3847** (`http://localhost:3847`).

Dev mode:

```bash
npm run dev
```

## Admin panel

1. Open `/admin` — first visit creates the admin password (8+ characters).
2. Manage **Products** (colours, metres/sizes, stock, images), **Collections**, **Media** uploads, and **COD Orders**.
3. Changes save to the runtime store and show on the shop immediately.

Optional env (published hosting):

- `ADMIN_SESSION_SECRET` — long random string for signing admin cookies

## What’s built

- Homepage with brand photography and slideshow hero
- Collections + shop with colour / category filters
- Product pages: swatches, metre lengths, custom-length WhatsApp note
- Sign in / account, cart, premium COD checkout
- Admin Phase 1: inventory, media, collections, COD order pipeline

## Brand colours

| Token | Hex |
| --- | --- |
| Stone | `#D8D1C6` |
| Soft Black | `#171717` |
| Warm Ivory | `#F5F1E9` |
| Deep Wine | `#6B2638` |
