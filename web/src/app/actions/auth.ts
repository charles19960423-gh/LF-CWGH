"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/database/users";
import { mapAuthError } from "@/lib/auth-errors";

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
    return { success: false, error: mapAuthError(error.message) };
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
    return { success: false, error: mapAuthError(error.message) };
  }

  // 开启了邮箱验证时：有 user 但没有 session，无法直接登录
  if (data.user && !data.session) {
    return {
      success: false,
      error:
        "注册成功，但需验证邮箱后才能登录。请查收邮件，或在 Supabase → Authentication → Email 关闭 Confirm email 后重新注册",
    };
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
