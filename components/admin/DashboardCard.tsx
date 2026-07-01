import type { ReactNode } from "react";
import { FadeIn } from "./FadeIn";

interface DashboardCardProps {
  title: string;
  count?: number;
  filter?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  delay?: number;
}

export function DashboardCard({
  title,
  count,
  filter,
  children,
  footer,
  className = "",
  delay = 0,
}: DashboardCardProps) {
  return (
    <FadeIn delay={delay} className={className}>
      <div className="dashboard-card flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-500 hover:shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-800">
            {title}
            {count !== undefined && (
              <span className="ml-1 font-normal text-slate-400">({count})</span>
            )}
          </h3>
          {filter && (
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
              {filter}
            </span>
          )}
        </div>
        <div className="flex-1 p-5">{children}</div>
        {footer && (
          <div className="border-t border-slate-100 px-5 py-3">{footer}</div>
        )}
      </div>
    </FadeIn>
  );
}
