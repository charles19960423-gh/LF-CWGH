import { formatPercent } from "@/lib/format";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SavingRateBarProps {
  savingRate: number | null;
}

function getSavingStatus(rate: number) {
  if (rate >= 30) {
    return { label: "健康 ✅", color: "bg-green-500", text: "text-green-700" };
  }
  if (rate >= 10) {
    return { label: "一般 ⚠️", color: "bg-amber-500", text: "text-amber-700" };
  }
  return { label: "需关注 ❌", color: "bg-red-500", text: "text-red-700" };
}

export function SavingRateBar({ savingRate }: SavingRateBarProps) {
  const status =
    savingRate !== null ? getSavingStatus(savingRate) : null;

  return (
    <Card>
      <CardContent className="py-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium">储蓄率</p>
          {savingRate !== null && status ? (
            <span className={cn("text-sm font-medium", status.text)}>
              {status.label}
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">暂无数据</span>
          )}
        </div>
        {savingRate !== null && status ? (
          <>
            <p className="mb-2 text-2xl font-semibold">
              {formatPercent(Math.max(savingRate, 0))}
            </p>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", status.color)}
                style={{ width: `${Math.min(Math.max(savingRate, 0), 100)}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            录入本月收入后自动计算储蓄率
          </p>
        )}
      </CardContent>
    </Card>
  );
}
