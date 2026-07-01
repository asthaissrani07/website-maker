import type { ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function AdminLayout({
  children,
  title,
  subtitle,
  action,
}: AdminLayoutProps) {
  return (
    <div className="admin-app min-h-screen bg-[#f4f7f9]">
      <AdminSidebar />
      <div className="ml-[240px] flex min-h-screen flex-col">
        <AdminHeader title={title} subtitle={subtitle} action={action} />
        <main className="admin-main flex-1 scroll-smooth bg-[#f4f7f9] px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
