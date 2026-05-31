export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "income" | "expense";
          amount: number;
          category: string;
          account: string | null;
          date: string;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "income" | "expense";
          amount: number;
          category: string;
          account?: string | null;
          date: string;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "income" | "expense";
          amount?: number;
          category?: string;
          account?: string | null;
          date?: string;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          amount: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          amount?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          amount?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      liabilities: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          amount: number;
          interest_rate: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          amount?: number;
          interest_rate?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: string;
          amount?: number;
          interest_rate?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount: number;
          target_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          target_amount: number;
          current_amount?: number;
          target_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_amount?: number;
          current_amount?: number;
          target_date?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          month: string;
          income_total: number | null;
          expense_total: number | null;
          saving_rate: number | null;
          income_breakdown: Json | null;
          expense_breakdown: Json | null;
          ai_summary: string | null;
          ai_suggestions: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          month: string;
          income_total?: number | null;
          expense_total?: number | null;
          saving_rate?: number | null;
          income_breakdown?: Json | null;
          expense_breakdown?: Json | null;
          ai_summary?: string | null;
          ai_suggestions?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          month?: string;
          income_total?: number | null;
          expense_total?: number | null;
          saving_rate?: number | null;
          income_breakdown?: Json | null;
          expense_breakdown?: Json | null;
          ai_summary?: string | null;
          ai_suggestions?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
