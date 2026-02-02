import { useEffect, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import type { Trigger } from "../../types"

type TriggerInput = { name: string }

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TriggerInput) => void
  initial?: Trigger | null
}

export function TriggerForm({ open, onOpenChange, onSubmit, initial }: Props) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
  }, [open, initial])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Trigger" : "Create Trigger"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 px-6 pb-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Stress, Party, Boredom"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initial ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
