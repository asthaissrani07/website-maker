import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminShell } from "@/components/admin/AdminShell";
import { FadeIn } from "@/components/admin/FadeIn";
import { getAllSites } from "@/lib/store";

export default async function DashboardPage() {
  const sites = await getAllSites();

  return (
    <AdminShell>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <FadeIn>
          <div className="mb-10">
            <p className="label-style mb-3 text-xs font-medium uppercase tracking-[0.2em] text-violet-600">
              Website Maker
            </p>
            <h1 className="font-display text-4xl font-light tracking-tight text-zinc-900 md:text-5xl">
              Admin{" "}
              <span className="bg-gradient-to-r from-violet-700 to-emerald-600 bg-clip-text font-normal text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg font-light leading-relaxed text-zinc-600">
              Create beautiful Next.js product landing pages powered by Groq AI.
              Describe your product, generate copy, preview the site, and download
              a ready-to-run project.
            </p>
          </div>
        </FadeIn>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <FadeIn delay={100}>
            <div className="glass-card rounded-2xl p-6 transition duration-500">
              <div className="font-display text-4xl font-light text-violet-700">
                {sites.length}
              </div>
              <div className="mt-2 font-body text-sm text-zinc-500">Sites created</div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="glass-card rounded-2xl p-6 transition duration-500">
              <div className="font-display text-4xl font-light text-emerald-600">
                Groq AI
              </div>
              <div className="mt-2 font-body text-sm text-zinc-500">
                Content generation
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={300}>
            <Link
              href="/create"
              className="glass-card flex h-full min-h-[120px] items-center justify-center rounded-2xl border-dashed p-6 text-center font-body text-sm font-medium text-violet-800 transition duration-500 hover:scale-[1.01]"
            >
              + Create new product site
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={400}>
          <section>
            <h2 className="font-display text-xl font-light text-zinc-900">
              Your product sites
            </h2>
            {sites.length === 0 ? (
              <div className="glass-card mt-4 rounded-2xl px-6 py-16 text-center">
                <p className="font-body text-zinc-500">No sites yet.</p>
                <Link
                  href="/create"
                  className="mt-4 inline-block rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-6 py-2.5 font-body text-sm font-medium text-white shadow-md transition hover:scale-[1.02]"
                >
                  Build your first site
                </Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {sites.map((site, index) => (
                  <FadeIn key={site.id} delay={index * 80}>
                    <Link
                      href={`/sites/${site.id}`}
                      className="glass-card group block rounded-2xl p-6 transition duration-500 hover:scale-[1.01]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-lg font-normal text-zinc-900 group-hover:text-violet-700">
                            {site.brandName}
                          </h3>
                          <p className="mt-1 font-body text-sm text-zinc-500">
                            {site.productName}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 font-body text-sm font-medium text-emerald-700">
                          ${site.price}
                        </span>
                      </div>
                      <p className="mt-4 font-body text-xs text-zinc-400">
                        Created {new Date(site.createdAt).toLocaleString()}
                      </p>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            )}
          </section>
        </FadeIn>
      </main>
    </AdminShell>
  );
}
