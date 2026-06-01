import { AppLayout } from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/database/users";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const name =
      (user.user_metadata?.name as string) ||
      user.email?.split("@")[0] ||
      "用户";
    await ensureUserProfile(user.id, name, user.email ?? "");
  }

  return <AppLayout>{children}</AppLayout>;
}
