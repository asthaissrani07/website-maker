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
            <strong className="font-semibold text-slate-800">Step 1:</strong>{" "}
            Generate content with Groq AI.{" "}
            <strong className="font-semibold text-slate-800">Step 2:</strong>{" "}
            Click <strong className="text-purple-700">Build Product Website</strong>{" "}
            (appears right after generation, or use the sticky bar at the bottom).
            You can edit any field before building.
          </p>
        </div>
      </FadeIn>
      <div className="mx-auto max-w-4xl">
        <SiteForm />
      </div>
    </AdminLayout>
  );
}
