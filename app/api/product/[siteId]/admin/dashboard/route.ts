import { NextResponse } from "next/server";
import {
  handleAdminDashboard,
  handleAdminLogin,
  handleAdminLogout,
} from "@/lib/product-backend/handlers";
import { jsonError } from "@/lib/product-backend/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const result = await handleAdminDashboard(siteId);
  if (!result.ok) return jsonError(result.error, 401);
  return NextResponse.json(result);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  const body = await req.json();
  const result = await handleAdminLogin(siteId, body);
  if (!result.ok) return jsonError(result.error, 401);
  return NextResponse.json(result);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ siteId: string }> },
) {
  const { siteId } = await params;
  await handleAdminLogout(siteId);
  return NextResponse.json({ ok: true });
}
