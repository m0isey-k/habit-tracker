import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useAuth } from "../auth/AuthProvider"

function isBadCredentials(message: string) {
  return message.includes("401") || message.toLowerCase().includes("no active account")
}

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const [formError, setFormError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{ username?: boolean; password?: boolean }>({})

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    setFormError(null)
    setFieldError({})

    setSubmitting(true)
    try {
      await login(username.trim(), password)
      nav("/dashboard", { replace: true })
    } catch (e2) {
      const message = e2 instanceof Error ? e2.message : "Unknown error"

      if (isBadCredentials(message)) {
        setFormError("Wrong username or password.")
        setFieldError({ username: true, password: true })
      } else if (message.includes("API 400")) {
        setFormError("Please check the fields and try again.")
      } else {
        setFormError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Access your habits and logs.</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card/60 p-6">
        {formError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
            {formError}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="u">Username</Label>
          <Input
            id="u"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setFormError(null)
              setFieldError((p) => ({ ...p, username: false }))
            }}
            className={fieldError.username ? "border-destructive focus-visible:ring-destructive/40" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="p">Password</Label>
          <Input
            id="p"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setFormError(null)
              setFieldError((p) => ({ ...p, password: false }))
            }}
            className={fieldError.password ? "border-destructive focus-visible:ring-destructive/40" : ""}
            required
          />
        </div>

        <Button className="w-full" type="submit" disabled={submitting}>
          Log in
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        No account?{" "}
        <Link to="/register" className="text-foreground underline underline-offset-4">
          Register
        </Link>
      </p>
    </div>
  )
}
