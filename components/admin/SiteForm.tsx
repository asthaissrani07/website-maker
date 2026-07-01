"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { defaultSiteInput } from "@/lib/defaults";
import type { ProductSiteInput, StatItem } from "@/lib/types";
import { FadeIn } from "./FadeIn";
import { AppearanceCustomizer } from "./AppearanceCustomizer";

function emptyStat(): StatItem {
  return { percentage: 90, description: "" };
}

export function SiteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [aiBrief, setAiBrief] = useState({
    productName: "",
    productDescription: "",
    brandName: "",
    price: "",
    contactEmail: "",
  });
  const [form, setForm] = useState<ProductSiteInput>({ ...defaultSiteInput });

  function updateField<K extends keyof ProductSiteInput>(
    key: K,
    value: ProductSiteInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateStat(index: number, field: keyof StatItem, value: string | number) {
    setForm((prev) => {
      const stats = [...prev.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...prev, stats };
    });
  }

  function addStat() {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, emptyStat()],
    }));
  }

  function removeStat(index: number) {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      updateField("imageBase64", base64);
      updateField("imageMimeType", file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerateWithAI() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiBrief),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI generation failed");
      }

      setForm((prev) => ({
        ...data,
        themeId: prev.themeId,
        fontPairId: prev.fontPairId,
        customAccentColor: prev.customAccentColor,
        customButtonColor: prev.customButtonColor,
        customBackgroundColor: prev.customBackgroundColor,
        customTextColor: prev.customTextColor,
        imageBase64: prev.imageBase64,
        imageMimeType: prev.imageMimeType,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create site");
      }

      const site = await res.json();
      router.refresh();
      router.push(`/sites/${site.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-violet-200/80 bg-white/90 px-4 py-2.5 font-body text-zinc-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";
  const labelClass =
    "mb-1.5 block font-body text-xs font-medium uppercase tracking-wider text-zinc-600";
  const sectionClass = "glass-card rounded-2xl p-6 transition duration-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <FadeIn delay={80}>
      <section className="rounded-2xl border border-violet-300/40 bg-gradient-to-br from-violet-50/90 via-white/80 to-emerald-50/90 p-6 shadow-sm backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-violet-200 to-emerald-200 px-2.5 py-0.5 font-body text-xs font-medium text-violet-900">
            Groq AI
          </span>
          <h2 className="font-display text-lg font-normal text-zinc-900">
            Generate website content
          </h2>
        </div>
        <p className="mb-4 font-body text-sm font-light leading-relaxed text-zinc-600">
          Describe your product and Groq will write the headline, hero copy,
          stats, and all landing-page text. You can edit everything before
          building.
        </p>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Product name *</label>
              <input
                className={inputClass}
                placeholder="e.g. VitaGlow Serum"
                value={aiBrief.productName}
                onChange={(e) =>
                  setAiBrief((p) => ({ ...p, productName: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Brand name (optional)</label>
              <input
                className={inputClass}
                placeholder="Leave blank to let AI suggest"
                value={aiBrief.brandName}
                onChange={(e) =>
                  setAiBrief((p) => ({ ...p, brandName: e.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Product description *</label>
            <textarea
              rows={4}
              className={inputClass}
              placeholder="Describe what your product does, who it's for, key ingredients or features, and main benefits..."
              value={aiBrief.productDescription}
              onChange={(e) =>
                setAiBrief((p) => ({
                  ...p,
                  productDescription: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Price (optional)</label>
              <input
                className={inputClass}
                placeholder="e.g. 49.99"
                value={aiBrief.price}
                onChange={(e) =>
                  setAiBrief((p) => ({ ...p, price: e.target.value }))
                }
              />
            </div>
            <div>
              <label className={labelClass}>Contact email (optional)</label>
              <input
                type="email"
                className={inputClass}
                placeholder="hello@yourbrand.com"
                value={aiBrief.contactEmail}
                onChange={(e) =>
                  setAiBrief((p) => ({ ...p, contactEmail: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            type="button"
            disabled={generating || !aiBrief.productName || !aiBrief.productDescription}
            onClick={handleGenerateWithAI}
            className="rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 py-3 font-body text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50"
          >
            {generating ? "Generating with Groq AI..." : "Generate content with AI"}
          </button>
        </div>
      </section>
      </FadeIn>

      <FadeIn delay={120}>
        <section className={sectionClass}>
          <h2 className="mb-2 font-display text-lg font-normal text-zinc-900">
            Website appearance
          </h2>
          <p className="mb-4 font-body text-sm text-zinc-500">
            Choose a preset theme, font pairing, and optional custom colors for
            your product website.
          </p>
          <AppearanceCustomizer
            value={{
              themeId: form.themeId,
              fontPairId: form.fontPairId,
              customAccentColor: form.customAccentColor,
              customButtonColor: form.customButtonColor,
              customBackgroundColor: form.customBackgroundColor,
              customTextColor: form.customTextColor,
            }}
            onChange={updateField}
          />
        </section>
      </FadeIn>

      <FadeIn delay={160}>
      <section className={sectionClass}>
        <h2 className="mb-4 font-display text-lg font-normal text-zinc-900">Brand & Product</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Brand Name</label>
            <input
              required
              className={inputClass}
              value={form.brandName}
              onChange={(e) => updateField("brandName", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Product Name</label>
            <input
              required
              className={inputClass}
              value={form.productName}
              onChange={(e) => updateField("productName", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Tagline</label>
            <input
              className={inputClass}
              value={form.tagline}
              onChange={(e) => updateField("tagline", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Price (USD)</label>
            <input
              required
              className={inputClass}
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Shipping Banner Message</label>
            <input
              className={inputClass}
              value={form.shippingMessage}
              onChange={(e) => updateField("shippingMessage", e.target.value)}
            />
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn delay={240}>
      <section className={sectionClass}>
        <h2 className="mb-4 font-display text-lg font-normal text-zinc-900">Hero Section</h2>
        <div className="grid gap-4">
          <div>
            <label className={labelClass}>Hero Headline</label>
            <textarea
              required
              rows={2}
              className={inputClass}
              value={form.heroHeadline}
              onChange={(e) => updateField("heroHeadline", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Hero Subtext</label>
            <textarea
              required
              rows={3}
              className={inputClass}
              value={form.heroSubtext}
              onChange={(e) => updateField("heroSubtext", e.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelClass}>CTA Button Text</label>
              <input
                className={inputClass}
                value={form.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Rating (e.g. 4.8)</label>
              <input
                className={inputClass}
                value={form.rating}
                onChange={(e) => updateField("rating", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Review Count (e.g. 400+)</label>
              <input
                className={inputClass}
                value={form.reviewCount}
                onChange={(e) => updateField("reviewCount", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn delay={320}>
      <section className={sectionClass}>
        <h2 className="mb-4 font-display text-lg font-normal text-zinc-900">Product Image</h2>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-violet-100 file:to-emerald-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-800 hover:file:from-violet-200 hover:file:to-emerald-200"
        />
        {form.imageBase64 && (
          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:${form.imageMimeType};base64,${form.imageBase64}`}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover"
            />
          </div>
        )}
      </section>
      </FadeIn>

      <FadeIn delay={400}>
      <section className={sectionClass}>
        <h2 className="mb-4 font-display text-lg font-normal text-zinc-900">Results Stats</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Stats Section Title</label>
            <input
              className={inputClass}
              value={form.statsTitle}
              onChange={(e) => updateField("statsTitle", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Stats Subtitle</label>
            <input
              className={inputClass}
              value={form.statsSubtitle}
              onChange={(e) => updateField("statsSubtitle", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {form.stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-violet-100 bg-gradient-to-r from-violet-50/40 to-emerald-50/40 p-4"
            >
              <div className="w-24">
                <label className={labelClass}>%</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  value={stat.percentage}
                  onChange={(e) =>
                    updateStat(index, "percentage", Number(e.target.value))
                  }
                />
              </div>
              <div className="min-w-0 flex-1">
                <label className={labelClass}>Description</label>
                <input
                  required
                  className={inputClass}
                  value={stat.description}
                  onChange={(e) => updateStat(index, "description", e.target.value)}
                />
              </div>
              {form.stats.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          >
            + Add stat
          </button>
        </div>
      </section>
      </FadeIn>

      <FadeIn delay={480}>
      <section className={sectionClass}>
        <h2 className="mb-4 font-display text-lg font-normal text-zinc-900">Contact & Footer</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Contact Email</label>
            <input
              required
              type="email"
              className={inputClass}
              value={form.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Footer Copyright</label>
            <input
              className={inputClass}
              value={form.footerCopyright}
              onChange={(e) => updateField("footerCopyright", e.target.value)}
            />
          </div>
        </div>
      </section>
      </FadeIn>

      <FadeIn delay={560}>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 py-3.5 font-body text-sm font-semibold text-white shadow-md shadow-violet-200/50 transition hover:scale-[1.01] hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Building your site..." : "Build Product Website"}
      </button>
      </FadeIn>
    </form>
  );
}
