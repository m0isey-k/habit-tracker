import { useEffect, useMemo, useState } from "react"
import { habitsAPI, logsAPI, triggersAPI } from "../api/api"
import type { DailyLog, Habit, Trigger } from "../types"
import { Button } from "../components/ui/button"
import { EmptyState } from "../components/EmptyState"
import { LogForm, type LogInput } from "../components/logs/LogForm"
import { LogCard } from "../components/logs/LogCard"
import { useToast } from "../components/ToastProvider"
import { Link } from "react-router-dom"

type Ready = {
  habits: Habit[]
  triggers: Trigger[]
  logs: DailyLog[]
}

type State =
  | { status: "loading" }
  | { status: "ready"; data: Ready }
  | { status: "error"; message: string }

export default function Logs() {
  const toast = useToast()
  const [state, setState] = useState<State>({ status: "loading" })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DailyLog | null>(null)
  const [filterHabitId, setFilterHabitId] = useState<number | "all">("all")
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      setState({ status: "loading" })
      const [habits, triggers, logs] = await Promise.all([
        habitsAPI.list(),
        triggersAPI.list(),
        logsAPI.list(),
      ])
      setState({ status: "ready", data: { habits, triggers, logs } })
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      })
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filteredLogs = useMemo(() => {
    if (state.status !== "ready") return []
    const all = state.data.logs.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    if (filterHabitId === "all") return all
    return all.filter((l) => l.habit_id === filterHabitId)
  }, [state, filterHabitId])

  const openCreate = () => {
    setEditing(null)
    setOpen(true)
  }

  const openEdit = (log: DailyLog) => {
    setEditing(log)
    setOpen(true)
  }

  const closeForm = (v: boolean) => {
    setOpen(v)
    if (!v) setEditing(null)
  }

  const createOrOverwriteLog = async (data: LogInput) => {
    if (submitting) return
    if (state.status !== "ready") return

    setSubmitting(true)
    try {
      const habitId = Number(data.habit_id)
      const date = data.date

      const existing = state.data.logs.find(
        (l) => l.habit_id === habitId && l.date === date
      )

      if (existing) {
        const ok = confirm(
          "An entry for this habit and date already exists.\nDo you want to overwrite it?"
        )
        if (!ok) return

        await logsAPI.update(existing.id, data as any)
        toast.push({ type: "success", title: "Entry overwritten" })
      } else {
        await logsAPI.create(data as any)
        toast.push({ type: "success", title: "Entry created" })
      }

      setOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to save entry",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateLog = async (log: DailyLog, data: LogInput) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await logsAPI.update(log.id, data as any)
      toast.push({ type: "success", title: "Entry updated" })
      setOpen(false)
      setEditing(null)
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to update entry",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteLog = async (log: DailyLog) => {
    if (submitting) return
    if (!confirm("Delete this entry?")) return
    setSubmitting(true)
    try {
      await logsAPI.remove(log.id)
      toast.push({ type: "success", title: "Entry deleted" })
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to delete entry",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

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
        <h1 className="text-2xl font-semibold">Daily Log</h1>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <p className="font-medium">Failed to load logs</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
          <Button className="mt-3" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const { habits, triggers } = state.data

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Daily Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You need at least one habit before creating entries.
          </p>
        </div>

        <EmptyState
          title="No habits found"
          description="Create a habit first, then you can add daily entries."
          actionLabel="Go to Habits"
          actionHref="/habits"
        />

        <div className="text-sm text-muted-foreground">
          Or{" "}
          <Link to="/habits" className="text-foreground underline underline-offset-4">
            create your first habit
          </Link>
          .
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Daily Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track successes and relapses, add notes and triggers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterHabitId === "all" ? "all" : String(filterHabitId)}
            onChange={(e) => {
              const v = e.target.value
              setFilterHabitId(v === "all" ? "all" : Number(v))
            }}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            disabled={submitting}
          >
            <option value="all">All habits</option>
            {habits.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
                {h.is_active ? " (active)" : ""}
              </option>
            ))}
          </select>

          <Button onClick={openCreate} disabled={submitting}>
            Add Entry
          </Button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Add your first daily entry to start tracking."
          actionLabel="Add Entry"
          onAction={openCreate}
        />
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              habits={habits}
              triggers={triggers}
              onEdit={(l) => openEdit(l)}
              onDelete={(l) => void deleteLog(l)}
            />
          ))}
        </div>
      )}

      <LogForm
        open={open}
        onOpenChange={closeForm}
        habits={habits}
        triggers={triggers}
        initial={editing}
        onSubmit={(data) =>
          editing ? void updateLog(editing, data) : void createOrOverwriteLog(data)
        }
        submitting={submitting}
      />
    </div>
  )
}
