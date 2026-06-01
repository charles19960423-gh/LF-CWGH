import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GoalFormTrigger } from "@/components/goals/GoalFormDialog";
import { GoalList } from "@/components/goals/GoalList";
import { requireUserId } from "@/lib/auth-server";
import { getAllGoalsWithMetrics } from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "财务目标",
};

export default async function GoalsPage() {
  const userId = await requireUserId();
  const goals = await getAllGoalsWithMetrics(userId);

  return (
    <>
      <PageHeader title="财务目标" description="设定目标，系统自动计算每月需存金额">
        <GoalFormTrigger />
      </PageHeader>

      <GoalList goals={goals} />
    </>
  );
}
