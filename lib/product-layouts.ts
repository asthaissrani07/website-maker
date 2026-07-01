export interface ProductLayout {
  id: string;
  name: string;
  description: string;
}

export const PRODUCT_LAYOUTS: ProductLayout[] = [
  {
    id: "classic",
    name: "Classic split",
    description: "Text left, product image right — Corevita-style landing",
  },
  {
    id: "centered",
    name: "Centered hero",
    description: "Centered headline with image below — clean & minimal",
  },
  {
    id: "showcase",
    name: "Showcase",
    description: "Full-width product image with content underneath",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Large image left, story-driven copy on the right",
  },
];

export function getProductLayout(layoutId: string): ProductLayout {
  return (
    PRODUCT_LAYOUTS.find((l) => l.id === layoutId) ?? PRODUCT_LAYOUTS[0]
  );
}
