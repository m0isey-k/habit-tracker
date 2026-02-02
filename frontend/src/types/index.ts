export interface Habit {
  id: number
  name: string
  start_date: string
  goal_days: number
  is_active: boolean
}

export interface Trigger {
  id: number
  name: string
}

export interface DailyLog {
  id: number
  habit_id: number
  date: string
  status: "success" | "relapse"
  note?: string
  trigger_id?: number
}

export interface CreateDailyLogInput {
  habit_id: number
  date: string
  status: "success" | "relapse"
  note?: string
  trigger_id?: number
}

export type CreateHabitInput = {
  name: string
  start_date: string
  goal_days: number
  is_active?: boolean
}
