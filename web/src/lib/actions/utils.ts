import { createClient } from "@/lib/supabase/server";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function withAuth<T>(
  fn: (userId: string) => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const userId = await getAuthUserId();
    if (!userId) {
      return { success: false, error: "未登录" };
    }
    const data = await fn(userId);
    return { success: true, data };
  } catch (e) {
    console.error(e);
    return { success: false, error: "操作失败，请重试" };
  }
}
