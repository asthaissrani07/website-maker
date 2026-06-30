"use client";

import { FONT_PAIRS } from "@/lib/product-fonts";
import { PRODUCT_THEMES } from "@/lib/product-themes";
import type { ProductSiteInput } from "@/lib/types";
import { ThemePicker } from "./ThemePicker";

type AppearanceFields = Pick<
  ProductSiteInput,
  | "themeId"
  | "fontPairId"
  | "customAccentColor"
  | "customButtonColor"
  | "customBackgroundColor"
  | "customTextColor"
>;

interface AppearanceCustomizerProps {
  value: AppearanceFields;
  onChange: <K extends keyof AppearanceFields>(
    key: K,
    val: AppearanceFields[K],
  ) => void;
}

const COLOR_FIELDS: {
  key: keyof AppearanceFields;
  label: string;
  hint: string;
}[] = [
  { key: "customAccentColor", label: "Accent color", hint: "Links, stats, highlights" },
  { key: "customButtonColor", label: "Button & banner", hint: "CTA buttons, top banner" },
  { key: "customBackgroundColor", label: "Background", hint: "Page & section backgrounds" },
  { key: "customTextColor", label: "Text color", hint: "Headings and body text" },
];

export function AppearanceCustomizer({ value, onChange }: AppearanceCustomizerProps) {
  const hasCustomColors = COLOR_FIELDS.some((f) => value[f.key]);

  function clearColors() {
    onChange("customAccentColor", "");
    onChange("customButtonColor", "");
    onChange("customBackgroundColor", "");
    onChange("customTextColor", "");
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-violet-700">
          Preset theme
        </h3>
        <ThemePicker
          value={value.themeId}
          onChange={(themeId) => onChange("themeId", themeId)}
        />
      </div>

      <div>
        <h3 className="mb-3 font-body text-sm font-semibold uppercase tracking-wider text-violet-700">
          Font pairing
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {FONT_PAIRS.map((font) => {
            const selected = value.fontPairId === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => onChange("fontPairId", font.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-violet-200/80 bg-white hover:border-violet-300"
                }`}
              >
                <p
                  className="text-lg font-semibold text-zinc-900"
                  style={{ fontFamily: font.display }}
                >
                  {font.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{font.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-violet-700">
            Custom colors
          </h3>
          {hasCustomColors && (
            <button
              type="button"
              onClick={clearColors}
              className="text-xs font-medium text-violet-600 hover:text-violet-800"
            >
              Reset to theme defaults
            </button>
          )}
        </div>
        <p className="mb-4 text-sm text-zinc-500">
          Optional — leave blank to use colors from the preset theme above.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {COLOR_FIELDS.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                {label}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={
                    (value[key] as string) ||
                    PRODUCT_THEMES.find((t) => t.id === value.themeId)?.preview[1] ||
                    "#8b6914"
                  }
                  onChange={(e) => onChange(key, e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-violet-200 bg-white p-1"
                />
                <input
                  type="text"
                  placeholder="#8b6914"
                  value={value[key] as string}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:border-violet-400"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-400">{hint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
