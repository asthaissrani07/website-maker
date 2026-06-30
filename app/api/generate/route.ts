import { NextResponse } from "next/server";
import { generateProductSiteWithGroq } from "@/lib/groq";
import type { GenerateSiteRequest } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateSiteRequest;

    if (!body.productName?.trim() || !body.productDescription?.trim()) {
      return NextResponse.json(
        { error: "Product name and description are required for AI generation." },
        { status: 400 },
      );
    }

    const content = await generateProductSiteWithGroq({
      productName: body.productName.trim(),
      productDescription: body.productDescription.trim(),
      brandName: body.brandName?.trim(),
      price: body.price?.trim(),
      contactEmail: body.contactEmail?.trim(),
    });

    return NextResponse.json(content);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI generation failed.";
    const status = message.includes("GROQ_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
