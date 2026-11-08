# FEELINGS

**FEELINGS — Elite Men’s Collection**: unstitched fabric from six article catalogues, with colour selection and metre lengths (1m · 2m · 4m · 6m).

Design source of truth: [`docs/feelings-design-language.pdf`](./docs/feelings-design-language.pdf)

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- Catalogue in `src/data/catalog.ts` + photography in `public/catalogue/`
- Local cart + account (browser storage); checkout prepared but **not** connected to payment

## Run locally

```bash
npm install
npm run dev
```

Dev server defaults to port **3847** (`http://localhost:3847`).

```bash
npm run build && npm run start
```

## Collections

| Collection | Colours |
| --- | --- |
| Signature Fabric | Noor, Zarrin, Shab, Sabz |
| Nightfall | Layl, Qahwa, Neel |
| Earth & Neutrals | Mahtab, Sunehra, Khaki, Zarqoon |
| The Noir | Aswad, Layl, Zulmat, Neel |
| Heritage Depth | Raad, Zarrar, Shahbaz, Sultan |
| Atelier Five | Azraq, Sarmad, Mehran, Noor, Raaz |

## What’s built

- Homepage using real fabric photography (no AI sample imagery)
- Collections with per-colour browsing
- Product pages: colour switcher + 1 / 2 / 4 / 6 metre lengths
- Sign in / Create account (header, beside search & cart)
- Cart + checkout structure (sign-in required; no live payment yet)

## Brand colours

| Token | Hex |
| --- | --- |
| Stone | `#D8D1C6` |
| Soft Black | `#171717` |
| Warm Ivory | `#F5F1E9` |
| Deep Wine | `#6B2638` |
