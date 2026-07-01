import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FadeIn } from "@/components/admin/FadeIn";
import { formatDisplayDateTime } from "@/lib/format-date";
import { getProductTheme } from "@/lib/product-themes";
import { getFontPair } from "@/lib/product-fonts";
import { getSite } from "@/lib/store";

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);

  if (!site) {
    notFound();
  }

  const downloadUrl = `/api/download/${id}`;
  const previewUrl = `/preview/${id}`;
  const theme = getProductTheme(site.themeId);
  const font = getFontPair(site.fontPairId);
  const customColors = [
    site.customAccentColor && { label: "Accent", value: site.customAccentColor },
    site.customButtonColor && { label: "Button", value: site.customButtonColor },
    site.customBackgroundColor && {
      label: "Background",
      value: site.customBackgroundColor,
    },
    site.customTextColor && { label: "Text", value: site.customTextColor },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <AdminLayout
      title={site.brandName}
      subtitle={site.productName}
      action={
        <div className="flex flex-wrap gap-2">
          <Link
            href={previewUrl}
            target="_blank"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-200"
          >
            Preview Site
          </Link>
          <a
            href={downloadUrl}
            className="admin-btn-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:scale-[1.02]"
          >
            Download ZIP
          </a>
        </div>
      }
    >
      <FadeIn>
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-purple-700"
          >
            ← Back to dashboard
          </Link>
          <time dateTime={site.createdAt} className="text-xs text-slate-500">
            Created {formatDisplayDateTime(site.createdAt)}
          </time>
        </div>
      </FadeIn>

      <div className="grid gap-5 lg:grid-cols-2">
        <FadeIn delay={100}>
          <section className="admin-card p-6">
            <h2 className="text-sm font-semibold text-slate-800">Site details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Theme</dt>
                <dd className="font-medium text-purple-700">{theme.name}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Fonts</dt>
                <dd className="font-medium text-purple-700">{font.name}</dd>
              </div>
              {customColors.length > 0 && (
                <div>
                  <dt className="text-slate-500">Custom colors</dt>
                  <dd className="flex flex-wrap gap-2">
                    {customColors.map((c) => (
                      <span
                        key={c.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-slate-200"
                          style={{ backgroundColor: c.value }}
                        />
                        {c.label}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-slate-500">Price</dt>
                <dd className="font-medium text-emerald-700">${site.price}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Hero headline</dt>
                <dd className="text-slate-800">{site.heroHeadline}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Contact email</dt>
                <dd className="text-slate-800">{site.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Stats</dt>
                <dd className="text-slate-800">
                  {site.stats.map((s, i) => (
                    <div key={i}>
                      {s.percentage}% — {s.description}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
        </FadeIn>

        <FadeIn delay={200}>
          <section className="admin-card p-6">
            <h2 className="text-sm font-semibold text-slate-800">
              How to run the download
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-slate-700">
              <li>
                Click <strong>Download ZIP</strong> to get the full Next.js project.
              </li>
              <li>Extract the ZIP to a folder on your computer.</li>
              <li>
                Open a terminal in that folder and run{" "}
                <code className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-800">
                  npm install
                </code>
                .
              </li>
              <li>
                Start the dev server with{" "}
                <code className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-800">
                  npm run dev
                </code>
                .
              </li>
              <li>
                Open{" "}
                <a
                  href="http://localhost:3000"
                  className="font-medium text-purple-700 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  http://localhost:3000
                </a>{" "}
                in your browser.
              </li>
            </ol>
          </section>
        </FadeIn>
      </div>

      <FadeIn delay={300}>
        <section className="admin-card mt-6 overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-medium text-slate-700">
            Live preview
          </div>
          <iframe
            src={previewUrl}
            title={`Preview of ${site.brandName}`}
            className="h-[700px] w-full bg-white"
          />
        </section>
      </FadeIn>
    </AdminLayout>
  );
}
