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
      layout_nodes: {
        Row: {
          boolean_id: number | null
          classes: string | null
          content: string | null
          created_at: string | null
          height: number | null
          id: number
          img_src: string | null
          key: string
          layout_id: number | null
          left: number | null
          parent_node_id: number | null
          sibling_order: number | null
          top: number | null
          user_id: string
          variable_id: number | null
          width: number | null
        }
        Insert: {
          boolean_id?: number | null
          classes?: string | null
          content?: string | null
          created_at?: string | null
          height?: number | null
          id?: number
          img_src?: string | null
          key: string
          layout_id?: number | null
          left?: number | null
          parent_node_id?: number | null
          sibling_order?: number | null
          top?: number | null
          user_id: string
          variable_id?: number | null
          width?: number | null
        }
        Update: {
          boolean_id?: number | null
          classes?: string | null
          content?: string | null
          created_at?: string | null
          height?: number | null
          id?: number
          img_src?: string | null
          key?: string
          layout_id?: number | null
          left?: number | null
          parent_node_id?: number | null
          sibling_order?: number | null
          top?: number | null
          user_id?: string
          variable_id?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "layout_nodes_boolean_id_fkey"
            columns: ["boolean_id"]
            referencedRelation: "state_variables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_nodes_layout_id_fkey"
            columns: ["layout_id"]
            referencedRelation: "layouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_nodes_parent_node_id_fkey"
            columns: ["parent_node_id"]
            referencedRelation: "layout_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_nodes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "layout_nodes_variable_id_fkey"
            columns: ["variable_id"]
            referencedRelation: "state_variables"
            referencedColumns: ["id"]
          }
        ]
      }
      layouts: {
        Row: {
          created_at: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "layouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      state_variables: {
        Row: {
          created_at: string | null
          id: number
          key: string
          type: "string"|"boolean"|"number"
          user_id: string
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          type?: "string"|"boolean"|"number"
          user_id: string
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          type?: "string"|"boolean"|"number"
          user_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "state_variables_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
