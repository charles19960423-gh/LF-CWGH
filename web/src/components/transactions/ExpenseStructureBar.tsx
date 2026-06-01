import { formatCurrency, formatPercent } from "@/lib/format";

interface ExpenseStructureBarProps {
  items: { category: string; amount: number; percentage: number }[];
}

export function ExpenseStructureBar({ items }: ExpenseStructureBarProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <h3 className="text-sm font-medium text-foreground">支出结构</h3>
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
