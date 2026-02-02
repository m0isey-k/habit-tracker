import { useEffect, useMemo, useState } from "react"
import { habitsAPI, type HabitStats } from "../api/api"
import type { Habit } from "../types"
import { StatsCard } from "../components/stats/StatsCard"
import { ProgressRing } from "../components/stats/ProgressRing"
import { EmptyState } from "../components/EmptyState"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { useToast } from "../components/ToastProvider"

type Item = { habit: Habit; stats: HabitStats }

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; items: Item[] }
  | { status: "error"; message: string }

export default function Dashboard() {
  const toast = useToast()
  const [state, setState] = useState<State>({ status: "loading" })

  const load = async () => {
    try {
      setState({ status: "loading" })

      const activeHabits = await habitsAPI.active()

      if (!activeHabits.length) {
        setState({ status: "empty" })
        return
      }

      const statsList = await Promise.all(
        activeHabits.map((h) => habitsAPI.stats(h.id))
      )

      const items: Item[] = activeHabits.map((habit, i) => ({
        habit,
        stats: statsList[i],
      }))

      setState({ status: "ready", items })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error"
      setState({ status: "error", message: msg })
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const summary = useMemo(() => {
    if (state.status !== "ready") return null

    const items = state.items
    const active_count = items.length
    const total_success_days = items.reduce((acc, x) => acc + x.stats.total_success_days, 0)
    const total_relapse_count = items.reduce((acc, x) => acc + x.stats.total_relapse_count, 0)
    const best_streak = items.reduce((acc, x) => Math.max(acc, x.stats.streak), 0)

    const avg_progress_percentage =
      active_count === 0
        ? 0
        : Math.round(
            items.reduce((acc, x) => acc + x.stats.progress_percentage, 0) / active_count
          )

    return {
      active_count,
      total_success_days,
      total_relapse_count,
      best_streak,
      avg_progress_percentage,
    }
  }, [state])

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <p className="font-medium">Failed to load dashboard</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
          <Button className="mt-3" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (state.status === "empty") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            No active habits yet.
          </p>
        </div>
        <EmptyState
          title="No active habits"
          description="Go to Habits and mark at least one habit as active to see progress here."
          actionLabel="Go to Habits"
          actionHref="/habits"
        />
      </div>
    )
  }

  const items = state.items
  const s = summary!

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of all active habits
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            toast.push({ type: "success", title: "Refreshing…" })
            void load()
          }}
        >
          Refresh
        </Button>
      </div>

      <div className="flex justify-center">
        <ProgressRing progress={s.avg_progress_percentage} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatsCard label="Active habits" value={s.active_count} />
        <StatsCard label="Success days" value={s.total_success_days} />
        <StatsCard label="Relapses" value={s.total_relapse_count} />
        <StatsCard label="Best streak" value={`${s.best_streak} days`} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Active habits</h2>

        <div className="grid grid-cols-1 gap-3">
          {items.map(({ habit, stats }) => (
            <Card key={habit.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <div className="truncate font-medium">{habit.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stats.streak} day streak · {stats.total_success_days} success ·{" "}
                    {stats.total_relapse_count} relapses
                  </div>
                </div>

                <div className="shrink-0">
                  <ProgressRing
                    progress={stats.progress_percentage}
                    size={72}
                    strokeWidth={6}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
