import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { MappedReport } from "@/lib/database/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiInsightsCardProps {
  report: MappedReport | null;
}

export function AiInsightsCard({ report }: AiInsightsCardProps) {
  if (!report?.ai_suggestions?.length && !report?.ai_summary) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4 text-[#1e3a5f]" />
                智能分析
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                生成本月复盘后，AI 建议将显示在这里
              </p>
            </div>
            <Link
              href="/reports"
              className="shrink-0 text-sm text-[#1e3a5f] hover:underline"
            >
              去复盘 →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const suggestions = report.ai_suggestions?.slice(0, 3) ?? [];

  return (
    <Card className="border-[#1e3a5f]/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-[#1e3a5f]" />
          智能分析
        </CardTitle>
        <Link href="/reports" className="text-sm text-[#1e3a5f] hover:underline">
          查看复盘 →
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {report.ai_summary && (
          <p className="text-sm text-muted-foreground">{report.ai_summary}</p>
        )}
        <ul className="space-y-1.5">
          {suggestions.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-[#1e3a5f]">·</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
