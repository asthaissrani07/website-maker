import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminShell } from "@/components/admin/AdminShell";
import { FadeIn } from "@/components/admin/FadeIn";
import { SiteForm } from "@/components/admin/SiteForm";

export default function CreatePage() {
  return (
    <AdminShell>
      <AdminNav />
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <FadeIn>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-body text-sm text-zinc-500 transition hover:text-emerald-700"
          >
            ← Back to dashboard
          </Link>
          <div className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-violet-600">
              New project
            </p>
            <h1 className="font-display text-4xl font-light tracking-tight text-zinc-900">
              Create{" "}
              <span className="bg-gradient-to-r from-violet-700 to-emerald-600 bg-clip-text font-normal text-transparent">
                Product Website
              </span>
            </h1>
            <p className="mt-4 font-body text-lg font-light leading-relaxed text-zinc-600">
              Describe your product and let Groq AI generate the copy, or edit the
              fields manually. Layout inspired by{" "}
              <a
                href="https://trycorevita.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-violet-700 underline decoration-violet-300 hover:text-emerald-700"
              >
                Corevita
              </a>
              .
            </p>
          </div>
        </FadeIn>
        <SiteForm />
      </main>
    </AdminShell>
  );
}
