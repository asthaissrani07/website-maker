import { NextResponse } from "next/server";
import { createSite, getAllSites } from "@/lib/store";
import type { ProductSiteInput } from "@/lib/types";

export async function GET() {
  const sites = (await getAllSites()).map((site) => ({
    id: site.id,
    brandName: site.brandName,
    productName: site.productName,
    price: site.price,
    createdAt: site.createdAt,
  }));
  return NextResponse.json(sites);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductSiteInput;

    if (!body.brandName || !body.productName || !body.heroHeadline) {
      return NextResponse.json(
        { error: "Brand name, product name, and hero headline are required." },
        { status: 400 },
      );
    }

    const site = await createSite(body);
    return NextResponse.json(site, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }
}
