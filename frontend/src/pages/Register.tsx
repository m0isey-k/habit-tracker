import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../auth/AuthProvider"

function parseApiError(e: unknown): string {
  if (e instanceof Error) return e.message
  return "Unknown error"
}

export default function Register() {
  const { register, login } = useAuth()
  const nav = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [fieldError, setFieldError] = useState<{ username?: string; password?: string; form?: string }>({})

  const passwordTooShort = useMemo(() => password.length > 0 && password.length < 6, [password])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const nextErrors: typeof fieldError = {}
    if (!username.trim()) nextErrors.username = "Username is required"
    if (!password) nextErrors.password = "Password is required"
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters"

    setFieldError(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSubmitting(true)
    try {
      await register(username.trim(), password)
      await login(username.trim(), password)
      nav("/dashboard", { replace: true })
    } catch (e2) {
      const msg = parseApiError(e2)

      if (msg.includes("username") && msg.toLowerCase().includes("exists")) {
        setFieldError({ username: "Username already exists" })
      } else if (msg.toLowerCase().includes("password") && msg.toLowerCase().includes("short")) {
        setFieldError({ password: "Password is too short" })
      } else if (msg.includes("API 400")) {
        setFieldError({ form: "Please check the fields and try again." })
      } else {
        setFieldError({ form: msg })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Register</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create an account to track your habits.</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card/60 p-6">
        {fieldError.form ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
            {fieldError.form}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="u">Username</Label>
          <Input
            id="u"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setFieldError((p) => ({ ...p, username: undefined, form: undefined }))
            }}
            className={fieldError.username ? "border-destructive focus-visible:ring-destructive/40" : ""}
            required
          />
          {fieldError.username ? <p className="text-xs text-destructive">{fieldError.username}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="p">Password</Label>
          <Input
            id="p"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setFieldError((p) => ({ ...p, password: undefined, form: undefined }))
            }}
            className={
              fieldError.password || passwordTooShort
                ? "border-destructive focus-visible:ring-destructive/40"
                : ""
            }
            required
          />
          {fieldError.password ? (
            <p className="text-xs text-destructive">{fieldError.password}</p>
          ) : passwordTooShort ? (
            <p className="text-xs text-destructive">Password must be at least 6 characters</p>
          ) : (
            <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={submitting}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-foreground underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  )
}
