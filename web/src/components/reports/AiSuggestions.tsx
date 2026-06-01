import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isOpenAiConfigured } from "@/lib/ai/generate-review";

interface AiSuggestionsProps {
  summary: string | null;
  suggestions: string[] | null;
}

export function AiSuggestions({ summary, suggestions }: AiSuggestionsProps) {
  const hasAi = Boolean(summary || suggestions?.length);
  const configured = isOpenAiConfigured();

  return (
    <Card className="border-[#1e3a5f]/20 bg-[#1e3a5f]/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-[#1e3a5f]" />
          AI 建议
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!configured && (
          <p className="text-xs text-amber-700">
            未配置 OPENAI_API_KEY，显示默认建议。在 web/.env.local 添加后可启用 AI 分析。
          </p>
        )}
        {hasAi ? (
          <>
            {summary && (
              <p className="text-sm leading-relaxed text-foreground">{summary}</p>
            )}
            {suggestions && suggestions.length > 0 && (
              <ul className="space-y-2">
                {suggestions.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-[#1e3a5f]">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            生成复盘后将在此显示 AI 分析与建议
          </p>
        )}
      </CardContent>
    </Card>
  );
}
