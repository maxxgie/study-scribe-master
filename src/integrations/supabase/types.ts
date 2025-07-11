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
      assignment_files: {
        Row: {
          assignment_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          user_id: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          user_id: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_files_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          assignment_course_id: string | null
          attachment_url: string | null
          completed: boolean | null
          course_id: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assignment_course_id?: string | null
          attachment_url?: string | null
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assignment_course_id?: string | null
          attachment_url?: string | null
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_assignment_course_id_fkey"
            columns: ["assignment_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      course_files: {
        Row: {
          course_id: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_files_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          color: string | null
          created_at: string
          credits: number | null
          description: string | null
          id: string
          instructor: string | null
          name: string
          semester: string | null
          updated_at: string
          user_id: string
          weekly_goal: number | null
          year: number | null
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          instructor?: string | null
          name: string
          semester?: string | null
          updated_at?: string
          user_id: string
          weekly_goal?: number | null
          year?: number | null
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string
          credits?: number | null
          description?: string | null
          id?: string
          instructor?: string | null
          name?: string
          semester?: string | null
          updated_at?: string
          user_id?: string
          weekly_goal?: number | null
          year?: number | null
        }
        Relationships: []
      }
      exam_schedules: {
        Row: {
          course_id: string
          created_at: string
          duration_minutes: number | null
          exam_date: string
          exam_type: string
          id: string
          instructions: string | null
          location: string | null
          title: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          duration_minutes?: number | null
          exam_date: string
          exam_type?: string
          id?: string
          instructions?: string | null
          location?: string | null
          title: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          duration_minutes?: number | null
          exam_date?: string
          exam_type?: string
          id?: string
          instructions?: string | null
          location?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          answer: string
          course_id: string | null
          created_at: string
          difficulty: number | null
          id: string
          next_review: string
          question: string
          review_count: number | null
          user_id: string | null
        }
        Insert: {
          answer: string
          course_id?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          next_review?: string
          question: string
          review_count?: number | null
          user_id?: string | null
        }
        Update: {
          answer?: string
          course_id?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          next_review?: string
          question?: string
          review_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          related_id: string | null
          related_table: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          related_id?: string | null
          related_table?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          related_id?: string | null
          related_table?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string | null
          theme_preference: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          theme_preference?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_scores: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          max_score: number
          quiz_date: string
          quiz_topic: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          max_score: number
          quiz_date?: string
          quiz_topic?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          max_score?: number
          quiz_date?: string
          quiz_topic?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_scores_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          course_id: string | null
          created_at: string
          description: string | null
          id: string
          title: string
          url: string
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
          url: string
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_links_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          course_id: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          searchable_content: string | null
          user_id: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          searchable_content?: string | null
          user_id?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          searchable_content?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_files_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          course_id: string | null
          created_at: string
          current_hours: number | null
          end_date: string
          goal_type: string
          id: string
          start_date: string
          target_hours: number
          user_id: string | null
        }
        Insert: {
          achieved?: boolean | null
          course_id?: string | null
          created_at?: string
          current_hours?: number | null
          end_date: string
          goal_type: string
          id?: string
          start_date: string
          target_hours: number
          user_id?: string | null
        }
        Update: {
          achieved?: boolean | null
          course_id?: string | null
          created_at?: string
          current_hours?: number | null
          end_date?: string
          goal_type?: string
          id?: string
          start_date?: string
          target_hours?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_goals_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          course_id: string | null
          created_at: string
          date: string
          duration: number
          id: string
          notes: string | null
          subtopic: string | null
          user_id: string | null
        }
        Insert: {
          confidence_rating?: number | null
          course_id?: string | null
          created_at?: string
          date?: string
          duration: number
          id?: string
          notes?: string | null
          subtopic?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_rating?: number | null
          course_id?: string | null
          created_at?: string
          date?: string
          duration?: number
          id?: string
          notes?: string | null
          subtopic?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
          course_id: string | null
          created_at: string
          id: number
          is_lagging: boolean | null
          lagging_hours: number | null
          name: string
          user_id: string | null
          weekly_goal: number | null
        }
        Insert: {
          color?: string
          course_id?: string | null
          created_at?: string
          id?: number
          is_lagging?: boolean | null
          lagging_hours?: number | null
          name: string
          user_id?: string | null
          weekly_goal?: number | null
        }
        Update: {
          color?: string
          course_id?: string | null
          created_at?: string
          id?: number
          is_lagging?: boolean | null
          lagging_hours?: number | null
          name?: string
          user_id?: string | null
          weekly_goal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "study_units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
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
      weekly_progress: {
        Row: {
          created_at: string
          end_date: string
          goals_met: number | null
          id: string
          recommendations: string | null
          start_date: string
          summary: string | null
          total_goals: number | null
          total_hours: number | null
          user_id: string
          week_number: number
        }
        Insert: {
          created_at?: string
          end_date: string
          goals_met?: number | null
          id?: string
          recommendations?: string | null
          start_date: string
          summary?: string | null
          total_goals?: number | null
          total_hours?: number | null
          user_id: string
          week_number: number
        }
        Update: {
          created_at?: string
          end_date?: string
          goals_met?: number | null
          id?: string
          recommendations?: string | null
          start_date?: string
          summary?: string | null
          total_goals?: number | null
          total_hours?: number | null
          user_id?: string
          week_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_lagging_units: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_assignment_notifications: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
