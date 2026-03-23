export interface ToggleResult {
  id: number;
  habit_id: number;
  user_id: number;
  completed: boolean;
  completed_at: string | null;
  date: string;
  xp_gained: number;
  user_xp: number;
  user_level: number;
  leveled_up: boolean;
}
