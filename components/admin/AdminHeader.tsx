"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="admin-header sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <div className="mt-0.5 text-sm font-medium text-slate-600">{subtitle}</div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {action}
          <Link
            href="/create"
            className="admin-btn-primary hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] sm:inline-flex"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Site
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-purple-200 hover:text-purple-700"
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
