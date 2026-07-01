const DISPLAY_DATE: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const DISPLAY_DATETIME: Intl.DateTimeFormatOptions = {
  ...DISPLAY_DATE,
  hour: "numeric",
  minute: "2-digit",
};

/** Stable en-US formatting so server and client hydration match. */
export function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", DISPLAY_DATE);
}

export function formatDisplayDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", DISPLAY_DATETIME);
}

export function formatMonthShort(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
