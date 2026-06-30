import { NextResponse } from "next/server";
import { handleAuthSession } from "@/lib/product-backend/handlers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const result = await handleAuthSession(siteId);
  return NextResponse.json(result);
}
