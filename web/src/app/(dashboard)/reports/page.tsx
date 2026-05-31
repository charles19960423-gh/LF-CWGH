import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "财务复盘",
};

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="财务复盘"
        description="月度报告、收入支出排行与 AI 建议"
      />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          财务复盘与 AI 功能将在第五阶段开发
        </CardContent>
      </Card>
    </>
  );
}
