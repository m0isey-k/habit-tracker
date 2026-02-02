import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

type Props = {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { isAuthed } = useAuth()

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
