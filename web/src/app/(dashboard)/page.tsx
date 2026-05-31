import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "财富驾驶舱",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="财富驾驶舱"
        description="一屏看清你的财务状况"
      />
      <div className="space-y-6">
        <Card className="border-0 bg-[#1e3a5f] text-white shadow-md">
          <CardContent className="py-8 text-center">
            <p className="text-sm text-white/70">净资产</p>
            <p className="mt-2 font-mono text-4xl font-bold">¥ —</p>
            <p className="mt-2 text-sm text-white/60">录入资产和负债后显示</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="text-lg font-medium text-foreground">欢迎使用林峰 Life OS</p>
            <p className="mt-2 text-sm">
              第二阶段将连接数据库，第三阶段开始录入收支与资产负债。
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
