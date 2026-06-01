import { AppLayout } from "@/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile, isSupabaseConfigured } from "@/lib/database/users";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isSupabaseConfigured()) {
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
  }

  return <AppLayout>{children}</AppLayout>;
}
