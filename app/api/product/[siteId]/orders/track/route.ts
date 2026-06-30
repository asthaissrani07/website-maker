import { NextResponse } from "next/server";
import { handleTrackOrder } from "@/lib/product-backend/handlers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const body = await req.json();
  const result = await handleTrackOrder(siteId, body);
  return NextResponse.json(result);
}
