import {
  endOfMonth,
  format,
  parse,
  startOfMonth,
  subMonths,
} from "date-fns";

export function getCurrentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

export function getMonthRange(month: string): { start: string; end: string } {
  const date = parse(`${month}-01`, "yyyy-MM-dd", new Date());
  return {
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export function formatMonthLabel(month: string): string {
  const date = parse(`${month}-01`, "yyyy-MM-dd", new Date());
  return format(date, "yyyy年M月");
}

export function getRecentMonths(count = 12): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) =>
    format(subMonths(now, i), "yyyy-MM")
  );
}

export function formatDisplayDate(date: string): string {
  const parsed = parse(date, "yyyy-MM-dd", new Date());
  return format(parsed, "M/d");
}
