"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type AuthResult } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthResult | null, FormData>(
    signIn,
    null
  );

  return (
    <Card className="w-full max-w-md border-0 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">林峰 Life OS</CardTitle>
        <CardDescription>成为你自己 · BEING YOURSELF</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state && !state.success && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full bg-[#1e3a5f] hover:bg-[#162d4a]" disabled={pending}>
            {pending ? "登录中..." : "登录"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          还没有账号？{" "}
          <Link href="/signup" className="font-medium text-[#1e3a5f] hover:underline">
            去注册
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
