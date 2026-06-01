import { createClient } from "@/lib/supabase/server";
import type { User, UserInsert } from "@/types";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isTableMissingError(error: { message?: string; code?: string }): boolean {
  const msg = (error.message ?? "").toLowerCase();
  return (
    error.code === "PGRST205" ||
    error.code === "42P01" ||
    msg.includes("could not find the table") ||
    (msg.includes("relation") && msg.includes("does not exist"))
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      connected: false,
      tables: [],
      error: "请先登录后再检测数据库",
    };
  }

  const tables = [
    "users",
    "transactions",
    "assets",
    "liabilities",
    "goals",
    "reports",
  ] as const;
  const ready: string[] = [];
  const missing: string[] = [];

  for (const table of tables) {
    const query =
      table === "users"
        ? supabase.from("users").select("id").eq("id", user.id).limit(1)
        : supabase.from(table).select("id").eq("user_id", user.id).limit(1);

    const { error } = await query;

    if (error) {
      if (isTableMissingError(error)) {
        missing.push(table);
      } else {
        // 表存在但查询报错（如 RLS），仍视为已迁移
        ready.push(table);
      }
    } else {
      ready.push(table);
    }
  }

  if (missing.length > 0) {
    return {
      configured: true,
      connected: false,
      tables: ready,
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
