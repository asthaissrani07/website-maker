import { NextResponse } from "next/server";
import { handleGetOrder } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ siteId: string; orderId: string }> },
) {
  const { siteId, orderId } = await params;
  const email = new URL(req.url).searchParams.get("email") ?? "";
  if (!email) return jsonError("Email is required.", 400);

  const result = await handleGetOrder(siteId, orderId, email);
  if (!result.ok) return jsonError(result.error, 404);
  return NextResponse.json(result);
}
