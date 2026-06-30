import Link from "next/link";

export function AdminNav() {
  return (
    <header className="nav-enter border-b border-violet-200/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="font-display text-lg font-light tracking-tight"
        >
          <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Website Maker
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="font-body font-medium text-zinc-600 transition hover:text-emerald-700"
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-5 py-2 font-body font-medium text-white shadow-md shadow-violet-200/50 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-200/40"
          >
            + New Site
          </Link>
        </nav>
      </div>
    </header>
  );
}
