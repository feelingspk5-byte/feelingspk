/**
 * Homepage marketing — brand hero imagery restored; collections = Tropical + Heritage only.
 */
export const demoHero = {
  eyebrow: "Elite Men's Collection",
  title: "Quiet luxury for the modern gentleman",
  subtitle:
    "FEELINGS brings together unstitched cloth, stitched shalwar kameez, and dress shirts — considered fabrics and silhouettes for every occasion.",
  /** Full-bleed brand photography — rotate every 5s */
  slides: [
    {
      src: "/brand/hero/shalwar-kameez-wide.jpg",
      alt: "Gentleman in ivory stitched shalwar kameez",
      label: "Stitched Shalwar Kameez",
      position: "object-[center_22%] md:object-center",
    },
    {
      src: "/brand/hero/fabric-atelier-right.jpg",
      alt: "Three folded fabrics on a right-side table — cream, camel, and navy — with open wall on the left",
      label: "Unstitched Fabric",
      position: "object-[78%_62%] md:object-[70%_55%]",
    },
    {
      src: "/brand/hero/dress-shirt-formal.jpg",
      alt: "Crisp white formal dress shirt on wooden hanger",
      label: "Dress Shirts",
      position: "object-[55%_30%] md:object-[62%_34%]",
    },
  ],
};

/** Homepage category / collection tiles — Tropical Signature + Heritage Depth only */
export const demoCategories = [
  {
    slug: "tropical-signature",
    name: "Tropical Signature",
    detail: "Mocha taupe, sandstone beige, dark espresso, soft ivory.",
    image: "/catalogue/tropical-signature/ts-01-mocha-taupe-clean.jpg",
    href: "/collections/tropical-signature",
    badge: null as string | null,
  },
  {
    slug: "heritage-depth",
    name: "Heritage Depth",
    detail: "Mist stone, espresso, oxblood, midnight navy, signature black.",
    image: "/catalogue/heritage-depth/hd-01-mist-stone-clean.jpg",
    href: "/collections/heritage-depth",
    badge: null as string | null,
  },
];

export const demoCollections = [
  {
    slug: "tropical-signature",
    name: "Tropical Signature",
    detail: "Four considered neutrals for everyday formal calm.",
    image: "/catalogue/tropical-signature/ts-02-sandstone-beige-clean.jpg",
  },
  {
    slug: "heritage-depth",
    name: "Heritage Depth",
    detail: "Five enduring shades for deeper formal presence.",
    image: "/catalogue/heritage-depth/hd-03-oxblood-burgundy-clean.jpg",
  },
];

export const demoFabrics = [
  {
    slug: "tropical-signature",
    name: "Tropical Signature",
    detail: "Four exact catalogue shades.",
    image: "/catalogue/tropical-signature/ts-01-mocha-taupe-clean.jpg",
    tag: "Fabric",
  },
  {
    slug: "heritage-depth",
    name: "Heritage Depth",
    detail: "Five exact catalogue shades.",
    image: "/catalogue/heritage-depth/hd-02-dark-espresso-clean.jpg",
    tag: "Fabric",
  },
];

export const demoEditorial = {
  image: "/brand/editorial-one-house.jpg",
  eyebrow: "The house",
  title: "One house. Three ways to dress.",
  body: "FEELINGS is built for men who value fabric as much as form — unstitched cloth for the tailor’s bench, stitched shalwar kameez for everyday presence, and dress shirts that finish the look.",
};

export const demoAssurances = [
  {
    title: "Crafted with intent",
    body: "Every line is curated for colour, hand-feel, and how it sits on the body — never rushed, never generic.",
  },
  {
    title: "Cloth to silhouette",
    body: "Move from fabric collections into ready shalwar kameez and shirts as the house expands — one coherent wardrobe.",
  },
  {
    title: "A considered experience",
    body: "Sign in to save your details, browse with clarity, and checkout when you are ready.",
  },
];
