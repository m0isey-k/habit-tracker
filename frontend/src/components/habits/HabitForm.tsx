import { useEffect, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export type HabitFormInput = {
  name: string
  start_date: string
  goal_days: number
  is_active?: boolean
}

export function HabitForm({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: HabitFormInput) => void
  activeId: number | null
}) {
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [goalDays, setGoalDays] = useState(30)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!open) return
    setName("")
    setStartDate(new Date().toISOString().slice(0, 10))
    setGoalDays(30)
    setIsActive(true)
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      start_date: startDate,
      goal_days: goalDays,
      is_active: isActive,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>Create Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="px-6 pb-6 pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Social Media, Gaming, Smoking"
              required
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
              onChange={(e) => setGoalDays(parseInt(e.target.value) || 30)}
              required
            />
          </div>

          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Set as Active</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
          </label>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
