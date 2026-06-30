import type { ReactNode } from "react";
import { LiveBackground } from "./LiveBackground";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <LiveBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
