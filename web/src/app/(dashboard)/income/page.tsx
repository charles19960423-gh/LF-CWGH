import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "收入管理",
};

export default function IncomePage() {
  return (
    <>
      <PageHeader title="收入管理" description="记录和分析你的收入来源" />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          收入记录功能将在第三阶段开发
        </CardContent>
      </Card>
    </>
  );
}
