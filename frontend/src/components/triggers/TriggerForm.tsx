import { useEffect, useState, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export type CreateTriggerInput = {
  name: string
}

export function TriggerForm({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTriggerInput) => void
}) {
  const [name, setName] = useState("")

  useEffect(() => {
    if (!open) return
    setName("")
  }, [open])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ name: name.trim() })
    onOpenChange(false)
  }

  const disabled = !name.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <DialogHeader>
          <DialogTitle>New trigger</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="px-6 pb-6 pt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Stress, Boredom, Social pressure"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={disabled}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
