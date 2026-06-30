import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminShell } from "@/components/admin/AdminShell";
import { FadeIn } from "@/components/admin/FadeIn";
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
    <AdminShell>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <FadeIn>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-body text-sm text-zinc-500 transition hover:text-emerald-700"
          >
            ← Back to dashboard
          </Link>

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-600">
                Project
              </p>
              <h1 className="font-display text-4xl font-light text-violet-800">
                {site.brandName}
              </h1>
              <p className="mt-1 font-body text-lg text-emerald-700">
                {site.productName}
              </p>
              <p className="mt-2 font-body text-sm text-zinc-400">
                Created {new Date(site.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={previewUrl}
                target="_blank"
                className="glass-card rounded-full px-5 py-2.5 font-body text-sm font-medium text-violet-700 transition hover:scale-[1.02]"
              >
                Preview Site
              </Link>
              <a
                href={downloadUrl}
                className="rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
              >
                Download ZIP
              </a>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={150}>
            <section className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-normal text-violet-800">
                Site details
              </h2>
              <dl className="mt-4 space-y-3 font-body text-sm">
              <div>
                <dt className="text-zinc-500">Theme</dt>
                <dd className="font-medium text-violet-700">{theme.name}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Fonts</dt>
                <dd className="font-medium text-violet-700">{font.name}</dd>
              </div>
              {customColors.length > 0 && (
                <div>
                  <dt className="text-zinc-500">Custom colors</dt>
                  <dd className="flex flex-wrap gap-2">
                    {customColors.map((c) => (
                      <span
                        key={c.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-violet-200"
                          style={{ backgroundColor: c.value }}
                        />
                        {c.label}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-zinc-500">Price</dt>
                  <dd className="font-medium text-emerald-700">${site.price}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Hero headline</dt>
                  <dd className="text-zinc-800">{site.heroHeadline}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Contact email</dt>
                  <dd className="text-zinc-800">{site.contactEmail}</dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Stats</dt>
                  <dd className="text-zinc-800">
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

          <FadeIn delay={250}>
            <section className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-lg font-normal text-emerald-800">
                How to run the download
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 font-body text-sm text-zinc-700">
                <li>
                  Click <strong>Download ZIP</strong> to get the full Next.js
                  project.
                </li>
                <li>Extract the ZIP to a folder on your computer.</li>
                <li>
                  Open a terminal in that folder and run{" "}
                  <code className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                    npm install
                  </code>
                  .
                </li>
                <li>
                  Start the dev server with{" "}
                  <code className="rounded bg-violet-100 px-1.5 py-0.5 text-violet-800">
                    npm run dev
                  </code>
                  .
                </li>
                <li>
                  Open{" "}
                  <a
                    href="http://localhost:3000"
                    className="font-medium text-emerald-700 underline"
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

        <FadeIn delay={350}>
          <section className="glass-card mt-8 overflow-hidden rounded-2xl">
            <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50/90 to-emerald-50/90 px-4 py-3 font-body text-sm font-medium text-violet-800">
              Live preview
            </div>
            <iframe
              src={previewUrl}
              title={`Preview of ${site.brandName}`}
              className="h-[700px] w-full bg-white"
            />
          </section>
        </FadeIn>
      </main>
    </AdminShell>
  );
}
