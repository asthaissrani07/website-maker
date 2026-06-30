"use client";

import Link from "next/link";
import { useProductSite } from "./ProductSiteContext";
import { ProductReveal } from "./ProductReveal";

export function LegalPageView({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const { paths } = useProductSite();

  return (
    <section className="ps-section px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link href={paths.home} className="ps-accent mb-8 inline-block text-sm font-medium">
          ← Back to home
        </Link>
        <ProductReveal>
          <h1 className="ps-text ps-font-display text-3xl font-bold md:text-4xl">
            {title}
          </h1>
          <div className="ps-text-muted mt-8 whitespace-pre-line text-sm leading-relaxed md:text-base">
            {body}
          </div>
        </ProductReveal>
      </div>
    </section>
  );
}
