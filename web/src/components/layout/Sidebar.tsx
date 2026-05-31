"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Landmark,
  CreditCard,
  Target,
  FileText,
  Settings,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "财务驾驶舱", icon: LayoutDashboard },
  { href: "/income", label: "收入管理", icon: TrendingUp },
  { href: "/expense", label: "支出管理", icon: TrendingDown },
  { href: "/assets", label: "资产管理", icon: Landmark },
  { href: "/liabilities", label: "负债管理", icon: CreditCard },
  { href: "/goals", label: "财务目标", icon: Target },
  { href: "/reports", label: "财务复盘", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-[#1e3a5f] text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-lg font-semibold tracking-tight">林峰 Life OS</p>
        <p className="mt-1 text-xs text-white/70">成为你自己 · BEING YOURSELF</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/50">
          财富系统
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/15 font-medium text-white"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-white/50">
            Life OS
          </p>
          <Link
            href="/life-os"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              pathname === "/life-os"
                ? "bg-white/15 font-medium text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            )}
          >
            <Globe className="h-4 w-4 shrink-0" />
            更多系统
            <span className="ml-auto rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
              Soon
            </span>
          </Link>
        </div>
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-white/15 font-medium text-white"
              : "text-white/75 hover:bg-white/10 hover:text-white"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          设置
        </Link>
      </div>
    </aside>
  );
}
