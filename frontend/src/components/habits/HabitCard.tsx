import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { Habit } from "../../types"

interface HabitCardProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habit: Habit) => void
  onSetActive: (habit: Habit) => void
}

export function HabitCard({ habit, onEdit, onDelete, onSetActive }: HabitCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{habit.name}</h3>
            {habit.is_active && (
              <Badge className="shrink-0 border-0 bg-primary/10 text-primary">
                Active
              </Badge>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>Started {new Date(habit.start_date).toLocaleDateString()}</span>
            <span>{habit.goal_days} day goal</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {!habit.is_active && (
              <DropdownMenuItem onClick={() => onSetActive(habit)}>
                Set as Active
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEdit(habit)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(habit)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}
