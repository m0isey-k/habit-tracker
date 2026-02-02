import { useEffect, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import type { Habit } from "../../types"

export type HabitInput = {
  name: string
  start_date: string
  goal_days: number
  is_active?: boolean
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Habit | null
  onSubmit: (data: HabitInput) => void
  submitting?: boolean
  defaultActive?: boolean
}

export function HabitForm({
  open,
  onOpenChange,
  initial,
  onSubmit,
  submitting = false,
  defaultActive = false,
}: Props) {
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [goalDays, setGoalDays] = useState(30)
  const [isActive, setIsActive] = useState(defaultActive)

  useEffect(() => {
    if (!open) return

    if (initial) {
      setName(initial.name)
      setStartDate(initial.start_date)
      setGoalDays(initial.goal_days)
      setIsActive(initial.is_active)
      return
    }

    setName("")
    setStartDate(new Date().toISOString().slice(0, 10))
    setGoalDays(30)
    setIsActive(defaultActive)
  }, [open, initial, defaultActive])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onSubmit({
      name: trimmed,
      start_date: startDate,
      goal_days: goalDays,
      is_active: isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Habit" : "Create Habit"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 pb-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Social Media, Gaming, Smoking"
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goalDays">Goal (days)</Label>
            <Input
              id="goalDays"
              type="number"
              min={1}
              max={365}
              value={goalDays}
              onChange={(e) => setGoalDays(Number(e.target.value) || 30)}
              required
              disabled={submitting}
            />
          </div>

          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Set as Active</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
              disabled={submitting}
            />
          </label>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting || !name.trim()}>
              {submitting ? "Saving..." : initial ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
