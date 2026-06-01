import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: number;
  href: string;
  linkText?: string;
}

export function MetricCard({
  label,
  value,
  href,
  linkText = "点击查看详情 →",
}: MetricCardProps) {
  return (
    <Link href={href} className="block">
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="py-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(value)}</p>
          <p className="mt-2 text-sm text-[#1e3a5f]">{linkText}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
