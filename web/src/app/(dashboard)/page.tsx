import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { GoalProgressList } from "@/components/dashboard/GoalProgressList";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { NetWorthHero } from "@/components/dashboard/NetWorthHero";
import { SavingRateBar } from "@/components/dashboard/SavingRateBar";
import { TrendCharts } from "@/components/dashboard/TrendCharts";
import { requireUserId } from "@/lib/auth-server";
import { getCurrentMonth, formatMonthLabel } from "@/lib/date-utils";
import {
  getDashboardStats,
  getTrendData,
} from "@/lib/queries/dashboard";
import { getReportByMonth } from "@/lib/database/reports";
import { monthToDate } from "@/lib/reports/aggregate";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";

export const metadata: Metadata = {
  title: "财富驾驶舱",
};

export default async function DashboardPage() {
  const userId = await requireUserId();
  const month = getCurrentMonth();
  const [stats, trends, monthReport] = await Promise.all([
    getDashboardStats(userId),
    getTrendData(userId),
    getReportByMonth(userId, monthToDate(month)),
  ]);

  const monthLabel = formatMonthLabel(getCurrentMonth());

  return (
    <>
      <PageHeader
        title="财富驾驶舱"
        description={`一屏看清你的财务状况 · ${monthLabel}`}
      />

      {!stats.hasFinancialData ? (
        <DashboardEmptyState />
      ) : (
        <div className="space-y-6">
          <NetWorthHero netWorth={stats.netWorth} />

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="总资产"
              value={stats.totalAssets}
              href="/assets"
            />
            <MetricCard
              label="总负债"
              value={stats.totalLiabilities}
              href="/liabilities"
            />
            <MetricCard
              label="本月收入"
              value={stats.monthlyIncome}
              href="/income"
              linkText="点击查看 →"
            />
            <MetricCard
              label="本月支出"
              value={stats.monthlyExpense}
              href="/expense"
              linkText="点击查看 →"
            />
          </div>

          <SavingRateBar savingRate={stats.savingRate} />

          <GoalProgressList goals={stats.goals} />

          <AiInsightsCard report={monthReport} />

          <TrendCharts data={trends} />
        </div>
      )}
    </>
  );
}
