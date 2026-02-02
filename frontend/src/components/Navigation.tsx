import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "../lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/button"
import { authAPI } from "../api/api"
import { isAuthed } from "../auth/tokens"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/habits", label: "Habits" },
  { href: "/logs", label: "Daily Log" },
  { href: "/triggers", label: "Triggers" },
]

export function Navigation() {
  const { pathname } = useLocation()
  const nav = useNavigate()

  const logout = () => {
    authAPI.logout()
    nav("/login", { replace: true })
  }

  const authed = isAuthed()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-lg font-semibold text-foreground">
            HabitFlow
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {authed ? (
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          ) : null}
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
        {authed ? (
          <button
            onClick={logout}
            className="ml-auto whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Logout
          </button>
        ) : null}
      </nav>
    </header>
  )
}
