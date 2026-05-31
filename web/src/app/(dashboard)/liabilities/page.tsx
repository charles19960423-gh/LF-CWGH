import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "负债管理",
};

export default function LiabilitiesPage() {
  return (
    <>
      <PageHeader title="负债管理" description="记录和管理你的各项负债" />
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          负债管理功能将在第三阶段开发
        </CardContent>
      </Card>
    </>
  );
}
