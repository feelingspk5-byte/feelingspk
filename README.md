# FEELINGS

**FEELINGS — Elite Men’s Collection**: unstitched fabric with colour selection and metre lengths (1m · 2m · 4m · 6m). Stitched shalwar kameez and dress shirts — coming soon.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Live catalogue / CMS / offers in `data/runtime-store.json` (seeded from `src/data/catalog.ts`)
- Cash on Delivery checkout + WhatsApp confirmation
- Full admin at `/admin` (Phases 1–3)

## Run

```bash
npm install
npm run build && npm run start
```

Port **3847** (`http://localhost:3847`).

## Admin (`/admin`)

First visit creates the admin password.

| Section | What you control |
| --- | --- |
| Products / Collections / Media | Catalogue, colours, metres, images |
| Orders | COD pipeline, tracking, WhatsApp |
| Customers | Buyers, tags, spend |
| Offers | Coupons, %/fixed, free shipping, badges |
| Website | Hero, About, Contact, FAQ, footer |
| Shipping | City zones + free-shipping thresholds |
| Settings | Announcement, phone, WhatsApp, Instagram, COD |
| Returns | Return / exchange log |
| Analytics | Revenue, top products/colours |
| Audit | Who changed what |

### Env (production / Vercel)

| Variable | Purpose |
| --- | --- |
| `ADMIN_SESSION_SECRET` | Signed admin cookies (16+ chars) |
| `BLOB_READ_WRITE_TOKEN` | **Required for live admin → shop sync.** Create a Blob store in the Vercel project (Storage → Blob). Without it, prices/orders only live in ephemeral `/tmp` and will not stick on the website. |

Locally, admin edits write to `data/runtime-store.json` and show on the shop immediately.

## Brand colours

| Token | Hex |
| --- | --- |
| Stone | `#D8D1C6` |
| Soft Black | `#171717` |
| Warm Ivory | `#F5F1E9` |
| Deep Wine | `#6B2638` |
