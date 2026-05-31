import { createClient } from "@/lib/supabase/server";
import type { User, UserInsert } from "@/types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function checkDatabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  tables: string[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      connected: false,
      tables: [],
      error: "未配置 .env.local",
    };
  }

  const supabase = await createClient();
  const tables = ["users", "transactions", "assets", "liabilities", "goals", "reports"] as const;
  const missing: string[] = [];

  for (const table of tables) {
    const { error } = await supabase.from(table).select("*", { head: true, count: "exact" });
    if (error) {
      missing.push(table);
    }
  }

  if (missing.length > 0) {
    return {
      configured: true,
      connected: false,
      tables: tables.filter((t) => !missing.includes(t)),
      error: `缺少表或未迁移: ${missing.join(", ")}`,
    };
  }

  return {
    configured: true,
    connected: true,
    tables: [...tables],
  };
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function ensureUserProfile(
  userId: string,
  name: string,
  email: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const profile: UserInsert = { id: userId, name, email };
  const { error } = await supabase.from("users").upsert(profile, {
    onConflict: "id",
  });

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}
