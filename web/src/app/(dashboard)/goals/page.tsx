import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "财务目标",
};

export default function GoalsPage() {
  return (
    <>
      <PageHeader title="财务目标" description="设定目标，系统自动计算每月需存金额" />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          财务目标功能将在第三阶段开发
        </CardContent>
      </Card>
    </>
  );
}
