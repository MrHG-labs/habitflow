export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: string;
  category: string;
  order: number;
  created_at: string;
}

export interface HabitCreate {
  name: string;
  description?: string | null;
  icon?: string;
  color?: string;
  frequency?: string;
  category?: string;
}

export interface HabitUpdate {
  name?: string;
  description?: string | null;
  icon?: string;
  color?: string;
  frequency?: string;
  category?: string;
  order?: number;
}
