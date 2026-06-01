import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { GenerateReportButton } from "@/components/reports/GenerateReportButton";
import {
  ReportCard,
  ReportHistoryList,
} from "@/components/reports/ReportCard";
import { requireUserId } from "@/lib/auth-server";
import { getCurrentMonth } from "@/lib/date-utils";
import { getReportByMonth, listReports } from "@/lib/database/reports";
import { monthToDate } from "@/lib/reports/aggregate";

export const metadata: Metadata = {
  title: "财务复盘",
};

interface PageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const userId = await requireUserId();
  const currentMonth = getCurrentMonth();
  const viewMonth = params.month ?? currentMonth;
  const monthDate = monthToDate(viewMonth);

  const [reports, activeReport] = await Promise.all([
    listReports(userId),
    getReportByMonth(userId, monthDate),
  ]);

  return (
    <>
      <PageHeader
        title="财务复盘"
        description="月度报告、收入支出排行与 AI 建议"
      >
        <GenerateReportButton month={currentMonth} />
      </PageHeader>

      <div className="space-y-6">
        {activeReport ? (
          <ReportCard report={activeReport} />
        ) : (
          <div className="rounded-xl border py-12 text-center">
            <p className="font-medium text-foreground">本月还没有复盘</p>
            <p className="mt-2 text-sm text-muted-foreground">
              录入收支后，点击「生成本月复盘」获取月度分析与 AI 建议
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <Link href="/income" className="text-[#1e3a5f] hover:underline">
                录入收入 →
              </Link>
              <Link href="/expense" className="text-[#1e3a5f] hover:underline">
                录入支出 →
              </Link>
            </div>
          </div>
        )}

        <ReportHistoryList reports={reports} activeMonth={viewMonth} />
      </div>
    </>
  );
}
