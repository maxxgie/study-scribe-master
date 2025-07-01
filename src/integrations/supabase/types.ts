export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string | null
          title: string
          unit_id: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          title: string
          unit_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          title?: string
          unit_id?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          created_at: string
          difficulty: number | null
          id: string
          next_review: string
          question: string
          review_count: number | null
          unit_id: number | null
          user_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string
          difficulty?: number | null
          id?: string
          next_review?: string
          question: string
          review_count?: number | null
          unit_id?: number | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string
          difficulty?: number | null
          id?: string
          next_review?: string
          question?: string
          review_count?: number | null
          unit_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_scores: {
        Row: {
          created_at: string
          id: string
          max_score: number
          quiz_date: string
          quiz_topic: string | null
          score: number
          unit_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          max_score: number
          quiz_date?: string
          quiz_topic?: string | null
          score: number
          unit_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          max_score?: number
          quiz_date?: string
          quiz_topic?: string | null
          score?: number
          unit_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_scores_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          unit_id: number | null
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          unit_id?: number | null
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          unit_id?: number | null
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_links_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          searchable_content: string | null
          unit_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          searchable_content?: string | null
          unit_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          searchable_content?: string | null
          unit_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_files_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_goals: {
        Row: {
          achieved: boolean | null
          created_at: string
          current_hours: number | null
          end_date: string
          goal_type: string
          id: string
          start_date: string
          target_hours: number
          unit_id: number | null
          user_id: string | null
        }
        Insert: {
          achieved?: boolean | null
          created_at?: string
          current_hours?: number | null
          end_date: string
          goal_type: string
          id?: string
          start_date: string
          target_hours: number
          unit_id?: number | null
          user_id?: string | null
        }
        Update: {
          achieved?: boolean | null
          created_at?: string
          current_hours?: number | null
          end_date?: string
          goal_type?: string
          id?: string
          start_date?: string
          target_hours?: number
          unit_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_goals_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          confidence_rating: number | null
          created_at: string
          date: string
          duration: number
          id: string
          notes: string | null
          subtopic: string | null
          unit_id: number | null
          user_id: string | null
        }
        Insert: {
          confidence_rating?: number | null
          created_at?: string
          date?: string
          duration: number
          id?: string
          notes?: string | null
          subtopic?: string | null
          unit_id?: number | null
          user_id?: string | null
        }
        Update: {
          confidence_rating?: number | null
          created_at?: string
          date?: string
          duration?: number
          id?: string
          notes?: string | null
          subtopic?: string | null
          unit_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "study_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_units: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          user_id: string | null
          weekly_goal: number | null
        }
        Insert: {
          color?: string
          created_at?: string
          id?: number
          name: string
          user_id?: string | null
          weekly_goal?: number | null
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          name?: string
          user_id?: string | null
          weekly_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "study_units_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      time_preferences: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          preference_type: string | null
          start_time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          preference_type?: string | null
          start_time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          preference_type?: string | null
          start_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
