import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { DailyLog, Habit, Trigger } from "../../types"

type Props = {
  log: DailyLog
  habits: Habit[]
  triggers: Trigger[]
  onEdit: (log: DailyLog) => void
  onDelete: (log: DailyLog) => void
}

export function LogCard({ log, habits, triggers, onEdit, onDelete }: Props) {
  const habit = habits.find((h) => h.id === log.habit_id)
  const trigger = log.trigger_id ? triggers.find((t) => t.id === log.trigger_id) : undefined

  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="font-medium truncate">{habit?.name ?? `Habit #${log.habit_id}`}</div>
            <div className="text-sm text-muted-foreground">{log.date}</div>

            <span
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                log.status === "success"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {log.status}
            </span>

            {log.status === "relapse" ? (
              <span className="text-sm text-muted-foreground">
                Trigger: {trigger?.name ?? "None"}
              </span>
            ) : null}
          </div>

          {log.note ? <div className="mt-2 text-sm text-muted-foreground">{log.note}</div> : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(log)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(log)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
