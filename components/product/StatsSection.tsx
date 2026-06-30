"use client";

import { useProductSite } from "./ProductSiteContext";

export function StatsSection() {
  const { config } = useProductSite();

  return (
    <section className="ps-section-alt px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="ps-text ps-font-display text-3xl font-bold tracking-tight md:text-4xl">
          {config.statsTitle}
        </h2>
        <p className="ps-text-muted mx-auto mt-4 max-w-2xl text-lg">
          {config.statsSubtitle}
        </p>
        <h3 className="ps-text-subtle mt-10 text-sm font-semibold uppercase tracking-widest">
          Here is what they said:
        </h3>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {config.stats.map((stat, index) => (
            <div
              key={index}
              className="ps-card rounded-xl border p-8 transition hover:shadow-md"
            >
              <div className="ps-stat ps-font-display text-5xl font-bold md:text-6xl">
                {stat.percentage}%
              </div>
              <p className="ps-text-muted mt-4 text-base leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
