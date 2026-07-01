import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function NotFound() {
  return (
    <AdminLayout title="Not Found" subtitle="Error">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Site not found</h1>
        <p className="mt-3 text-slate-500">
          This site may have been removed or the link is invalid.
        </p>
        <Link
          href="/"
          className="admin-btn-primary mt-8 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition hover:scale-[1.02]"
        >
          Back to dashboard
        </Link>
      </div>
    </AdminLayout>
  );
}
