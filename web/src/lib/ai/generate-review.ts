import { formatCurrency, formatPercent } from "@/lib/format";
import type { ReportAggregate } from "@/lib/reports/aggregate";

export const ADVISOR_SYSTEM_PROMPT = `你是林峰 Life OS 的 AI 财务顾问，代号「林峰财务教练」。

## 身份
- 专业财务规划师，专注服务创业者、自由职业者、中小企业老板
- 信奉「用系统管理人生，而不是用意志力管理人生」
- 不是记账助手，而是财务决策顾问

## 能力
- 分析用户资产负债状况
- 计算目标达成路径
- 给出具体可执行的财务建议
- 评估储蓄率和财务健康度

## 规则
1. 只基于用户提供的真实数据分析，不编造
2. 所有建议必须包含具体数字
3. 不说「建议咨询专业人士」等空话
4. 如果数据不足以回答，明确告知需要什么数据
5. 语气：直接、专业、像教练而非客服
6. 中文回复，金额格式 ¥123,456
7. 不推荐具体股票/基金产品
8. 不做超出财务规划范围的承诺

## 输出格式
必须返回 JSON，格式如下：
{
  "summary": "2-3 句话的月度财务总结",
  "suggestions": ["建议1", "建议2", "建议3"]
}
suggestions 必须恰好 3 条，每条一句话，包含具体数字。`;

export function buildFinancialContext(data: ReportAggregate): string {
  const expenseLines = data.expenseBreakdown
    .map(
      (item) =>
        `- ${item.category}：${formatCurrency(item.amount)}（${formatPercent(item.percentage)}）`
    )
    .join("\n");

  const incomeLines = data.incomeBreakdown
    .map(
      (item) =>
        `- ${item.category}：${formatCurrency(item.amount)}（${formatPercent(item.percentage)}）`
    )
    .join("\n");

  const goalLines = data.goals
    .map(
      (g) =>
        `- ${g.name}：${formatCurrency(g.current_amount)}/${formatCurrency(g.target_amount)}（${formatPercent(g.progress)}）| 每月需存 ${formatCurrency(g.monthlySaving)} | 截止 ${g.target_date}`
    )
    .join("\n");

  return `## 复盘月份
${data.month}

## 资产负债
净资产：${formatCurrency(data.netWorth)}（资产 ${formatCurrency(data.totalAssets)} − 负债 ${formatCurrency(data.totalLiabilities)}）

## 本月现金流
收入：${formatCurrency(data.incomeTotal)} | 支出：${formatCurrency(data.expenseTotal)} | 结余：${formatCurrency(data.balance)} | 储蓄率：${data.savingRate !== null ? formatPercent(data.savingRate) : "暂无"}

## 收入结构
${incomeLines || "（暂无收入记录）"}

## 支出结构
${expenseLines || "（暂无支出记录）"}

## 财务目标
${goalLines || "（暂无目标）"}`;
}

export type AiReviewResult = {
  summary: string;
  suggestions: string[];
};

export function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateAiReview(
  data: ReportAggregate
): Promise<AiReviewResult | null> {
  if (!isOpenAiConfigured()) {
    return null;
  }

  const context = buildFinancialContext(data);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT },
        {
          role: "user",
          content: `请基于以下财务数据，生成本月复盘总结和 3 条可执行建议：\n\n${context}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI error:", err);
    throw new Error("AI 分析生成失败，请稍后重试");
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("AI 返回内容为空");
  }

  const parsed = JSON.parse(content) as AiReviewResult;
  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions.slice(0, 3).map(String)
    : [];

  while (suggestions.length < 3) {
    suggestions.push("继续记录收支，下月可获得更精准的分析");
  }

  return {
    summary: String(parsed.summary ?? "本月财务数据已汇总，请查看明细。"),
    suggestions,
  };
}
