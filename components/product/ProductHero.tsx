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

function HeroImage({
  imageSrc,
  productName,
  href,
  className = "",
}: {
  imageSrc: string;
  productName: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`ps-hero-image relative block overflow-hidden rounded-2xl bg-white shadow-xl transition hover:shadow-2xl active:scale-[0.99] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={productName}
        className="h-full w-full object-cover"
      />
    </Link>
  );
}

function HeroCopy({ centered = false }: { centered?: boolean }) {
  const { config, paths } = useProductSite();
  const align = centered ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col space-y-6 ${align}`}>
      <div
        className={`flex items-center gap-2 text-sm font-medium ps-accent ${centered ? "justify-center" : ""}`}
      >
        <span className="ps-star">★★★★★</span>
        <span>
          {config.rating} STARS FROM {config.reviewCount} REVIEWS
        </span>
      </div>
      <h2 className="ps-text ps-font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
        {config.heroHeadline}
      </h2>
      <p className="ps-text-muted max-w-2xl text-lg leading-relaxed">
        {config.heroSubtext}
      </p>
      <div
        className={`flex flex-wrap items-center gap-4 pt-2 ${centered ? "justify-center" : ""}`}
      >
        <Link
          href={paths.product}
          className="ps-btn inline-block rounded-sm px-8 py-4 text-sm font-semibold tracking-wide"
        >
          {config.ctaText} &gt;
        </Link>
        <span className="ps-text text-xl font-semibold">${config.price}</span>
      </div>
    </div>
  );
}

export function ProductHero() {
  const { config, paths } = useProductSite();
  const imageSrc = getImageSrc(config.imageBase64, config.imageMimeType);
  const layoutId = config.layoutId || "classic";

  if (layoutId === "centered") {
    return (
      <section
        id="shop"
        className="ps-section scroll-mt-24 px-4 py-12 md:px-6 md:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <ProductReveal>
            <HeroCopy centered />
          </ProductReveal>
          <ProductReveal delay={120} className="mt-10 flex justify-center">
            <HeroImage
              imageSrc={imageSrc}
              productName={config.productName}
              href={paths.product}
              className="aspect-square w-full max-w-md"
            />
          </ProductReveal>
        </div>
      </section>
    );
  }

  if (layoutId === "showcase") {
    return (
      <section id="shop" className="scroll-mt-24">
        <ProductReveal>
          <HeroImage
            imageSrc={imageSrc}
            productName={config.productName}
            href={paths.product}
            className="aspect-[21/9] w-full max-w-none rounded-none shadow-none"
          />
        </ProductReveal>
        <div className="ps-section px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto max-w-3xl">
            <ProductReveal delay={80}>
              <HeroCopy centered />
            </ProductReveal>
          </div>
        </div>
      </section>
    );
  }

  if (layoutId === "editorial") {
    return (
      <section
        id="shop"
        className="ps-section scroll-mt-24 px-4 py-12 md:px-6 md:py-20"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          <ProductReveal className="order-2 md:order-1">
            <HeroImage
              imageSrc={imageSrc}
              productName={config.productName}
              href={paths.product}
              className="aspect-[4/5] w-full max-w-lg"
            />
          </ProductReveal>
          <ProductReveal delay={120} className="order-1 space-y-6 md:order-2">
            <p className="ps-text-subtle text-xs font-semibold uppercase tracking-[0.2em]">
              {config.tagline}
            </p>
            <HeroCopy />
          </ProductReveal>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shop"
      className="ps-section scroll-mt-24 px-4 py-12 md:px-6 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <ProductReveal className="space-y-6">
          <HeroCopy />
        </ProductReveal>
        <ProductReveal delay={120} className="flex justify-center">
          <HeroImage
            imageSrc={imageSrc}
            productName={config.productName}
            href={paths.product}
            className="aspect-square w-full max-w-md"
          />
        </ProductReveal>
      </div>
    </section>
  );
}
