import { createClient } from "@/lib/supabase/server";
import { mapReport } from "@/lib/database/mappers";
import type { BreakdownItem, Report } from "@/types";

function handleDbError(error: { code?: string; message: string }) {
  if (error.code === "42501") {
    throw new Error(
      "数据库权限不足。请在 Supabase SQL Editor 执行 003_grant_permissions.sql"
    );
  }
  throw error;
}

function parseBreakdown(value: unknown): BreakdownItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const row = item as Record<string, unknown>;
      return {
        category: String(row.category ?? ""),
        amount: Number(row.amount ?? 0),
        percentage: Number(row.percentage ?? 0),
      };
    });
}

export type MappedReport = Omit<
  Report,
  "income_total" | "expense_total" | "saving_rate" | "income_breakdown" | "expense_breakdown" | "ai_suggestions"
> & {
  income_total: number | null;
  expense_total: number | null;
  saving_rate: number | null;
  income_breakdown: BreakdownItem[];
  expense_breakdown: BreakdownItem[];
  ai_suggestions: string[] | null;
};

function toMappedReport(row: Report): MappedReport {
  const base = mapReport(row);
  return {
    ...base,
    income_breakdown: parseBreakdown(row.income_breakdown),
    expense_breakdown: parseBreakdown(row.expense_breakdown),
  };
}

export async function listReports(userId: string): Promise<MappedReport[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(toMappedReport);
}

export async function getReportByMonth(
  userId: string,
  monthDate: string
): Promise<MappedReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .eq("month", monthDate)
    .maybeSingle();

  if (error) handleDbError(error);
  return data ? toMappedReport(data) : null;
}

export async function getLatestReport(
  userId: string
): Promise<MappedReport | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) handleDbError(error);
  return data ? toMappedReport(data) : null;
}
