import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import { FadeIn } from "@/components/admin/FadeIn";
import { getAllSites } from "@/lib/store";

export default async function DashboardPage() {
  const sites = await getAllSites();
  const generatedAt = new Date().toISOString();

  return (
    <AdminLayout
      title="Website Maker Dashboard"
      subtitle="Dashboard"
    >
      {sites.length === 0 && (
        <FadeIn>
          <div className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-purple-200 bg-purple-50/50 px-6 py-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Welcome to Website Maker
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create your first product landing page with Groq AI — describe your
                product, generate copy, preview, and download a ready-to-run Next.js
                project.
              </p>
            </div>
            <Link
              href="/create"
              className="admin-btn-primary shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02]"
            >
              + Build your first site
            </Link>
          </div>
        </FadeIn>
      )}

      <DashboardCharts sites={sites} generatedAt={generatedAt} />
    </AdminLayout>
  );
}
