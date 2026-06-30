import { NextResponse } from "next/server";
import { getSite } from "@/lib/store";
import { handleAuthLogout } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!(await getSite(siteId))) return jsonError("Site not found.", 404);
  const result = await handleAuthLogout(siteId);
  return NextResponse.json(result);
}
