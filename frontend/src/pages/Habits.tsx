import { useMemo, useState } from "react"
import { HabitCard } from "../components/habits/HabitCard"
import { HabitForm, type HabitFormInput } from "../components/habits/HabitForm"
import { EmptyState } from "../components/EmptyState"
import { Button } from "../components/ui/button"
import type { Habit } from "../types"

export default function Habits() {
  const [items, setItems] = useState<Habit[]>([
    {
      id: 1,
      name: "No Social Media",
      start_date: "2025-01-01",
      goal_days: 30,
      is_active: true,
    },
    {
      id: 2,
      name: "No Gaming",
      start_date: "2025-01-10",
      goal_days: 14,
      is_active: false,
    },
  ])

  const [open, setOpen] = useState(false)
  const activeId = useMemo(() => items.find((h) => h.is_active)?.id ?? null, [items])

  const createHabit = (data: HabitFormInput) => {
    const id = Date.now()

    setItems((prev) => {
      const next = [
        ...prev.map((h) => (data.is_active ? { ...h, is_active: false } : h)),
        { id, ...data, is_active: !!data.is_active },
      ]
      return data.is_active ? next.map((h) => ({ ...h, is_active: h.id === id })) : next
    })
  }

  const deleteHabit = (habit: Habit) => {
    setItems((prev) => prev.filter((h) => h.id !== habit.id))
  }

  const setActive = (habit: Habit) => {
    setItems((prev) => prev.map((h) => ({ ...h, is_active: h.id === habit.id })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Habits</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the habits you want to track
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>New Habit</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Start by creating a habit you want to track."
          actionLabel="Create your first habit"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {items.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={() => {}}
              onDelete={deleteHabit}
              onSetActive={setActive}
            />
          ))}
        </div>
      )}

      <HabitForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={createHabit}
        activeId={activeId}
      />
    </div>
  )
}
