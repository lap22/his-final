import { NavLink, Outlet } from 'react-router-dom'

import './DashboardLayout.css'

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/departments', label: 'Departments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/schedules', label: 'Schedules' },
  { to: '/appointments', label: 'Appointments' },
]

export function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">HIS Admin</div>
        <nav className="dashboard-nav" aria-label="Main navigation">
          {navigationItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'dashboard-nav-link active' : 'dashboard-nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

