import { Card, CardContent } from "../ui/card"
import type { DailyLog, Habit, Trigger } from "../../types"

type Props = {
  log: DailyLog
  habits: Habit[]
  triggers: Trigger[]
}

export function RecentLogItem({ log, habits, triggers }: Props) {
  const habit = habits.find((h) => h.id === log.habit_id)
  const trigger = log.trigger_id ? triggers.find((t) => t.id === log.trigger_id) : undefined

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="font-medium truncate">{habit?.name ?? `Habit #${log.habit_id}`}</div>
            <div className="text-sm text-muted-foreground">{log.date}</div>
            <div
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                log.status === "success"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {log.status}
            </div>
            {log.status === "relapse" ? (
              <div className="text-sm text-muted-foreground">
                Trigger: {trigger?.name ?? "None"}
              </div>
            ) : null}
          </div>

          {log.note ? (
            <div className="mt-2 text-sm text-muted-foreground">{log.note}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
