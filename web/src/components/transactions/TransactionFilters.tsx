"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatMonthLabel, getRecentMonths } from "@/lib/date-utils";
import { selectClassName } from "@/lib/form-styles";

interface TransactionFiltersProps {
  month: string;
  category: string;
  categories: readonly string[];
}

export function TransactionFilters({
  month,
  category,
  categories,
}: TransactionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" && key === "category") {
      params.delete("category");
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground">筛选:</span>
      <select
        className={`${selectClassName} w-auto min-w-[140px]`}
        value={month}
        onChange={(e) => update("month", e.target.value)}
      >
        {getRecentMonths(12).map((m) => (
          <option key={m} value={m}>
            {formatMonthLabel(m)}
          </option>
        ))}
      </select>
      <select
        className={`${selectClassName} w-auto min-w-[120px]`}
        value={category}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="all">全部分类</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
