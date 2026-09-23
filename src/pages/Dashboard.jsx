import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div className="topbar">
        <h1>Dashboard</h1>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {!stats ? (
        <div className="loading">Loading stats…</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card"><strong>{stats.projects}</strong><span>Projects</span></div>
            <div className="stat-card"><strong>{stats.services}</strong><span>Services</span></div>
            <div className="stat-card"><strong>{stats.gallery}</strong><span>Gallery items</span></div>
            <div className="stat-card"><strong>{stats.activeCareers}</strong><span>Open careers</span></div>
            <div className="stat-card"><strong>{stats.unreadMessages}</strong><span>Unread messages</span></div>
            <div className="stat-card"><strong>{stats.totalMessages}</strong><span>Total messages</span></div>
          </div>
          <div className="card">
            <h2 style={{ marginBottom: "0.75rem", color: "var(--green-900)" }}>Quick links</h2>
            <div className="actions">
              <Link className="btn btn-secondary btn-sm" to="/settings">Edit site settings</Link>
              <Link className="btn btn-secondary btn-sm" to="/projects">Manage projects</Link>
              <Link className="btn btn-secondary btn-sm" to="/messages">View messages</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
