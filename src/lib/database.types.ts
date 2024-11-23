export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          responsibilities: string | null
          results: string | null
          user_id: string
          responsibilities_completed: boolean
          results_completed: boolean
          tags: string[]
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          responsibilities?: string | null
          results?: string | null
          user_id: string
          responsibilities_completed?: boolean
          results_completed?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          responsibilities?: string | null
          results?: string | null
          user_id?: string
          responsibilities_completed?: boolean
          results_completed?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string | null
        }
      }
    }
  }
}