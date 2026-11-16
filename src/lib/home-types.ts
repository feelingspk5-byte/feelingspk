export type HomeCategoryCard = {
  slug: string;
  name: string;
  detail: string;
  image: string;
  href: string;
  badge: string | null;
};

export type HomeCollectionCard = {
  slug: string;
  name: string;
  detail: string;
  image: string;
  href: string;
};

export type HomeFabricCard = {
  slug: string;
  name: string;
  detail: string;
  image: string;
  tag: string;
};

export type LaunchOfferContent = {
  percent: number;
  title: string;
  body: string;
  freeDelivery: boolean;
  shopHref: string;
} | null;
