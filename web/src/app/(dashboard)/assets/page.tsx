import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "资产管理",
};

export default function AssetsPage() {
  return (
    <>
      <PageHeader title="资产管理" description="记录和管理你的各项资产" />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          资产管理功能将在第三阶段开发
        </CardContent>
      </Card>
    </>
  );
}
