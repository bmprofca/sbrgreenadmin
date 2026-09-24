import { useEffect, useState } from "react";
import { NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth";
import ConfirmModal from "./ConfirmModal";
import { LayoutSkeleton } from "./Skeleton";

const links = [
  { to: "/", label: "Dashboard", short: "DB", end: true },
  { to: "/settings", label: "Site Settings", short: "SS" },
  { to: "/services", label: "Services", short: "SV" },
  { to: "/projects", label: "Projects", short: "PR" },
  { to: "/gallery", label: "Gallery", short: "GL" },
  { to: "/testimonials", label: "Testimonials", short: "TM" },
  { to: "/values", label: "Values", short: "VL" },
  { to: "/milestones", label: "Milestones", short: "MS" },
  { to: "/timeline", label: "Timeline", short: "TL" },
  { to: "/process-steps", label: "Process Steps", short: "PS" },
  { to: "/careers", label: "Careers", short: "CR" },
  { to: "/founders", label: "Founders", short: "FD" },
  { to: "/messages", label: "Messages", short: "MG" },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sbrgreen_sidebar_collapsed") === "1";
  });
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    localStorage.setItem("sbrgreen_sidebar_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  if (loading) return <LayoutSkeleton />;
  if (!admin) return <Navigate to="/login" replace />;

  const pageTitle =
    links.find((l) => (l.end ? location.pathname === "/" : location.pathname.startsWith(l.to)))
      ?.label || "Admin";

  return (
    <div className={`admin-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <header className="top-navbar">
        <div className="top-navbar-left">
          <button
            type="button"
            className="icon-btn"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
          >
            <span className="burger">
              <i />
              <i />
              <i />
            </span>
          </button>
          <div className="top-brand">
            <strong>SBRGREEN</strong>
            <span>Admin Panel</span>
          </div>
        </div>
        <div className="top-navbar-center">
          <motion.span
            key={pageTitle}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="top-page-title"
          >
            {pageTitle}
          </motion.span>
        </div>
        <div className="top-navbar-right">
          <div className="user-chip">
            <span className="user-avatar">{(admin.username || "A").slice(0, 1).toUpperCase()}</span>
            <div className="user-meta">
              <strong>{admin.username}</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setConfirmLogout(true)}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        <aside className="sidebar">
          <div className="sidebar-scroll">
            <nav className="nav-list">
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <NavLink
                    to={link.to}
                    end={link.end}
                    title={link.label}
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                  >
                    <span className="nav-short">{link.short}</span>
                    <AnimatePresence initial={false}>
                      {!collapsed ? (
                        <motion.span
                          className="nav-label"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                        >
                          {link.label}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setCollapsed((v) => !v)}
            >
              {collapsed ? "»" : "« Collapse"}
            </button>
          </div>
        </aside>

        <main className="main">
          <div className="main-scroll">
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </div>
        </main>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Sign out?"
        message="You will need to sign in again to manage website content."
        confirmLabel="Logout"
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
        }}
      />
    </div>
  );
}
