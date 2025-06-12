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
      admin_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          expert_id: string | null
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          expert_id?: string | null
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          expert_id?: string | null
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          cancellation_reason: string | null
          client_id: string | null
          client_notes: string | null
          created_at: string | null
          currency: string | null
          duration_minutes: number
          expert_id: string | null
          expert_notes: string | null
          id: string
          meeting_url: string | null
          rescheduled_from: string | null
          scheduled_at: string
          service_id: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          currency?: string | null
          duration_minutes: number
          expert_id?: string | null
          expert_notes?: string | null
          id?: string
          meeting_url?: string | null
          rescheduled_from?: string | null
          scheduled_at: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          currency?: string | null
          duration_minutes?: number
          expert_id?: string | null
          expert_notes?: string | null
          id?: string
          meeting_url?: string | null
          rescheduled_from?: string | null
          scheduled_at?: string
          service_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_rescheduled_from_fkey"
            columns: ["rescheduled_from"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      digital_products: {
        Row: {
          category_id: string | null
          content_type: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          download_count: number | null
          expert_id: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          preview_url: string | null
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          download_count?: number | null
          expert_id?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          preview_url?: string | null
          price: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          download_count?: number | null
          expert_id?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          preview_url?: string | null
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_products_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      expert_profiles: {
        Row: {
          average_rating: number | null
          certifications: string[] | null
          created_at: string | null
          currency: string | null
          education: string | null
          expertise_areas: string[] | null
          hourly_rate: number | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          languages: string[] | null
          linkedin_url: string | null
          profile_id: string | null
          response_time_hours: number | null
          title: string
          total_earnings: number | null
          total_reviews: number | null
          total_sessions: number | null
          twitter_url: string | null
          updated_at: string | null
          website_url: string | null
          years_experience: number | null
        }
        Insert: {
          average_rating?: number | null
          certifications?: string[] | null
          created_at?: string | null
          currency?: string | null
          education?: string | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          profile_id?: string | null
          response_time_hours?: number | null
          title: string
          total_earnings?: number | null
          total_reviews?: number | null
          total_sessions?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Update: {
          average_rating?: number | null
          certifications?: string[] | null
          created_at?: string | null
          currency?: string | null
          education?: string | null
          expertise_areas?: string[] | null
          hourly_rate?: number | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          linkedin_url?: string | null
          profile_id?: string | null
          response_time_hours?: number | null
          title?: string
          total_earnings?: number | null
          total_reviews?: number | null
          total_sessions?: number | null
          twitter_url?: string | null
          updated_at?: string | null
          website_url?: string | null
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          subject: string | null
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          cashfree_order_id: string | null
          cashfree_payment_id: string | null
          created_at: string | null
          currency: string | null
          expert_earnings: number
          id: string
          payment_method: string | null
          payer_id: string | null
          platform_fee: number | null
          processed_at: string | null
          recipient_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          created_at?: string | null
          currency?: string | null
          expert_earnings: number
          id?: string
          payment_method?: string | null
          payer_id?: string | null
          platform_fee?: number | null
          processed_at?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          cashfree_order_id?: string | null
          cashfree_payment_id?: string | null
          created_at?: string | null
          currency?: string | null
          expert_earnings?: number
          id?: string
          payment_method?: string | null
          payer_id?: string | null
          platform_fee?: number | null
          processed_at?: string | null
          recipient_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          expert_id: string | null
          id: string
          is_public: boolean | null
          rating: number
          reviewer_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          expert_id?: string | null
          id?: string
          is_public?: boolean | null
          rating: number
          reviewer_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          expert_id?: string | null
          id?: string
          is_public?: boolean | null
          rating?: number
          reviewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          duration_minutes: number | null
          expert_id: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          name: string
          price: number
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name: string
          price: number
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          duration_minutes?: number | null
          expert_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          name?: string
          price?: number
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          }
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
      booking_status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled"
      notification_type: "booking" | "payment" | "message" | "review" | "system"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      service_type: "1on1" | "package" | "webinar" | "digital"
      user_role: "user" | "expert" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}