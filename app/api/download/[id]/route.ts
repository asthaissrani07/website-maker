import { NextResponse } from "next/server";
import { generateSiteZip } from "@/lib/generate-site";
import { getSite } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const site = await getSite(id);

  if (!site) {
    return NextResponse.json({ error: "Site not found." }, { status: 404 });
  }

  const zipBuffer = await generateSiteZip(site);
  const filename =
    site.brandName.toLowerCase().replace(/\s+/g, "-") + "-site.zip";

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
