import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/settings", label: "Site Settings" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/values", label: "Values" },
  { to: "/milestones", label: "Milestones" },
  { to: "/timeline", label: "Timeline" },
  { to: "/process-steps", label: "Process Steps" },
  { to: "/careers", label: "Careers" },
  { to: "/messages", label: "Messages" },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();

  if (loading) return <div className="loading">Loading admin…</div>;
  if (!admin) return <Navigate to="/login" replace />;

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <strong>SBRGREEN</strong>
          <span>Admin Panel</span>
        </div>
        <nav className="nav-list">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: "0.85rem", marginBottom: "0.75rem", opacity: 0.75 }}>
            Signed in as {admin.username}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={logout} style={{ width: "100%" }}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
