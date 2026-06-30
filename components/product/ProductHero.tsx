"use client";

import Link from "next/link";
import { useProductSite } from "./ProductSiteContext";
import { ProductReveal } from "./ProductReveal";

function getImageSrc(
  imageBase64: string | undefined,
  imageMimeType: string | undefined,
): string {
  if (imageBase64 && imageMimeType) {
    return `data:${imageMimeType};base64,${imageBase64}`;
  }
  return "/placeholder-product.svg";
}

export function ProductHero() {
  const { config, paths } = useProductSite();
  const imageSrc = getImageSrc(config.imageBase64, config.imageMimeType);

  return (
    <section id="shop" className="ps-section scroll-mt-24 px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <ProductReveal className="space-y-6">
          <div className="flex items-center gap-2 text-sm font-medium ps-accent">
            <span className="ps-star">★★★★★</span>
            <span>
              {config.rating} STARS FROM {config.reviewCount} REVIEWS
            </span>
          </div>
          <h2 className="ps-text ps-font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {config.heroHeadline}
          </h2>
          <p className="ps-text-muted text-lg leading-relaxed">{config.heroSubtext}</p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={paths.product}
              className="ps-btn inline-block rounded-sm px-8 py-4 text-sm font-semibold tracking-wide"
            >
              {config.ctaText} &gt;
            </Link>
            <span className="ps-text text-xl font-semibold">${config.price}</span>
          </div>
        </ProductReveal>
        <ProductReveal delay={120} className="flex justify-center">
          <Link
            href={paths.product}
            className="ps-hero-image relative block aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl transition hover:shadow-2xl active:scale-[0.99]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={config.productName}
              className="h-full w-full object-cover"
            />
          </Link>
        </ProductReveal>
      </div>
    </section>
  );
}
