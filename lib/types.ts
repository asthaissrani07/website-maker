export interface StatItem {
  percentage: number;
  description: string;
}

export interface ProductSiteConfig {
  id: string;
  brandName: string;
  productName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  ctaText: string;
  price: string;
  shippingMessage: string;
  rating: string;
  reviewCount: string;
  productDescription: string;
  statsTitle: string;
  statsSubtitle: string;
  stats: StatItem[];
  imageBase64: string;
  imageMimeType: string;
  contactEmail: string;
  footerCopyright: string;
  themeId: string;
  fontPairId: string;
  customAccentColor: string;
  customButtonColor: string;
  customBackgroundColor: string;
  customTextColor: string;
  createdAt: string;
}

export type ProductSiteInput = Omit<ProductSiteConfig, "id" | "createdAt">;
