import { NavLink, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/validation', label: 'Validation' },
  { to: '/shift-report', label: 'Shift Report' },
  { to: '/run-status', label: 'Run Status' },
  { to: '/heat-program', label: 'Heat Program' },
  { to: '/io-status', label: 'I/O Status' },
  { to: '/alarms', label: 'Alarms & History' },
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Heat Treat IoT</h1>
        <p className="subtitle">Induction Machine Control</p>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <span>Line: INDU-01</span>
          <span>{location.pathname.replace('/', '').toUpperCase() || 'DASHBOARD'}</span>
          <span>Shift: A</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
