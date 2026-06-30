import { NextResponse } from "next/server";
import { deleteSite, getSite } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const site = await getSite(id);

  if (!site) {
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }

  return NextResponse.json(site);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deleted = await deleteSite(id);

  if (!deleted) {
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
