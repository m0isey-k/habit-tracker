import { useMemo, useState } from "react"
import { Button } from "../components/ui/button"
import { EmptyState } from "../components/EmptyState"
import { LogForm } from "../components/logs/LogForm"
import type { DailyLog, Habit } from "../types"

export default function Logs() {
  const [habits] = useState<Habit[]>([
    { id: 1, name: "No Social Media", start_date: "2025-01-01", goal_days: 30, is_active: true },
    { id: 2, name: "No Gaming", start_date: "2025-01-10", goal_days: 14, is_active: false },
  ])

  const [logs, setLogs] = useState<DailyLog[]>([
    { id: 1, habit_id: 1, date: "2025-01-25", status: "success" },
    { id: 2, habit_id: 1, date: "2025-01-26", status: "relapse", note: "Stress at work" },
  ])

  const [open, setOpen] = useState(false)

  const habitNameById = useMemo(() => {
    const map = new Map<number, string>()
    habits.forEach((h) => map.set(h.id, h.name))
    return map
  }, [habits])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Daily Log</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record daily progress and relapses
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>Add Entry</Button>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          title="No entries yet"
          description="Add your first daily entry to start tracking progress."
          actionLabel="Add entry"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {logs
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((log) => (
              <div key={log.id} className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {habitNameById.get(log.habit_id) ?? "Unknown habit"}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{log.date}</p>
                  </div>
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                    {log.status}
                  </span>
                </div>
                {log.note && <p className="mt-3 text-sm text-muted-foreground">{log.note}</p>}
              </div>
            ))}
        </div>
      )}

      <LogForm
        open={open}
        onOpenChange={setOpen}
        habits={habits}
        onSubmit={(data) => {
          setLogs((prev) => [{ id: Date.now(), ...data }, ...prev])
        }}
      />
    </div>
  )
}
