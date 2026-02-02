import { Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Habits from "../pages/Habits"
import Logs from "../pages/Logs"
import Triggers from "../pages/Triggers"
import Login from "../pages/Login"
import Register from "../pages/Register"
import { ProtectedRoute } from "../auth/ProtectedRoute"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <Logs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/triggers"
        element={
          <ProtectedRoute>
            <Triggers />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
