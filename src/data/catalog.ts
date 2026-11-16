import type { Collection, Product, SiteConfig } from "@/lib/types";

/** FEELINGS catalogue — Tropical Signature, Heritage Depth, and feelings 3–6 lines. */

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
    imageSrc: "/catalogue/tropical-signature/ts-01-mocha-taupe-clean.jpg",
    sortOrder: 1,
  },
  {
    id: "col-heritage-depth",
    slug: "heritage-depth",
    name: "Heritage Depth",
    description:
      "Five enduring shades — mist stone, dark espresso, oxblood burgundy, midnight navy, and signature black.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/heritage-depth/hd-01-mist-stone-clean.jpg",
    sortOrder: 2,
  },
  {
    id: "col-midnight-noir",
    slug: "midnight-noir",
    name: "Midnight Noir",
    description:
      "Four deep nocturnes — midnight navy, deep ink, graphite black, and olive noir.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/midnight-noir/mn-01-midnight-navy-clean.jpg",
    sortOrder: 3,
  },
  {
    id: "col-dark-shades",
    slug: "dark-shades",
    name: "Dark Shades",
    description:
      "Four distinct dark shades — charcoal black, midnight navy, forest olive, and espresso brown.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/dark-shades/ds-01-charcoal-black-clean.jpg",
    sortOrder: 4,
  },
  {
    id: "col-walnut-pearl",
    slug: "walnut-pearl",
    name: "Walnut Pearl",
    description:
      "Three considered neutrals — walnut taupe, pearl ivory, and midnight charcoal.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/walnut-pearl/wp-01-walnut-taupe-clean.jpg",
    sortOrder: 5,
  },
  {
    id: "col-walnut-onyx",
    slug: "walnut-onyx",
    name: "Walnut Onyx",
    description:
      "Four enduring earth tones — walnut brown, onyx black, espresso brown, and charcoal grey.",
    category: "unstitched_fabric",
    imageSrc: "/catalogue/walnut-onyx/wo-01-walnut-brown-clean.jpg",
    sortOrder: 6,
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
        src: "/catalogue/tropical-signature/ts-01-mocha-taupe-clean.jpg",
        alt: "Tropical Signature — Mocha Taupe fabric",
        kind: "colour",
      },
      {
        id: "ts-02-studio",
        src: "/catalogue/tropical-signature/ts-02-sandstone-beige-clean.jpg",
        alt: "Tropical Signature — Sandstone Beige fabric",
        kind: "colour",
      },
      {
        id: "ts-03-studio",
        src: "/catalogue/tropical-signature/ts-03-dark-espresso-clean.jpg",
        alt: "Tropical Signature — Dark Espresso fabric",
        kind: "colour",
      },
      {
        id: "ts-04-studio",
        src: "/catalogue/tropical-signature/ts-04-soft-ivory-clean.jpg",
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
        src: "/catalogue/heritage-depth/hd-01-mist-stone-clean.jpg",
        alt: "Heritage Depth — Mist Stone fabric",
        kind: "colour",
      },
      {
        id: "hd-02-studio",
        src: "/catalogue/heritage-depth/hd-02-dark-espresso-clean.jpg",
        alt: "Heritage Depth — Dark Espresso fabric",
        kind: "colour",
      },
      {
        id: "hd-03-studio",
        src: "/catalogue/heritage-depth/hd-03-oxblood-burgundy-clean.jpg",
        alt: "Heritage Depth — Oxblood Burgundy fabric",
        kind: "colour",
      },
      {
        id: "hd-04-studio",
        src: "/catalogue/heritage-depth/hd-04-midnight-navy-clean.jpg",
        alt: "Heritage Depth — Midnight Navy fabric",
        kind: "colour",
      },
      {
        id: "hd-05-studio",
        src: "/catalogue/heritage-depth/hd-05-signature-black-clean.jpg",
        alt: "Heritage Depth — Signature Black fabric",
        kind: "colour",
      },
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-midnight-noir",
    slug: "midnight-noir",
    name: "Midnight Noir",
    category: "unstitched_fabric",
    sku: "FL-MN-01",
    description:
      "Midnight Noir unstitched fabric — 4 exact catalogue shades for the tailor’s table.",
    collectionSlugs: ["midnight-noir"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "mn-01",
        name: "Midnight Navy",
        hex: "#191925",
        available: true,
        imageIds: ["mn-01-studio"],
      },
      {
        id: "mn-02",
        name: "Deep Ink",
        hex: "#11141a",
        available: true,
        imageIds: ["mn-02-studio"],
      },
      {
        id: "mn-03",
        name: "Graphite Black",
        hex: "#17171a",
        available: true,
        imageIds: ["mn-03-studio"],
      },
      {
        id: "mn-04",
        name: "Olive Noir",
        hex: "#191c15",
        available: true,
        imageIds: ["mn-04-studio"],
      }
    ],
    images: [
      {
        id: "mn-01-studio",
        src: "/catalogue/midnight-noir/mn-01-midnight-navy-clean.jpg",
        alt: "Midnight Noir — Midnight Navy fabric",
        kind: "colour",
      },
      {
        id: "mn-02-studio",
        src: "/catalogue/midnight-noir/mn-02-deep-ink-clean.jpg",
        alt: "Midnight Noir — Deep Ink fabric",
        kind: "colour",
      },
      {
        id: "mn-03-studio",
        src: "/catalogue/midnight-noir/mn-03-graphite-black-clean.jpg",
        alt: "Midnight Noir — Graphite Black fabric",
        kind: "colour",
      },
      {
        id: "mn-04-studio",
        src: "/catalogue/midnight-noir/mn-04-olive-noir-clean.jpg",
        alt: "Midnight Noir — Olive Noir fabric",
        kind: "colour",
      }
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-dark-shades",
    slug: "dark-shades",
    name: "Dark Shades",
    category: "unstitched_fabric",
    sku: "FL-DS-01",
    description:
      "Dark Shades unstitched fabric — 4 exact catalogue shades for the tailor’s table.",
    collectionSlugs: ["dark-shades"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "ds-01",
        name: "Charcoal Black",
        hex: "#1f1c20",
        available: true,
        imageIds: ["ds-01-studio"],
      },
      {
        id: "ds-02",
        name: "Midnight Navy",
        hex: "#1a243d",
        available: true,
        imageIds: ["ds-02-studio"],
      },
      {
        id: "ds-03",
        name: "Forest Olive",
        hex: "#252a18",
        available: true,
        imageIds: ["ds-03-studio"],
      },
      {
        id: "ds-04",
        name: "Espresso Brown",
        hex: "#32201c",
        available: true,
        imageIds: ["ds-04-studio"],
      }
    ],
    images: [
      {
        id: "ds-01-studio",
        src: "/catalogue/dark-shades/ds-01-charcoal-black-clean.jpg",
        alt: "Dark Shades — Charcoal Black fabric",
        kind: "colour",
      },
      {
        id: "ds-02-studio",
        src: "/catalogue/dark-shades/ds-02-midnight-navy-clean.jpg",
        alt: "Dark Shades — Midnight Navy fabric",
        kind: "colour",
      },
      {
        id: "ds-03-studio",
        src: "/catalogue/dark-shades/ds-03-forest-olive-clean.jpg",
        alt: "Dark Shades — Forest Olive fabric",
        kind: "colour",
      },
      {
        id: "ds-04-studio",
        src: "/catalogue/dark-shades/ds-04-espresso-brown-clean.jpg",
        alt: "Dark Shades — Espresso Brown fabric",
        kind: "colour",
      }
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-walnut-pearl",
    slug: "walnut-pearl",
    name: "Walnut Pearl",
    category: "unstitched_fabric",
    sku: "FL-WP-01",
    description:
      "Walnut Pearl unstitched fabric — 3 exact catalogue shades for the tailor’s table.",
    collectionSlugs: ["walnut-pearl"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "wp-01",
        name: "Walnut Taupe",
        hex: "#786145",
        available: true,
        imageIds: ["wp-01-studio"],
      },
      {
        id: "wp-02",
        name: "Pearl Ivory",
        hex: "#dddcd7",
        available: true,
        imageIds: ["wp-02-studio"],
      },
      {
        id: "wp-03",
        name: "Midnight Charcoal",
        hex: "#1e1c1f",
        available: true,
        imageIds: ["wp-03-studio"],
      }
    ],
    images: [
      {
        id: "wp-01-studio",
        src: "/catalogue/walnut-pearl/wp-01-walnut-taupe-clean.jpg",
        alt: "Walnut Pearl — Walnut Taupe fabric",
        kind: "colour",
      },
      {
        id: "wp-02-studio",
        src: "/catalogue/walnut-pearl/wp-02-pearl-ivory-clean.jpg",
        alt: "Walnut Pearl — Pearl Ivory fabric",
        kind: "colour",
      },
      {
        id: "wp-03-studio",
        src: "/catalogue/walnut-pearl/wp-03-midnight-charcoal-clean.jpg",
        alt: "Walnut Pearl — Midnight Charcoal fabric",
        kind: "colour",
      }
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
  {
    id: "prod-walnut-onyx",
    slug: "walnut-onyx",
    name: "Walnut Onyx",
    category: "unstitched_fabric",
    sku: "FL-WO-01",
    description:
      "Walnut Onyx unstitched fabric — 4 exact catalogue shades for the tailor’s table.",
    collectionSlugs: ["walnut-onyx"],
    fabricType: "Unstitched fabric",
    season: "All-season",
    care: "Dry clean or gentle wash as advised by your tailor.",
    sellingMethod: "fixed_cut",
    cutOptions: [...FABRIC_METER_OPTIONS],
    colourVariants: [
      {
        id: "wo-01",
        name: "Walnut Brown",
        hex: "#2d251b",
        available: true,
        imageIds: ["wo-01-studio"],
      },
      {
        id: "wo-02",
        name: "Onyx Black",
        hex: "#151215",
        available: true,
        imageIds: ["wo-02-studio"],
      },
      {
        id: "wo-03",
        name: "Espresso Brown",
        hex: "#352b25",
        available: true,
        imageIds: ["wo-03-studio"],
      },
      {
        id: "wo-04",
        name: "Charcoal Grey",
        hex: "#545250",
        available: true,
        imageIds: ["wo-04-studio"],
      }
    ],
    images: [
      {
        id: "wo-01-studio",
        src: "/catalogue/walnut-onyx/wo-01-walnut-brown-clean.jpg",
        alt: "Walnut Onyx — Walnut Brown fabric",
        kind: "colour",
      },
      {
        id: "wo-02-studio",
        src: "/catalogue/walnut-onyx/wo-02-onyx-black-clean.jpg",
        alt: "Walnut Onyx — Onyx Black fabric",
        kind: "colour",
      },
      {
        id: "wo-03-studio",
        src: "/catalogue/walnut-onyx/wo-03-espresso-brown-clean.jpg",
        alt: "Walnut Onyx — Espresso Brown fabric",
        kind: "colour",
      },
      {
        id: "wo-04-studio",
        src: "/catalogue/walnut-onyx/wo-04-charcoal-grey-clean.jpg",
        alt: "Walnut Onyx — Charcoal Grey fabric",
        kind: "colour",
      }
    ],
    availability: "in_stock",
    publishStatus: "published",
    featured: true,
    newArrival: true,
  },
];
