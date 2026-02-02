import { useEffect, useState } from "react"
import { habitsAPI } from "../api/api"
import type { Habit } from "../types"
import { HabitCard } from "../components/habits/HabitCard"
import { HabitForm, type HabitInput } from "../components/habits/HabitForm"
import { Button } from "../components/ui/button"
import { EmptyState } from "../components/EmptyState"
import { useToast } from "../components/ToastProvider"

type State =
  | { status: "loading" }
  | { status: "ready"; items: Habit[] }
  | { status: "error"; message: string }

export default function Habits() {
  const toast = useToast()
  const [state, setState] = useState<State>({ status: "loading" })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Habit | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const load = async () => {
    try {
      setState({ status: "loading" })
      const items = await habitsAPI.list()
      setState({ status: "ready", items })
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

  const closeForm = (v: boolean) => {
    setOpen(v)
    if (!v) setEditing(null)
  }

  const createHabit = async (data: HabitInput) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await habitsAPI.create({
        name: data.name,
        start_date: data.start_date,
        goal_days: data.goal_days,
        is_active: !!data.is_active,
      } as any)

      toast.push({ type: "success", title: "Habit created" })
      setOpen(false)
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to create habit",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateHabit = async (habit: Habit, data: HabitInput) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await habitsAPI.update(habit.id, {
        name: data.name,
        start_date: data.start_date,
        goal_days: data.goal_days,
        is_active: !!data.is_active,
      } as any)

      toast.push({ type: "success", title: "Habit updated" })
      setEditing(null)
      setOpen(false)
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to update habit",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const toggleActiveHabit = async (habit: Habit) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await habitsAPI.update(habit.id, { is_active: !habit.is_active } as any)
      toast.push({
        type: "success",
        title: habit.is_active ? "Habit deactivated" : "Habit activated",
      })
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to toggle active",
        description: e instanceof Error ? e.message : "Unknown error",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteHabit = async (habit: Habit) => {
    if (submitting) return
    if (!confirm(`Delete "${habit.name}"?`)) return
    setSubmitting(true)
    try {
      await habitsAPI.remove(habit.id)
      toast.push({ type: "success", title: "Habit deleted" })
      await load()
    } catch (e) {
      toast.push({
        type: "error",
        title: "Failed to delete habit",
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
        <h1 className="text-2xl font-semibold">Habits</h1>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <p className="font-medium">Failed to load habits</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
          <Button className="mt-3" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const items = state.items

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Habits</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage the habits you want to track</p>
        </div>

        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          disabled={submitting}
        >
          New Habit
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Create your first habit to start tracking."
          actionLabel="Create Habit"
          onAction={() => {
            setEditing(null)
            setOpen(true)
          }}
        />
      ) : (
        <div className="space-y-3">
          {items.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={(h) => {
                setEditing(h)
                setOpen(true)
              }}
              onDelete={(h) => void deleteHabit(h)}
              onToggleActive={(h) => void toggleActiveHabit(h)}
            />
          ))}
        </div>
      )}

      <HabitForm
        open={open}
        onOpenChange={closeForm}
        initial={editing}
        onSubmit={(data) => (editing ? void updateHabit(editing, data) : void createHabit(data))}
        submitting={submitting}
        defaultActive={state.status === "ready" && state.items.length === 0}
      />
    </div>
  )
}
