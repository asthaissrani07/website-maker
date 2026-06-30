import { NextResponse } from "next/server";
import { handleAuthLogout } from "@/lib/product-backend/handlers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const result = await handleAuthLogout(siteId);
  return NextResponse.json(result);
}
