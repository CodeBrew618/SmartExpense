export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  currency: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  is_default: boolean
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  category_id: string | null
  amount: number
  currency: string
  date: string
  note: string | null
  created_at: string
  updated_at: string
  category?: Category
}

export type ExpenseFormData = {
  amount: number
  category_id: string
  date: string
  note?: string
}
