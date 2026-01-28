import { useState } from "react"
import { Button } from "../components/ui/button"
import { EmptyState } from "../components/EmptyState"
import { TriggerForm } from "../components/triggers/TriggerForm"
import type { Trigger } from "../types"

export default function Triggers() {
  const [items, setItems] = useState<Trigger[]>([
    { id: 1, name: "Stress" },
    { id: 2, name: "Boredom" },
    { id: 3, name: "Social pressure" },
  ])

  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Triggers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track patterns that lead to relapses
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>New Trigger</Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No triggers yet"
          description="Create triggers to understand what causes relapses."
          actionLabel="Create trigger"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-border bg-card/60 p-4 shadow-sm flex items-center justify-between"
            >
              <span className="font-medium">{t.name}</span>
              <Button
                variant="ghost"
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      <TriggerForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => setItems((prev) => [{ id: Date.now(), ...data }, ...prev])}
      />
    </div>
  )
}
