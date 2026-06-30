import { NextResponse } from "next/server";
import { getSite } from "@/lib/store";
import {
  handleAddCart,
  handleGetCart,
  handleRemoveCart,
  handleUpdateCart,
} from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!getSite(siteId)) return jsonError("Site not found.", 404);
  const result = await handleGetCart(siteId);
  return NextResponse.json(result);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!getSite(siteId)) return jsonError("Site not found.", 404);
  const body = await req.json();
  const result = await handleAddCart(siteId, body);
  if (!result.ok) return jsonError(result.error);
  return NextResponse.json(result);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!getSite(siteId)) return jsonError("Site not found.", 404);
  const body = await req.json();
  const result = await handleUpdateCart(siteId, body);
  if (!result.ok) return jsonError(result.error);
  return NextResponse.json(result);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!getSite(siteId)) return jsonError("Site not found.", 404);
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return jsonError("productId is required.");
  const result = await handleRemoveCart(siteId, productId);
  return NextResponse.json(result);
}
