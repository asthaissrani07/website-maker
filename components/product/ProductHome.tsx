"use client";

import { ContactForm } from "./ContactForm";
import { ProductHero } from "./ProductHero";
import { ProductReveal } from "./ProductReveal";
import { StatsSection } from "./StatsSection";

export function ProductHome() {
  return (
    <>
      <ProductHero />
      <StatsSection />
      <section
        id="contact"
        className="ps-section scroll-mt-24 px-4 py-16 md:px-6 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <ProductReveal>
            <h2 className="ps-text ps-font-display mb-10 text-center text-3xl font-bold">
              Contact form
            </h2>
          </ProductReveal>
          <ProductReveal delay={100}>
            <ContactForm />
          </ProductReveal>
        </div>
      </section>
    </>
  );
}
