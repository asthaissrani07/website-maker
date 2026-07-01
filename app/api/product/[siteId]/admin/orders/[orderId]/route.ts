import { NextResponse } from "next/server";
import { handleAdminUpdateOrder } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ siteId: string; orderId: string }> },
) {
  const { siteId, orderId } = await params;
  const body = await req.json();
  const result = await handleAdminUpdateOrder(siteId, orderId, body);
  if (!result.ok) return jsonError(result.error, result.error.includes("auth") ? 401 : 404);
  return NextResponse.json(result);
}
