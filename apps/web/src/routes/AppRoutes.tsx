import { Navigate, Route, Routes } from 'react-router-dom'

import DashboardLayout from '../layouts/admin/DashboardLayout'
import { AppointmentsPage } from '../modules/appointments'
import { LoginPage } from '../modules/auth'
import { DashboardPage } from '../modules/dashboard'
import { DepartmentsPage } from '../modules/departments'
import { DoctorsPage } from '../modules/doctors'
import { SchedulesPage } from '../modules/schedules'
import { UsersPage } from '../modules/users'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
      </Route>
    </Routes>
  )
}

