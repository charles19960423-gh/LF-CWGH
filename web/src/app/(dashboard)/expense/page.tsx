import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "支出管理",
};

export default function ExpensePage() {
  return (
    <>
      <PageHeader title="支出管理" description="记录支出并分析结构占比" />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          支出记录功能将在第三阶段开发
        </CardContent>
      </Card>
    </>
  );
}
