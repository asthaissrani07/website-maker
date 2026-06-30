import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NotFound() {
  return (
    <AdminShell>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-3xl font-light text-zinc-900">
          Site not found
        </h1>
        <p className="mt-3 font-body text-zinc-600">
          This site may have been removed or the server was restarted.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-6 py-2.5 font-body text-sm font-medium text-white shadow-md transition hover:scale-[1.02]"
        >
          Back to dashboard
        </Link>
      </div>
    </AdminShell>
  );
}
