import type { Habit, DailyLog, Trigger } from "../types"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "../auth/tokens"

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8000/api"

type TokenPair = { access: string; refresh: string }

async function rawRequest(path: string, options: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${path}`, options)
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  const res = await rawRequest("/auth/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) return null

  const data = (await res.json()) as { access: string }
  const currentRefresh = getRefreshToken()
  if (!currentRefresh) return null

  setTokens(data.access, currentRefresh)
  return data.access
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const make = async (token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as any),
    }
    if (token) headers.Authorization = `Bearer ${token}`

    return rawRequest(path, { ...options, headers })
  }

  const token = getAccessToken()
  let res = await make(token || undefined)

  // авто-refresh
  if (res.status === 401) {
    const newAccess = await refreshAccessToken()

    if (!newAccess) {
      clearTokens()
      window.dispatchEvent(new Event("auth:logout"))
      throw new Error(`API 401: Unauthorized`)
    }

    res = await make(newAccess)
  }

  const text = await res.text().catch(() => "")

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }

  if (res.status === 204 || !text) return {} as T

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`API ${res.status}: Invalid JSON response`)
  }
}

/* =========================
   Types
========================= */

export type HabitStats = {
  streak: number
  total_success_days: number
  total_relapse_count: number
  goal_days: number
  progress_percentage: number
}

export type DashboardItem = {
  habit: Habit
  stats: HabitStats
}

export type DashboardSummary = {
  active_count: number
  total_success_days: number
  total_relapse_count: number
  avg_progress_percentage: number
  best_streak: number
  items: DashboardItem[]
}

export type HabitCreateUpdate = {
  name: string
  start_date: string
  goal_days: number
  is_active?: boolean
}

export type TriggerCreateUpdate = { name: string }

export type LogCreateUpdate = {
  habit_id: number
  date: string
  status: "success" | "relapse"
  note?: string
  trigger_id?: number
}

/* =========================
   API: Habits
========================= */

export const habitsAPI = {
  list: () => request<Habit[]>("/habits/"),
  create: (data: HabitCreateUpdate) =>
    request<Habit>("/habits/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<HabitCreateUpdate>) =>
    request<Habit>(`/habits/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/habits/${id}/`, { method: "DELETE" }),

  active: () => request<Habit[]>("/habits/active/"),
  stats: (id: number) => request<HabitStats>(`/habits/${id}/stats/`),

  // ✅ ДОБАВИЛИ: сводка для dashboard (если ты сделал endpoint на бэке)
  dashboard: () => request<DashboardSummary>("/habits/dashboard/"),
}

/* =========================
   API: Triggers
========================= */

export const triggersAPI = {
  list: () => request<Trigger[]>("/triggers/"),
  create: (data: TriggerCreateUpdate) =>
    request<Trigger>("/triggers/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<TriggerCreateUpdate>) =>
    request<Trigger>(`/triggers/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: number) => request<void>(`/triggers/${id}/`, { method: "DELETE" }),
}

/* =========================
   API: Logs
========================= */

function toLogPayload(data: LogCreateUpdate) {
  return {
    habit: data.habit_id,
    date: data.date,
    status: data.status,
    note: data.note,
    trigger: data.trigger_id,
  }
}

function normalizeLog(log: any): DailyLog {
  return {
    id: log.id,
    habit_id:
      typeof log.habit_id === "number" ? log.habit_id : Number(log.habit),
    date: log.date,
    status: log.status,
    note: log.note ?? undefined,
    trigger_id:
      log.trigger_id ?? (log.trigger != null ? Number(log.trigger) : undefined),
  }
}

export const logsAPI = {
  list: async (habitId?: number) => {
    const data = await request<any[]>(
      habitId ? `/logs/?habit_id=${habitId}` : "/logs/"
    )
    return (data ?? []).map(normalizeLog)
  },

  create: async (data: LogCreateUpdate) => {
    const created = await request<any>("/logs/", {
      method: "POST",
      body: JSON.stringify(toLogPayload(data)),
    })
    return normalizeLog(created)
  },

  update: async (id: number, data: Partial<LogCreateUpdate>) => {
    const payload: any = {}
    if (typeof data.habit_id === "number") payload.habit = data.habit_id
    if (typeof data.date === "string") payload.date = data.date
    if (typeof data.status === "string") payload.status = data.status
    if ("note" in data) payload.note = data.note
    if ("trigger_id" in data) payload.trigger = data.trigger_id

    const updated = await request<any>(`/logs/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
    return normalizeLog(updated)
  },

  remove: (id: number) => request<void>(`/logs/${id}/`, { method: "DELETE" }),


  upsert: async (data: LogCreateUpdate) => {
    const existing = await logsAPI.list(data.habit_id)
    const sameDay = existing.find((x) => x.date === data.date)
    return sameDay ? logsAPI.update(sameDay.id, data) : logsAPI.create(data)
  },
}

/* =========================
   API: Auth
========================= */

export const authAPI = {
  register: (username: string, password: string) =>
    request("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  login: async (username: string, password: string) => {
    const pair = await request<TokenPair>("/auth/token/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
    setTokens(pair.access, pair.refresh)
    return pair
  },

  logout: () => {
    clearTokens()
    window.dispatchEvent(new Event("auth:logout"))
  },
}

export { clearTokens }
