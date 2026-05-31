"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/database/users";

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function signIn(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { success: false, error: "请填写邮箱和密码" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "登录失败，请检查邮箱和密码" };
  }

  if (data.user) {
    const name =
      (data.user.user_metadata?.name as string) ||
      email.split("@")[0];
    await ensureUserProfile(data.user.id, name, email);
  }

  redirect("/");
}

export async function signUp(
  _prev: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { success: false, error: "请填写所有字段" };
  }

  if (password.length < 6) {
    return { success: false, error: "密码至少 6 位" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    return { success: false, error: error.message || "注册失败" };
  }

  if (data.user) {
    await ensureUserProfile(data.user.id, name, email);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
