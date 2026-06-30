"use client";

import { useEffect } from "react";
import { getFontPair } from "@/lib/product-fonts";

export function ProductFontLoader({ fontPairId }: { fontPairId: string }) {
  const pair = getFontPair(fontPairId);

  useEffect(() => {
    const id = `product-font-${pair.id}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = pair.googleFontsUrl;
    document.head.appendChild(link);
  }, [pair.googleFontsUrl, pair.id]);

  return null;
}
