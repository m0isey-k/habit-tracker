import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../api/api"
import { isAuthed as hasTokens, clearTokens } from "./tokens"

type AuthCtx = {
  isAuthed: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const nav = useNavigate()
  const [isAuthed, setIsAuthed] = useState(hasTokens())

  const logout = () => {
    clearTokens()
    setIsAuthed(false)
    nav("/login", { replace: true })
  }

  useEffect(() => {
    const onLogout = () => logout()
    window.addEventListener("auth:logout", onLogout)
    return () => window.removeEventListener("auth:logout", onLogout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (username: string, password: string) => {
    await authAPI.login(username, password) // тут токены уже сохраняются
    setIsAuthed(true)
  }

  const register = async (username: string, password: string) => {
    await authAPI.register(username, password)
    // важно: не логиним здесь автоматически — это делает Register.tsx (или можно здесь, если хочешь)
  }

  const value = useMemo<AuthCtx>(
    () => ({ isAuthed, login, register, logout }),
    [isAuthed]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useAuth must be used within AuthProvider")
  return v
}
