"use client";

import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="ps-modal relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border ps-border p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="ps-text ps-font-display text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ps-text-subtle rounded-full p-1 text-2xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
