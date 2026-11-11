import { demoHero } from "@/data/demo-home";
import type { CmsContent, ShippingZone } from "@/lib/store/types";

export function defaultCms(): CmsContent {
  return {
    hero: {
      eyebrow: demoHero.eyebrow,
      title: demoHero.title,
      subtitle: demoHero.subtitle,
      slides: demoHero.slides.map((s) => ({ ...s })),
    },
    about: {
      title: "About FEELINGS",
      body: "FEELINGS is an Elite Men's Collection of unstitched fabric, stitched shalwar kameez, and dress shirts — quiet luxury for the modern gentleman.",
    },
    contact: {
      title: "Contact",
      body: "Reach FEELINGS on WhatsApp or email. We confirm every Cash on Delivery order before dispatch.",
    },
    faq: [
      {
        question: "Do you offer Cash on Delivery?",
        answer:
          "Yes. COD is available across Pakistan. We confirm your order on WhatsApp before dispatch.",
      },
      {
        question: "Can I order custom fabric length?",
        answer:
          "Yes. Choose a metre option on the product page, or message us on WhatsApp for a custom length.",
      },
      {
        question: "When will stitched pieces ship?",
        answer:
          "Stitched shalwar kameez and dress shirts are listed as Coming soon until stock is confirmed.",
      },
    ],
    footerNote: "FEELINGS — Elite Men's Collection",
  };
}

export function defaultShippingZones(): ShippingZone[] {
  return [
    {
      id: "zone-lahore",
      name: "Lahore",
      cities: ["lahore"],
      rate: 250,
      freeAbove: 15000,
      active: true,
    },
    {
      id: "zone-major",
      name: "Major cities",
      cities: ["karachi", "islamabad", "rawalpindi", "faisalabad", "multan"],
      rate: 350,
      freeAbove: 20000,
      active: true,
    },
    {
      id: "zone-nationwide",
      name: "Rest of Pakistan",
      cities: ["*"],
      rate: 450,
      freeAbove: 25000,
      active: true,
    },
  ];
}
