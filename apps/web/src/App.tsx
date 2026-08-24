import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

// import AdminLayout from './layouts/AdminLayout';

// import LoginPage from './modules/auth/LoginPage';
// import DashboardPage from './modules/dashboard/DashboardPage';
// import UsersPage from './modules/users/UsersPage';
// import DepartmentsPage from './modules/departments/DepartmentsPage';
// import DoctorsPage from './modules/doctors/DoctorsPage';
// import SchedulesPage from './modules/schedules/SchedulesPage';
// import AppointmentsPage from './modules/appointments/AppointmentsPage';

import ProtectedRoute from './routes/ProtectedRoute';
import { LoginPage } from './modules/auth';
import AdminLayout from './layouts/admin/DashboardLayout';
import { DashboardPage } from './modules/dashboard';
import { UsersPage } from './modules/users';
import { DepartmentsPage } from './modules/departments';
import { DoctorsPage } from './modules/doctors';
import { SchedulesPage } from './modules/schedules';
import { AppointmentsPage } from './modules/appointments';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to="dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="users"
              element={<UsersPage />}
            />

            <Route
              path="departments"
              element={<DepartmentsPage />}
            />

            <Route
              path="doctors"
              element={<DoctorsPage />}
            />

            <Route
              path="schedules"
              element={<SchedulesPage />}
            />

            <Route
              path="appointments"
              element={<AppointmentsPage />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}