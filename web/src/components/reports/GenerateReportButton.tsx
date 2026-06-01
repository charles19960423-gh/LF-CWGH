"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { generateReport } from "@/app/actions/reports";
import { Button } from "@/components/ui/button";

interface GenerateReportButtonProps {
  month?: string;
}

export function GenerateReportButton({ month }: GenerateReportButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateReport(month);
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        className="bg-[#1e3a5f] hover:bg-[#162d4a]"
        disabled={pending}
        onClick={handleGenerate}
      >
        {pending ? "生成中..." : "生成本月复盘"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
