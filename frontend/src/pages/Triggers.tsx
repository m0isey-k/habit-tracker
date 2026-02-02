import { useEffect, useState } from "react"
import { triggersAPI } from "../api/api"
import { Button } from "../components/ui/button"
import { EmptyState } from "../components/EmptyState"
import type { Trigger } from "../types"
import { Card, CardContent } from "../components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { TriggerForm } from "../components/triggers/TriggerForm"

type State =
  | { status: "loading" }
  | { status: "ready"; items: Trigger[] }
  | { status: "error"; message: string }

export default function Triggers() {
  const [state, setState] = useState<State>({ status: "loading" })
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Trigger | null>(null)

  const load = async () => {
    try {
      setState({ status: "loading" })
      const items = await triggersAPI.list()
      setState({ status: "ready", items })
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      })
    }
  }

  useEffect(() => {
    load()
  }, [])

  const create = async (data: { name: string }) => {
    try {
      await triggersAPI.create(data)
      setOpen(false)
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to create trigger")
    }
  }

  const update = async (t: Trigger, data: { name: string }) => {
    try {
      await triggersAPI.update(t.id, data)
      setEditing(null)
      setOpen(false)
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update trigger")
    }
  }

  const remove = async (t: Trigger) => {
    if (!confirm(`Delete "${t.name}"?`)) return
    try {
      await triggersAPI.remove(t.id)
      await load()
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete trigger")
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
        <h1 className="text-2xl font-semibold">Triggers</h1>
        <div className="rounded-xl border border-border bg-card/60 p-4">
          <p className="font-medium">Failed to load triggers</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.message}</p>
          <Button className="mt-3" onClick={load}>Retry</Button>
        </div>
      </div>
    )
  }

  const items = state.items

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Triggers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage relapse triggers you want to track
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          New Trigger
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No triggers yet"
          description="Create your first trigger to attach to relapse logs."
          actionLabel="Create Trigger"
          onAction={() => {
            setEditing(null)
            setOpen(true)
          }}
        />
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{t.name}</div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setEditing(t)
                        setOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => remove(t)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TriggerForm
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) setEditing(null)
        }}
        initial={editing}
        onSubmit={(data) => (editing ? update(editing, data) : create(data))}
      />
    </div>
  )
}
