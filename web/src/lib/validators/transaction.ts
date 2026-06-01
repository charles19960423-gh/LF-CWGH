import { z } from "zod";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/constants/categories";

const baseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式无效"),
  amount: z.coerce.number().positive("金额必须大于 0"),
  category: z.string().min(1, "请选择分类"),
  account: z.string().optional(),
  note: z.string().optional(),
});

export function parseTransactionForm(
  formData: FormData,
  type: "income" | "expense"
) {
  const categories =
    type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const parsed = baseSchema.safeParse({
    date: String(formData.get("date") ?? ""),
    amount: formData.get("amount"),
    category: String(formData.get("category") ?? ""),
    account: String(formData.get("account") ?? "").trim() || undefined,
    note: String(formData.get("note") ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message ?? "输入无效" };
  }

  if (!categories.includes(parsed.data.category as never)) {
    return { success: false as const, error: "分类无效" };
  }

  return { success: true as const, data: parsed.data };
}
