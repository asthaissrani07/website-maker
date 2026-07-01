import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FadeIn } from "@/components/admin/FadeIn";
import { SiteForm } from "@/components/admin/SiteForm";

export default function CreatePage() {
  return (
    <AdminLayout
      title="Create Product Website"
      subtitle="New project"
      action={
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-purple-200 hover:text-purple-700"
        >
          ← Dashboard
        </Link>
      }
    >
      <FadeIn>
        <div className="mb-8">
          <p className="text-sm leading-relaxed text-slate-600">
            Describe your product and let Groq AI generate the copy, or edit the
            fields manually. Layout inspired by{" "}
            <a
              href="https://trycorevita.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-700 underline decoration-purple-200 hover:text-purple-900"
            >
              Corevita
            </a>
            .
          </p>
        </div>
      </FadeIn>
      <div className="mx-auto max-w-4xl">
        <SiteForm />
      </div>
    </AdminLayout>
  );
}
