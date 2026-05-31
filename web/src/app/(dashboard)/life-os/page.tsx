import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { GOAL_TEMPLATES } from "@/lib/constants/categories";

export const metadata: Metadata = {
  title: "人生系统",
};

const futureSystems = [
  { name: "财富系统", status: "active", icon: "💰" },
  { name: "事业系统", status: "soon", icon: "🚀" },
  { name: "内容系统", status: "soon", icon: "📝" },
  { name: "学习系统", status: "soon", icon: "📚" },
  { name: "健康系统", status: "soon", icon: "❤️" },
  { name: "人生规划", status: "soon", icon: "🎯" },
];

export default function LifeOsPage() {
  return (
    <>
      <PageHeader
        title="林峰 Life OS · 人生系统"
        description="用系统管理人生，而不是用意志力管理人生"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {futureSystems.map((system) => (
          <Card
            key={system.name}
            className={system.status === "active" ? "border-[#1e3a5f] ring-1 ring-[#1e3a5f]/20" : "opacity-70"}
          >
            <CardContent className="flex items-center gap-4 py-6">
              <span className="text-3xl">{system.icon}</span>
              <div>
                <p className="font-medium">{system.name}</p>
                <p className="text-sm text-muted-foreground">
                  {system.status === "active" ? "已激活 ✅" : "Coming Soon 🔒"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardContent className="py-6 text-sm text-muted-foreground">
          V1 当前模块：财富系统。目标模板预览：
          {" "}
          {GOAL_TEMPLATES.map((t) => t.name).join(" · ")}
        </CardContent>
      </Card>
    </>
  );
}
