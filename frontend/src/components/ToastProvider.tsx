import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: string
  type: ToastType
  title: string
  description?: string
}

type ToastInput = {
  type?: ToastType
  title: string
  description?: string
}

type ToastApi = {
  push: (t: ToastInput) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, number>>({})

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current[id]
    if (timer) window.clearTimeout(timer)
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (t: ToastInput) => {
      const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random())
      const toast: Toast = { id, type: t.type ?? "info", title: t.title, description: t.description }
      setToasts((prev) => [toast, ...prev].slice(0, 4))

      timers.current[id] = window.setTimeout(() => remove(id), 3500)
    },
    [remove]
  )

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((x) => window.clearTimeout(x))
      timers.current = {}
    }
  }, [])

  const api = useMemo<ToastApi>(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur ${
              t.type === "success"
                ? "border-success/30"
                : t.type === "error"
                  ? "border-destructive/30"
                  : ""
            }`}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{t.title}</div>
                {t.description ? <div className="mt-1 text-sm text-muted-foreground">{t.description}</div> : null}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
