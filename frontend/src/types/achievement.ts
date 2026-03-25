export interface Achievement {
  id: number;
  user_id: number;
  habit_id: number | null;
  habit_name_snapshot: string;
  habit_icon_snapshot: string;
  milestone_days: number;
  medal_type: 'Flame' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  granted_at: string;
}
