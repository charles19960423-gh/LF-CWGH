import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardEmptyState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-lg font-medium text-foreground">
          欢迎使用林峰 Life OS
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          录入你的资产和负债，开启财富驾驶舱
        </p>
        <Link
          href="/assets"
          className="mt-6 inline-flex h-8 items-center justify-center rounded-lg bg-[#1e3a5f] px-4 text-sm font-medium text-white hover:bg-[#162d4a]"
        >
          开始录入资产 →
        </Link>
      </CardContent>
    </Card>
  );
}
