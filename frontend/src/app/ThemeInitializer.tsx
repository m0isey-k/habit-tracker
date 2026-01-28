import { useEffect } from "react"

export default function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const isDark = saved ? saved === "dark" : true
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  return null
}
