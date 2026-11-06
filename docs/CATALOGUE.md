# FEELINGS catalogue upload guide

Product photographs, catalogue PDFs, names, prices and policies are supplied by the owner later. The site is structured so those assets can be connected without redesigning pages.

## Where product data lives

Edit `src/data/catalog.ts`:

- `collections` — confirmed fabric lines / seasonal edits only
- `products` — one entry per fabric SKU / listing
- `siteConfig` — announcement, contact, payment methods, integration flags

Type definitions: `src/lib/types.ts`

## Required product fields (when known)

| Field | Notes |
| --- | --- |
| `id`, `slug`, `name` | Stable identifiers |
| `price`, `currency` | Omit price until confirmed |
| `collectionSlugs` | Must match a collection `slug` |
| `sellingMethod` | `fixed_cut` \| `per_metre` \| `per_yard` \| `fixed_price` \| `unconfirmed` |
| `cutOptions` | Only after units / increments confirmed |
| `colourVariants` | Only real colours |
| `images` | Real fabric photos; descriptive `alt` |
| `availability` | `in_stock` \| `out_of_stock` \| `unconfirmed` |

## Image organisation (recommended)

```text
public/catalog/{sku}/hero.webp
public/catalog/{sku}/texture.webp
public/catalog/{sku}/colour-{name}.webp
```

Point each `images[].src` at these paths. Do not reuse one generic image across different fabrics.

## From PDF catalogues

1. Inspect each PDF page / product block separately.
2. Extract only visible or owner-confirmed facts.
3. Create one product record per fabric listing (not one product per PDF unless the owner says so).
4. Ask when colour, length or price is unclear.

## Do not invent

Categories, composition claims, prices, lengths, stock, reviews, shipping promises or contact details.
