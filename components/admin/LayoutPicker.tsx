"use client";

import { PRODUCT_LAYOUTS } from "@/lib/product-layouts";

interface LayoutPickerProps {
  value: string;
  onChange: (layoutId: string) => void;
}

function LayoutPreview({ id }: { id: string }) {
  if (id === "centered") {
    return (
      <div className="flex h-16 flex-col items-center gap-1.5 rounded-md bg-slate-100 p-2">
        <div className="h-2 w-3/4 rounded bg-slate-300" />
        <div className="h-1.5 w-1/2 rounded bg-slate-200" />
        <div className="mt-1 h-8 w-10 rounded bg-purple-200" />
      </div>
    );
  }
  if (id === "showcase") {
    return (
      <div className="flex h-16 flex-col gap-1.5 rounded-md bg-slate-100 p-2">
        <div className="h-8 w-full rounded bg-purple-200" />
        <div className="flex gap-1">
          <div className="h-2 flex-1 rounded bg-slate-300" />
          <div className="h-2 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
    );
  }
  if (id === "editorial") {
    return (
      <div className="flex h-16 gap-1.5 rounded-md bg-slate-100 p-2">
        <div className="w-2/5 rounded bg-purple-200" />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="h-2 w-full rounded bg-slate-300" />
          <div className="h-1.5 w-4/5 rounded bg-slate-200" />
          <div className="mt-1 h-2 w-1/3 rounded bg-slate-400" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-16 gap-1.5 rounded-md bg-slate-100 p-2">
      <div className="flex flex-1 flex-col justify-center gap-1">
        <div className="h-2 w-full rounded bg-slate-300" />
        <div className="h-1.5 w-4/5 rounded bg-slate-200" />
        <div className="mt-1 h-2 w-1/3 rounded bg-slate-400" />
      </div>
      <div className="w-2/5 rounded bg-purple-200" />
    </div>
  );
}

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PRODUCT_LAYOUTS.map((layout) => {
        const selected = value === layout.id;
        return (
          <button
            key={layout.id}
            type="button"
            onClick={() => onChange(layout.id)}
            className={`rounded-xl border p-4 text-left transition ${
              selected
                ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                : "border-slate-300 bg-white hover:border-purple-300"
            }`}
          >
            <LayoutPreview id={layout.id} />
            <p className="mt-3 font-medium text-slate-900">{layout.name}</p>
            <p className="mt-1 text-xs text-slate-600">{layout.description}</p>
          </button>
        );
      })}
    </div>
  );
}
