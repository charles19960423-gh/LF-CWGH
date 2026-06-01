import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

interface NetWorthHeroProps {
  netWorth: number;
}

export function NetWorthHero({ netWorth }: NetWorthHeroProps) {
  return (
    <Link href="/assets" className="block transition-opacity hover:opacity-95">
      <Card className="border-0 bg-[#1e3a5f] text-white shadow-md">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-white/70">净资产</p>
          <p className="mt-2 font-mono text-4xl font-bold tracking-tight">
            {formatCurrency(netWorth)}
          </p>
          <p className="mt-2 text-xs text-white/50">点击查看资产详情 →</p>
        </CardContent>
      </Card>
    </Link>
  );
}
