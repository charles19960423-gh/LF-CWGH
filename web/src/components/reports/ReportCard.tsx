import Link from "next/link";
import { formatMonthLabel } from "@/lib/date-utils";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { MappedReport } from "@/lib/database/reports";
import { BreakdownSection } from "@/components/reports/BreakdownSection";
import { AiSuggestions } from "@/components/reports/AiSuggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enrichGoal } from "@/lib/calculations/goals";
import { listGoals } from "@/lib/database/goals";
import { requireUserId } from "@/lib/auth-server";

interface ReportCardProps {
  report: MappedReport;
}

function getSavingLabel(rate: number | null): string {
  if (rate === null) return "暂无";
  if (rate >= 30) return "健康";
  if (rate >= 10) return "一般";
  return "需关注";
}

export async function ReportCard({ report }: ReportCardProps) {
  const userId = await requireUserId();
  const goals = (await listGoals(userId)).map(enrichGoal);
  const monthKey = report.month.slice(0, 7);
  const monthLabel = formatMonthLabel(monthKey);
  const balance =
    (report.income_total ?? 0) - (report.expense_total ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{monthLabel} 财务复盘</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricBox label="收入" value={formatCurrency(report.income_total ?? 0)} />
          <MetricBox label="支出" value={formatCurrency(report.expense_total ?? 0)} />
          <MetricBox label="结余" value={formatCurrency(balance)} />
          <MetricBox
            label="储蓄率"
            value={
              report.saving_rate !== null
                ? `${formatPercent(report.saving_rate)} · ${getSavingLabel(report.saving_rate)}`
                : "暂无"
            }
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <BreakdownSection title="📊 收入排行" items={report.income_breakdown} />
          <BreakdownSection title="📊 支出排行" items={report.expense_breakdown} />
        </div>

        {goals.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-medium">🎯 目标进度</h4>
            <div className="space-y-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm"
                >
                  <span>
                    {goal.icon} {goal.name}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPercent(goal.progress)} · 每月需存{" "}
                    {formatCurrency(goal.monthlySaving)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AiSuggestions
          summary={report.ai_summary}
          suggestions={report.ai_suggestions}
        />
      </CardContent>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

interface ReportHistoryListProps {
  reports: MappedReport[];
  activeMonth: string;
}

export function ReportHistoryList({
  reports,
  activeMonth,
}: ReportHistoryListProps) {
  if (reports.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">历史复盘</h3>
      <div className="space-y-2">
        {reports.map((report) => {
          const monthKey = report.month.slice(0, 7);
          const isActive = monthKey === activeMonth;
          const label = formatMonthLabel(monthKey);
          const rate =
            report.saving_rate !== null
              ? formatPercent(report.saving_rate)
              : "—";
          const status = getSavingLabel(report.saving_rate);

          return (
            <Link
              key={report.id}
              href={`/reports?month=${monthKey}`}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-muted/50 ${
                isActive ? "border-[#1e3a5f] bg-[#1e3a5f]/5" : ""
              }`}
            >
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">
                储蓄率 {rate} · {status}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
