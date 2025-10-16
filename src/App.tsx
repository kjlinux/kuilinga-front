import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import PrivateRoute from "./components/PrivateRoute"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Attendance from "./pages/Attendance"
import Reports from "./pages/Reports"
import Employees from "./pages/Employees"
import Settings from "./pages/Settings"
import NotFound from "./pages/NotFound"
import Organizations from "./pages/Organizations"
import Sites from "./pages/Sites"
import Departments from "./pages/Departments"
import Devices from "./pages/Devices"
import Leaves from "./pages/Leaves"

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/leaves" element={<Leaves />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
