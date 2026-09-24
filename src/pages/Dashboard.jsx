import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi } from "../api";
import PageMotion from "../components/PageMotion";
import { DashboardSkeleton } from "../components/Skeleton";

const cards = [
  { key: "projects", label: "Projects" },
  { key: "services", label: "Services" },
  { key: "gallery", label: "Gallery items" },
  { key: "activeCareers", label: "Open careers" },
  { key: "unreadMessages", label: "Unread messages" },
  { key: "totalMessages", label: "Total messages" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message));
  }, []);

  if (!stats && !error) return <DashboardSkeleton />;

  return (
    <PageMotion>
      <div className="topbar">
        <h1>Dashboard</h1>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {stats ? (
        <>
          <div className="stats-grid">
            {cards.map((card, index) => (
              <motion.div
                className="stat-card"
                key={card.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -3 }}
              >
                <strong>{stats[card.key]}</strong>
                <span>{card.label}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 style={{ marginBottom: "0.75rem", color: "var(--green-900)" }}>Quick links</h2>
            <div className="actions">
              <Link className="btn btn-secondary btn-sm" to="/settings">
                Edit site settings
              </Link>
              <Link className="btn btn-secondary btn-sm" to="/projects">
                Manage projects
              </Link>
              <Link className="btn btn-secondary btn-sm" to="/messages">
                View messages
              </Link>
            </div>
          </motion.div>
        </>
      ) : null}
    </PageMotion>
  );
}
