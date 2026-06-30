import { NextResponse } from "next/server";
import { handleCheckout } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const body = await req.json();
  const result = await handleCheckout(siteId, body);
  if (!result.ok) return jsonError(result.error);
  return NextResponse.json(result);
}
