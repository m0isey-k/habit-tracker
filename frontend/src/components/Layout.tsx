import type { ReactNode } from "react"
import { Navigation } from "./Navigation"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  )
}
