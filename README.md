# FEELINGS

Premium **men’s unstitched shalwar kameez fabric** storefront — traditional Pakistani luxury, Stone-led visual system.

Design source of truth: [`docs/feelings-design-language.pdf`](./docs/feelings-design-language.pdf)

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS  
- Structured catalogue in `src/data/catalog.ts` (ready for later Shopify / commerce backend)  
- Local cart (browser storage); checkout UI prepared but **not** connected to payment

## Run locally

```bash
npm install
npm run dev
```

Dev server defaults to port **3847**.

```bash
npm run build && npm run start
```

## What’s built

- Homepage sections per design brief (empty states where content is pending)
- Navigation: Shop All, New Arrivals, Collections, About, Contact, Search, Cart
- Collection listing + detail templates
- Product detail template for **unstitched fabric** (colour / cut selectors, no garment sizes)
- Cart + checkout structure (explicitly does not place real orders yet)
- About, Contact, FAQ, Shipping, Exchanges, Privacy, Terms placeholders

## Adding the real catalogue

See [`docs/CATALOGUE.md`](./docs/CATALOGUE.md). Do not invent products, prices or policies.

## Brand colours

| Token | Hex |
| --- | --- |
| Stone | `#D8D1C6` |
| Soft Black | `#171717` |
| Warm Ivory | `#F5F1E9` |
| Deep Wine | `#6B2638` |
