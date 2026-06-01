import { z } from "zod";

const goalSchema = z
  .object({
    name: z.string().min(1, "请填写目标名称"),
    target_amount: z.coerce.number().positive("目标金额必须大于 0"),
    current_amount: z.coerce.number().min(0, "当前已存不能为负数"),
    target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "日期格式无效"),
  })
  .refine((data) => data.current_amount <= data.target_amount, {
    message: "当前已存不能超过目标金额",
    path: ["current_amount"],
  });

export function parseGoalForm(formData: FormData, requireFutureDate = true) {
  const parsed = goalSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    target_amount: formData.get("target_amount"),
    current_amount: formData.get("current_amount") ?? 0,
    target_date: String(formData.get("target_date") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false as const,
      error: parsed.error.issues[0]?.message ?? "输入无效",
    };
  }

  if (requireFutureDate) {
    const target = new Date(parsed.data.target_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (target <= today) {
      return { success: false as const, error: "目标日期必须是未来" };
    }
  }

  return { success: true as const, data: parsed.data };
}
