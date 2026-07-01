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
        <h3 className="admin-label mb-3 text-sm font-semibold uppercase tracking-wider text-purple-800">
          Preset theme
        </h3>
        <ThemePicker
          value={value.themeId}
          onChange={(themeId) => onChange("themeId", themeId)}
        />
      </div>

      <div>
        <h3 className="admin-label mb-3 text-sm font-semibold uppercase tracking-wider text-purple-800">
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
                    ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                    : "border-slate-300 bg-white hover:border-purple-300"
                }`}
              >
                <div
                  className="text-lg font-semibold text-slate-900"
                  style={{ fontFamily: font.display }}
                >
                  {font.name}
                </div>
                <div className="mt-1 text-xs text-slate-600">{font.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="admin-label text-sm font-semibold uppercase tracking-wider text-purple-800">
            Custom colors
          </h3>
          {hasCustomColors && (
            <button
              type="button"
              onClick={clearColors}
              className="text-xs font-medium text-purple-700 hover:text-purple-900"
            >
              Reset to theme defaults
            </button>
          )}
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Optional — leave blank to use colors from the preset theme above.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {COLOR_FIELDS.map(({ key, label, hint }) => (
            <div key={key} className="admin-form-field">
              <label className="admin-label">{label}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={
                    (value[key] as string) ||
                    PRODUCT_THEMES.find((t) => t.id === value.themeId)?.preview[1] ||
                    "#8b6914"
                  }
                  onChange={(e) => onChange(key, e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                />
                <input
                  type="text"
                  placeholder="#8b6914"
                  value={value[key] as string}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="admin-input flex-1 font-mono"
                />
              </div>
              <div className="text-xs text-slate-500">{hint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
