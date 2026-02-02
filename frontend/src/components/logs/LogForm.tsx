import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import type { DailyLog, Habit, Trigger } from "../../types"

export type LogInput = {
  habit_id: number
  date: string
  status: "success" | "relapse"
  note?: string
  trigger_id?: number
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  habits: Habit[]
  triggers: Trigger[]
  initial?: DailyLog | null
  onSubmit: (data: LogInput) => void
  submitting?: boolean
}

export function LogForm({ open, onOpenChange, habits, triggers, initial, onSubmit, submitting = false }: Props) {
  const defaultHabitId = useMemo(() => {
    const active = habits.find((h) => h.is_active)
    return active?.id ?? habits[0]?.id ?? 0
  }, [habits])

  const [habitId, setHabitId] = useState<number>(defaultHabitId)
  const [date, setDate] = useState("")
  const [status, setStatus] = useState<"success" | "relapse">("success")
  const [note, setNote] = useState("")
  const [triggerId, setTriggerId] = useState<number | "none">("none")

  useEffect(() => {
    if (!open) return

    if (initial) {
      setHabitId(initial.habit_id)
      setDate(initial.date)
      setStatus(initial.status)
      setNote(initial.note ?? "")
      setTriggerId(initial.trigger_id ?? "none")
      return
    }

    setHabitId(defaultHabitId)
    setDate(new Date().toISOString().slice(0, 10))
    setStatus("success")
    setNote("")
    setTriggerId("none")
  }, [open, initial, defaultHabitId])

  useEffect(() => {
    if (status === "success") setTriggerId("none")
  }, [status])

  const canSubmit = habits.length > 0 && habitId !== 0 && date.length > 0 && !submitting

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    onSubmit({
      habit_id: habitId,
      date,
      status,
      note: note.trim() ? note.trim() : undefined,
      trigger_id: status === "relapse" && triggerId !== "none" ? triggerId : undefined,
    })
  }

  const title = initial ? "Edit Entry" : "Add Daily Entry"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 pb-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="habit">Habit</Label>
            <select
              id="habit"
              value={habitId}
              onChange={(e) => setHabitId(Number(e.target.value))}
              className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              disabled={submitting || habits.length === 0}
              required
            >
              {habits.length === 0 ? <option value={0}>No habits</option> : null}
              {habits.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}{h.is_active ? " (active)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required disabled={submitting} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={status === "success" ? "default" : "outline"}
                className={`flex-1 ${status === "success" ? "bg-success text-success-foreground hover:bg-success/90" : ""}`}
                onClick={() => setStatus("success")}
                disabled={submitting}
              >
                Success
              </Button>
              <Button
                type="button"
                variant={status === "relapse" ? "default" : "outline"}
                className={`flex-1 ${status === "relapse" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
                onClick={() => setStatus("relapse")}
                disabled={submitting}
              >
                Relapse
              </Button>
            </div>
          </div>

          {status === "relapse" ? (
            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger (optional)</Label>
              <select
                id="trigger"
                value={triggerId}
                onChange={(e) => {
                  const v = e.target.value
                  setTriggerId(v === "none" ? "none" : Number(v))
                }}
                className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                disabled={submitting}
              >
                <option value="none">None</option>
                {triggers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did you feel today?"
              rows={3}
              className="resize-none"
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!canSubmit}>
              {submitting ? "Saving..." : initial ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
