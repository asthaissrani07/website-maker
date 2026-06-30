import { NextResponse } from "next/server";
import { getSite } from "@/lib/store";
import { handleContact } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!getSite(siteId)) return jsonError("Site not found.", 404);
  const body = await req.json();
  const result = await handleContact(siteId, body);
  if (!result.ok) return jsonError(result.error);
  return NextResponse.json(result);
}
