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

export function ProductDetailsPage() {
  const { config, addToCart, paths } = useProductSite();
  const imageSrc = getImageSrc(config.imageBase64, config.imageMimeType);

  return (
    <section className="ps-section px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Link href={paths.home} className="ps-accent mb-8 inline-block text-sm font-medium">
          ← Back to home
        </Link>
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <ProductReveal>
            <div className="ps-hero-image relative aspect-square overflow-hidden rounded-2xl bg-white shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={config.productName}
                className="h-full w-full object-cover"
              />
            </div>
          </ProductReveal>
          <ProductReveal delay={100} className="space-y-6">
            <p className="ps-text-subtle text-sm font-semibold uppercase tracking-widest">
              {config.brandName}
            </p>
            <h1 className="ps-text ps-font-display text-4xl font-bold md:text-5xl">
              {config.productName}
            </h1>
            <p className="ps-accent text-lg font-medium">{config.tagline}</p>
            <div className="flex items-center gap-2 text-sm font-medium ps-accent">
              <span className="ps-star">★★★★★</span>
              <span>
                {config.rating} · {config.reviewCount} reviews
              </span>
            </div>
            <p className="ps-text-muted text-lg leading-relaxed">
              {config.productDescription || config.heroSubtext}
            </p>
            <ul className="ps-text-muted space-y-2 text-sm">
              {config.stats.map((stat, i) => (
                <li key={i}>
                  <strong className="ps-stat">{stat.percentage}%</strong> —{" "}
                  {stat.description}
                </li>
              ))}
            </ul>
            <div className="ps-border border-t pt-6">
              <p className="ps-text text-3xl font-bold">${config.price}</p>
              <p className="ps-text-muted mt-1 text-sm">{config.shippingMessage}</p>
              <button
                type="button"
                onClick={() => void addToCart()}
                className="ps-btn mt-6 w-full rounded-sm px-8 py-4 text-sm font-semibold tracking-wide md:w-auto"
              >
                {config.ctaText} →
              </button>
            </div>
          </ProductReveal>
        </div>
      </div>
    </section>
  );
}
