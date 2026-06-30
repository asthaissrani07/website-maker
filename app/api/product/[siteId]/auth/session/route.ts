import { NextResponse } from "next/server";
import { getSite } from "@/lib/store";
import { handleAuthSession } from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  if (!(await getSite(siteId))) return jsonError("Site not found.", 404);
  const result = await handleAuthSession(siteId);
  return NextResponse.json(result);
}
