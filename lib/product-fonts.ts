export interface FontPair {
  id: string;
  name: string;
  description: string;
  display: string;
  body: string;
  googleFontsUrl: string;
}

export const FONT_PAIRS: FontPair[] = [
  {
    id: "inter",
    name: "Inter",
    description: "Clean modern sans-serif — ZettaJoule-style body",
    display: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
  },
  {
    id: "playfair-source",
    name: "Playfair & Source",
    description: "Elegant serif headlines with readable body",
    display: "'Playfair Display', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap",
  },
  {
    id: "lora-open",
    name: "Lora & Open Sans",
    description: "Classic editorial serif + friendly sans",
    display: "'Lora', Georgia, serif",
    body: "'Open Sans', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Open+Sans:wght@300;400;600&display=swap",
  },
  {
    id: "space-inter",
    name: "Space Grotesk & Inter",
    description: "Geometric display with crisp body text",
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap",
  },
  {
    id: "merriweather",
    name: "Merriweather & Source",
    description: "Trustworthy serif for product brands",
    display: "'Merriweather', Georgia, serif",
    body: "'Source Sans 3', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@300;400;600&display=swap",
  },
  {
    id: "poppins",
    name: "Poppins",
    description: "Rounded, friendly all-round sans",
    display: "'Poppins', system-ui, sans-serif",
    body: "'Poppins', system-ui, sans-serif",
    googleFontsUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  },
];

export const DEFAULT_FONT_PAIR_ID = "inter";

export function getFontPair(fontPairId?: string): FontPair {
  return (
    FONT_PAIRS.find((f) => f.id === fontPairId) ??
    FONT_PAIRS.find((f) => f.id === DEFAULT_FONT_PAIR_ID)!
  );
}
