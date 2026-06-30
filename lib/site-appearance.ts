import { getFontPair } from "./product-fonts";
import { getProductTheme } from "./product-themes";

export interface SiteAppearanceInput {
  themeId?: string;
  fontPairId?: string;
  customAccentColor?: string;
  customButtonColor?: string;
  customBackgroundColor?: string;
  customTextColor?: string;
}

function isValidHex(color?: string | null): color is string {
  if (!color) return false;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color.trim());
}

function normalizeHex(color: string): string {
  const c = color.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(c)) {
    return `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}`;
  }
  return c;
}

function darkenHex(hex: string, ratio = 0.12): string {
  const c = normalizeHex(hex).slice(1);
  const r = Math.max(0, Math.round(parseInt(c.slice(0, 2), 16) * (1 - ratio)));
  const g = Math.max(0, Math.round(parseInt(c.slice(2, 4), 16) * (1 - ratio)));
  const b = Math.max(0, Math.round(parseInt(c.slice(4, 6), 16) * (1 - ratio)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function mixWithWhite(hex: string, whiteRatio = 0.85): string {
  const c = normalizeHex(hex).slice(1);
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const mix = (v: number) =>
    Math.round(v * (1 - whiteRatio) + 255 * whiteRatio);
  return `#${mix(r).toString(16).padStart(2, "0")}${mix(g).toString(16).padStart(2, "0")}${mix(b).toString(16).padStart(2, "0")}`;
}

export function resolveSiteStyle(input: SiteAppearanceInput): Record<string, string> {
  const theme = getProductTheme(input.themeId);
  const fonts = getFontPair(input.fontPairId);
  const vars: Record<string, string> = { ...theme.vars };

  vars["--ps-font-display"] = fonts.display;
  vars["--ps-font-body"] = fonts.body;

  if (isValidHex(input.customAccentColor)) {
    const accent = normalizeHex(input.customAccentColor);
    vars["--ps-accent"] = accent;
    vars["--ps-accent-hover"] = darkenHex(accent);
    vars["--ps-stat-accent"] = accent;
    vars["--ps-badge-bg"] = accent;
    vars["--ps-star"] = accent;
  }

  if (isValidHex(input.customButtonColor)) {
    const btn = normalizeHex(input.customButtonColor);
    vars["--ps-btn-bg"] = btn;
    vars["--ps-btn-hover"] = darkenHex(btn);
    vars["--ps-banner-bg"] = btn;
    vars["--ps-banner-text"] = "#ffffff";
  }

  if (isValidHex(input.customBackgroundColor)) {
    const bg = normalizeHex(input.customBackgroundColor);
    vars["--ps-page-bg"] = bg;
    vars["--ps-section-bg"] = mixWithWhite(bg, 0.5);
    vars["--ps-section-alt"] = mixWithWhite(bg, 0.75);
    vars["--ps-header-bg"] = `${mixWithWhite(bg, 0.3)}f2`;
    vars["--ps-card-bg"] = mixWithWhite(bg, 0.55);
    vars["--ps-highlight-bg"] = mixWithWhite(bg, 0.4);
  }

  if (isValidHex(input.customTextColor)) {
    const text = normalizeHex(input.customTextColor);
    vars["--ps-text"] = text;
    vars["--ps-text-muted"] = `${text}aa`;
    vars["--ps-text-subtle"] = `${text}88`;
  }

  return vars;
}

export const DEFAULT_CUSTOM_COLORS = {
  customAccentColor: "",
  customButtonColor: "",
  customBackgroundColor: "",
  customTextColor: "",
};
