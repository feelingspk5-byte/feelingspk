import type { Collection, Product, SiteConfig } from "@/lib/types";

/** FEELINGS catalogue — Tropical Signature + Heritage Depth from owner PDFs. */

export const FABRIC_METER_OPTIONS = [
  { id: "4-5m", label: "4.5 metres", quantity: 4.5, unit: "metre" },
];

export const siteConfig: SiteConfig = {
  brandName: "FEELINGS",
  tagline: "Elite Men's Collection",
  announcement:
    "FEELINGS Elite Men's Collection — fabric, shalwar kameez, and dress shirts.",
  contactEmail: "feelingspk.5@gmail.com",
  contactPhone: "03155551507",
  whatsapp: "03155551507",
  social: { instagram: "feelingsspk", facebook: null },
  currencyPlaceholder: "PKR",
  paymentMethods: ["Cash on Delivery"],
  shippingConnected: false,
  checkoutConnected: true,
};

export const collections: Collection[] = [
  {
    id: "col-tropical-signature",
    slug: "tropical-signature",
    name: "Tropical Signature",
    description:
      "Four considered neutrals — mocha taupe, sandstone beige, dark espresso, and soft ivory.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/tropical-signature/ts-01-mocha-taupe.jpg",
    sortOrder: 1,
  },
  {
    id: "col-heritage-depth",
    slug: "heritage-depth",
    name: "Heritage Depth",
    description:
      "Five enduring shades — mist stone, dark espresso, oxblood burgundy, midnight navy, and signature black.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/heritage-depth/hd-01-mist-stone.jpg",
    sortOrder: 2,
  },
];

export const products: Product[] = [
  {
    id: "prod-tropical-signature",
    slug: "tropical-signature",
    name: "Tropical Signature",
    category: "unstitched_fabric",
    sku: "FL-TS-01",
    description:
      "Tropical Signature unstitched fabric — four exact catalogue shades for the tailor’s table.",
    collectionSlugs: ["tropical-signature"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "ts-01",
        name: "Mocha Taupe",
        hex: "#463a30",
        available: true,
        imageIds: ["ts-01-studio"],
      },
      {
        id: "ts-02",
        name: "Sandstone Beige",
        hex: "#a3947f",
        available: true,
        imageIds: ["ts-02-studio"],
      },
      {
        id: "ts-03",
        name: "Dark Espresso",
        hex: "#251e19",
        available: true,
        imageIds: ["ts-03-studio"],
      },
      {
        id: "ts-04",
        name: "Soft Ivory",
        hex: "#dad7d1",
        available: true,
        imageIds: ["ts-04-studio"],
      },
    ],
    images: [
      {
        id: "ts-01-studio",
        src: "/catalogue/tropical-signature/ts-01-mocha-taupe.jpg",
        alt: "Tropical Signature — Mocha Taupe fabric",
        kind: "colour",
      },
      {
        id: "ts-02-studio",
        src: "/catalogue/tropical-signature/ts-02-sandstone-beige.jpg",
        alt: "Tropical Signature — Sandstone Beige fabric",
        kind: "colour",
      },
      {
        id: "ts-03-studio",
        src: "/catalogue/tropical-signature/ts-03-dark-espresso.jpg",
        alt: "Tropical Signature — Dark Espresso fabric",
        kind: "colour",
      },
      {
        id: "ts-04-studio",
        src: "/catalogue/tropical-signature/ts-04-soft-ivory.jpg",
        alt: "Tropical Signature — Soft Ivory fabric",
        kind: "colour",
      },
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-heritage-depth",
    slug: "heritage-depth",
    name: "Heritage Depth",
    category: "unstitched_fabric",
    sku: "FL-HD-01",
    description:
      "Heritage Depth unstitched fabric — five exact catalogue shades for formal depth.",
    collectionSlugs: ["heritage-depth"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "hd-01",
        name: "Mist Stone",
        hex: "#d4d0c9",
        available: true,
        imageIds: ["hd-01-studio"],
      },
      {
        id: "hd-02",
        name: "Dark Espresso",
        hex: "#2b2823",
        available: true,
        imageIds: ["hd-02-studio"],
      },
      {
        id: "hd-03",
        name: "Oxblood Burgundy",
        hex: "#5c1a24",
        available: true,
        imageIds: ["hd-03-studio"],
      },
      {
        id: "hd-04",
        name: "Midnight Navy",
        hex: "#0e0f14",
        available: true,
        imageIds: ["hd-04-studio"],
      },
      {
        id: "hd-05",
        name: "Signature Black",
        hex: "#111111",
        available: true,
        imageIds: ["hd-05-studio"],
      },
    ],
    images: [
      {
        id: "hd-01-studio",
        src: "/catalogue/heritage-depth/hd-01-mist-stone.jpg",
        alt: "Heritage Depth — Mist Stone fabric",
        kind: "colour",
      },
      {
        id: "hd-02-studio",
        src: "/catalogue/heritage-depth/hd-02-dark-espresso.jpg",
        alt: "Heritage Depth — Dark Espresso fabric",
        kind: "colour",
      },
      {
        id: "hd-03-studio",
        src: "/catalogue/heritage-depth/hd-03-oxblood-burgundy.jpg",
        alt: "Heritage Depth — Oxblood Burgundy fabric",
        kind: "colour",
      },
      {
        id: "hd-04-studio",
        src: "/catalogue/heritage-depth/hd-04-midnight-navy.jpg",
        alt: "Heritage Depth — Midnight Navy fabric",
        kind: "colour",
      },
      {
        id: "hd-05-studio",
        src: "/catalogue/heritage-depth/hd-05-signature-black.jpg",
        alt: "Heritage Depth — Signature Black fabric",
        kind: "colour",
      },
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
];
