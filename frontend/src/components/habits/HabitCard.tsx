import { MoreHorizontal, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react"
import type { Habit } from "../../types"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type Props = {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onToggleActive: (habit: Habit) => void
}

export function HabitCard({ habit, onEdit, onDelete, onToggleActive }: Props) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{habit.name}</h3>
            {habit.is_active ? (
              <Badge className="shrink-0 border-0 bg-primary/10 text-primary">Active</Badge>
            ) : null}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            Started {new Date(habit.start_date).toLocaleDateString()} · {habit.goal_days} day goal
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onToggleActive(habit)}>
              {habit.is_active ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(habit)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
