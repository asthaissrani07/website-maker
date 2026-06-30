import { NextResponse } from "next/server";
import { handleContact } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const body = await req.json();
  const result = await handleContact(siteId, body);
  if (!result.ok) return jsonError(result.error);
  return NextResponse.json(result);
}
