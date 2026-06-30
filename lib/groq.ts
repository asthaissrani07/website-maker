import Groq from "groq-sdk";
import type { ProductSiteInput, StatItem } from "./types";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export interface GenerateSiteRequest {
  productName: string;
  productDescription: string;
  brandName?: string;
  price?: string;
  contactEmail?: string;
}

export interface GeneratedSiteContent {
  brandName: string;
  productName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  ctaText: string;
  price: string;
  shippingMessage: string;
  rating: string;
  reviewCount: string;
  productDescription: string;
  statsTitle: string;
  statsSubtitle: string;
  stats: StatItem[];
  contactEmail: string;
  footerCopyright: string;
}

function getClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add it to your .env.local file.",
    );
  }
  return new Groq({ apiKey });
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }

  return text.trim();
}

function normalizeStats(stats: unknown): StatItem[] {
  if (!Array.isArray(stats)) {
    return [
      { percentage: 90, description: "Reported improved results." },
      { percentage: 85, description: "Noticed a positive difference." },
      { percentage: 92, description: "Would recommend to others." },
    ];
  }

  return stats.slice(0, 5).map((item) => {
    const row = item as Record<string, unknown>;
    return {
      percentage: Math.min(
        100,
        Math.max(0, Number(row.percentage) || 90),
      ),
      description: String(row.description || "Positive customer feedback."),
    };
  });
}

function parseGeneratedContent(raw: unknown): GeneratedSiteContent {
  const data = raw as Record<string, unknown>;

  return {
    brandName: String(data.brandName || "Your Brand"),
    productName: String(data.productName || "Your Product"),
    tagline: String(data.tagline || ""),
    heroHeadline: String(data.heroHeadline || ""),
    heroSubtext: String(data.heroSubtext || ""),
    ctaText: String(data.ctaText || "SHOP NOW"),
    price: String(data.price || "49.99"),
    shippingMessage: String(
      data.shippingMessage || "FREE US SHIPPING ON ALL ORDERS $50+",
    ),
    rating: String(data.rating || "4.8"),
    reviewCount: String(data.reviewCount || "400+"),
    productDescription: String(data.productDescription || ""),
    statsTitle: String(data.statsTitle || "REAL RESULTS IN 30 DAYS"),
    statsSubtitle: String(
      data.statsSubtitle ||
        "We asked our customers how they felt after 4 weeks of daily use.",
    ),
    stats: normalizeStats(data.stats),
    contactEmail: String(data.contactEmail || "hello@example.com"),
    footerCopyright: String(
      data.footerCopyright || "2026, Your Brand. All rights reserved.",
    ),
  };
}

export async function generateProductSiteWithGroq(
  input: GenerateSiteRequest,
): Promise<
  Omit<
    ProductSiteInput,
    | "imageBase64"
    | "imageMimeType"
    | "themeId"
    | "fontPairId"
    | "customAccentColor"
    | "customButtonColor"
    | "customBackgroundColor"
    | "customTextColor"
  >
> {
  const client = getClient();
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  const brandHint = input.brandName
    ? `Brand name: ${input.brandName}`
    : "Infer a compelling brand name from the product.";
  const priceHint = input.price
    ? `Price: $${input.price}`
    : "Suggest a realistic USD price.";
  const emailHint = input.contactEmail
    ? `Contact email: ${input.contactEmail}`
    : "Use a professional placeholder email for the brand.";

  const prompt = `You are an expert e-commerce copywriter. Generate landing page content for a product website styled like a premium DTC supplement/wellness brand (similar to Corevita).

Product name: ${input.productName}
Product description: ${input.productDescription}
${brandHint}
${priceHint}
${emailHint}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "brandName": "string",
  "productName": "string",
  "tagline": "string - short product tagline",
  "heroHeadline": "string - bold ALL CAPS emotional headline, 1-2 lines",
  "heroSubtext": "string - 2-3 sentences selling the product benefits",
  "ctaText": "string - short CTA button text in ALL CAPS",
  "price": "string - numeric price without dollar sign e.g. 49.99",
  "shippingMessage": "string - banner text e.g. FREE US SHIPPING ON ALL ORDERS $50+",
  "rating": "string - e.g. 4.8",
  "reviewCount": "string - e.g. 400+",
  "productDescription": "string - SEO meta description, 1-2 sentences",
  "statsTitle": "string - e.g. REAL RESULTS IN 30 DAYS",
  "statsSubtitle": "string - intro to customer survey results",
  "stats": [
    { "percentage": 93, "description": "string - customer result stat" },
    { "percentage": 89, "description": "string" },
    { "percentage": 95, "description": "string" }
  ],
  "contactEmail": "string",
  "footerCopyright": "string - e.g. 2026, Brand Name. All rights reserved."
}

Make copy persuasive, specific to the product, and conversion-focused. Stats percentages should be between 85-98.`;

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You output only valid JSON objects. Never include markdown fences or extra text.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 2048,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(content));
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }

  const generated = parseGeneratedContent(parsed);

  if (input.brandName) generated.brandName = input.brandName;
  if (input.productName) generated.productName = input.productName;
  if (input.price) generated.price = input.price.replace(/^\$/, "");
  if (input.contactEmail) generated.contactEmail = input.contactEmail;

  return generated;
}
