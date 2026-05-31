import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import {
  checkDatabaseConnection,
  getUserProfile,
  isSupabaseConfigured,
} from "@/lib/database/users";

export const metadata: Metadata = {
  title: "设置",
};

export default async function SettingsPage() {
  const dbStatus = await checkDatabaseConnection();

  let name = "—";
  let email = "—";
  let userId = "—";

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userId = user.id;
      email = user.email ?? "—";
      const profile = await getUserProfile(user.id);
      name = profile?.name ?? (user.user_metadata?.name as string) ?? "—";
    }
  }

  return (
    <>
      <PageHeader title="设置" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">数据库状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Supabase 配置</span>
              <span
                className={
                  dbStatus.configured ? "text-green-600" : "text-amber-600"
                }
              >
                {dbStatus.configured ? "已配置 ✅" : "未配置 ⚠️"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">数据库连接</span>
              <span
                className={
                  dbStatus.connected ? "text-green-600" : "text-amber-600"
                }
              >
                {dbStatus.connected ? "已连接 ✅" : "未连接 ⚠️"}
              </span>
            </div>
            {dbStatus.connected && (
              <div className="rounded-lg bg-slate-50 p-3 text-xs text-muted-foreground">
                已就绪：{dbStatus.tables.join(" · ")}
              </div>
            )}
            {dbStatus.error && (
              <p className="text-xs text-amber-700">{dbStatus.error}</p>
            )}
            {!dbStatus.configured && (
              <p className="text-xs text-muted-foreground">
                请配置 web/.env.local，并在 Supabase 执行迁移 SQL。详见
                web/supabase/SETUP.md
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">个人信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input id="name" defaultValue={name} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input id="email" defaultValue={email} disabled />
              <p className="text-xs text-muted-foreground">邮箱不可修改</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">用户 ID</Label>
              <Input id="userId" defaultValue={userId} disabled className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex justify-end pt-6">
            <form action={signOut}>
              <Button type="submit" variant="outline">
                退出登录
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
