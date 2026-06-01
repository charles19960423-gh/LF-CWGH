export function mapAuthError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("invalid login credentials")) {
    return "邮箱或密码错误，或邮箱尚未验证（请在 Supabase 关闭 Confirm email 后重试）";
  }
  if (m.includes("email not confirmed")) {
    return "邮箱尚未验证。请查收验证邮件，或在 Supabase → Authentication → Email 关闭 Confirm email";
  }
  if (m.includes("email rate limit exceeded")) {
    return "发信频率超限，请稍后再试，或在 Supabase 关闭 Confirm email";
  }
  if (m.includes("user already registered")) {
    return "该邮箱已注册，请直接登录";
  }

  return message || "操作失败，请重试";
}
