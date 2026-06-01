"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { withAuth, type ActionResult } from "@/lib/actions/utils";
import { generateAiReview } from "@/lib/ai/generate-review";
import { getReportByMonth, type MappedReport } from "@/lib/database/reports";
import { getCurrentMonth } from "@/lib/date-utils";
import {
  aggregateMonthlyReport,
  monthToDate,
} from "@/lib/reports/aggregate";

function revalidateReportPaths() {
  revalidatePath("/reports");
  revalidatePath("/");
}

export async function generateReport(
  month?: string
): Promise<ActionResult<MappedReport>> {
  return withAuth(async (userId) => {
    const targetMonth = month ?? getCurrentMonth();
    const aggregate = await aggregateMonthlyReport(userId, targetMonth);

    if (aggregate.incomeTotal === 0 && aggregate.expenseTotal === 0) {
      throw new Error("本月暂无收支记录，请先录入收入或支出");
    }

    let aiSummary: string | null = null;
    let aiSuggestions: string[] | null = null;

    try {
      const ai = await generateAiReview(aggregate);
      if (ai) {
        aiSummary = ai.summary;
        aiSuggestions = ai.suggestions;
      }
    } catch (e) {
      console.error("AI review failed:", e);
      aiSummary = "AI 分析暂不可用，财务数据已成功汇总。";
      aiSuggestions = [
        "继续记录本月每一笔收支",
        "检查支出结构中占比最高的分类",
        "更新财务目标进度以保持计划准确",
      ];
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reports")
      .upsert(
        {
          user_id: userId,
          month: monthToDate(targetMonth),
          income_total: aggregate.incomeTotal,
          expense_total: aggregate.expenseTotal,
          saving_rate: aggregate.savingRate,
          income_breakdown: aggregate.incomeBreakdown,
          expense_breakdown: aggregate.expenseBreakdown,
          ai_summary: aiSummary,
          ai_suggestions: aiSuggestions,
        },
        { onConflict: "user_id,month" }
      )
      .select()
      .single();

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }

    revalidateReportPaths();
    const report = await getReportByMonth(userId, monthToDate(targetMonth));
    if (!report) throw new Error("复盘保存失败");
    return report;
  });
}

export async function deleteReport(id: string): Promise<ActionResult> {
  return withAuth(async (userId) => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      const msg =
        error.code === "42501"
          ? "数据库权限不足，请在 Supabase 执行 003_grant_permissions.sql"
          : error.message;
      throw new Error(msg);
    }

    revalidateReportPaths();
  });
}
