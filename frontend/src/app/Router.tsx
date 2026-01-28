import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Habits from "../pages/Habits"
import Logs from "../pages/Logs"
import Triggers from "../pages/Triggers"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/habits" element={<Habits />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/triggers" element={<Triggers />} />
    </Routes>
  )
}
