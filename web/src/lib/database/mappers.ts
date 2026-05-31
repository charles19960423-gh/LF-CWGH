/** Supabase DECIMAL 字段可能返回 string，统一转为 number */
export function toNumber(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : parseFloat(value);
}

export function mapTransaction<T extends { amount: number | string }>(
  row: T
): T & { amount: number } {
  return { ...row, amount: toNumber(row.amount) };
}

export function mapAsset<T extends { amount: number | string }>(
  row: T
): T & { amount: number } {
  return { ...row, amount: toNumber(row.amount) };
}

export function mapLiability<
  T extends { amount: number | string; interest_rate?: number | string | null },
>(row: T): T & { amount: number; interest_rate: number | null } {
  return {
    ...row,
    amount: toNumber(row.amount),
    interest_rate:
      row.interest_rate === null || row.interest_rate === undefined
        ? null
        : toNumber(row.interest_rate),
  };
}

export function mapGoal<
  T extends {
    target_amount: number | string;
    current_amount: number | string;
  },
>(row: T): T & { target_amount: number; current_amount: number } {
  return {
    ...row,
    target_amount: toNumber(row.target_amount),
    current_amount: toNumber(row.current_amount),
  };
}

export function mapReport<
  T extends {
    income_total?: number | string | null;
    expense_total?: number | string | null;
    saving_rate?: number | string | null;
    ai_suggestions?: unknown;
  },
>(row: T) {
  const suggestions = row.ai_suggestions;
  return {
    ...row,
    income_total:
      row.income_total === null || row.income_total === undefined
        ? null
        : toNumber(row.income_total),
    expense_total:
      row.expense_total === null || row.expense_total === undefined
        ? null
        : toNumber(row.expense_total),
    saving_rate:
      row.saving_rate === null || row.saving_rate === undefined
        ? null
        : toNumber(row.saving_rate),
    ai_suggestions: Array.isArray(suggestions)
      ? (suggestions as string[])
      : null,
  };
}
