import { formatCurrency, formatPercent } from "@/lib/format";
import type { BreakdownItem } from "@/types";

interface BreakdownSectionProps {
  title: string;
  items: BreakdownItem[];
}

export function BreakdownSection({ title, items }: BreakdownSectionProps) {
  if (items.length === 0) {
    return (
      <div>
        <h4 className="mb-2 text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">暂无数据</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.category} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{item.category}</span>
              <span className="text-muted-foreground">
                {formatPercent(item.percentage)} · {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[#1e3a5f]"
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
