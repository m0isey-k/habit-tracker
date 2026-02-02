import type { ReactNode } from "react"
import { Navigation } from "./Navigation"
import { ToastProvider } from "./ToastProvider"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </div>
    </ToastProvider>
  )
}
