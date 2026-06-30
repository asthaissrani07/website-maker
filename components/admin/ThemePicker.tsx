"use client";

import { PRODUCT_THEMES } from "@/lib/product-themes";

interface ThemePickerProps {
  value: string;
  onChange: (themeId: string) => void;
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PRODUCT_THEMES.map((theme) => {
        const selected = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`rounded-xl border p-4 text-left transition ${
              selected
                ? "border-violet-500 bg-violet-50 ring-2 ring-violet-300"
                : "border-violet-200/80 bg-white hover:border-emerald-300"
            }`}
          >
            <div className="mb-3 flex gap-1">
              {theme.preview.map((color) => (
                <span
                  key={color}
                  className="h-6 flex-1 rounded-md"
                  style={{ background: color }}
                />
              ))}
            </div>
            <p className="font-medium text-zinc-900">{theme.name}</p>
            <p className="mt-1 text-xs text-zinc-500">{theme.description}</p>
          </button>
        );
      })}
    </div>
  );
}
