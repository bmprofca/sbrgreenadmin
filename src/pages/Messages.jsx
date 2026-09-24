import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import PageMotion from "../components/PageMotion";
import { TableSkeleton } from "../components/Skeleton";

export default function Messages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.messages();
      setItems(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await adminApi.markRead(id);
    load();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteMessage(deleteId);
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <TableSkeleton rows={5} cols={5} />;

  return (
    <PageMotion>
      <div className="topbar">
        <h1>Contact Messages</h1>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      <motion.div
        className="card table-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!items.length ? (
          <div className="empty">No messages yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Service</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                      {item.email}
                      {item.phone ? ` · ${item.phone}` : ""}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </div>
                  </td>
                  <td>{item.service || "—"}</td>
                  <td>
                    <div className="message-body">{item.message}</div>
                  </td>
                  <td>
                    <span className={`badge ${item.isRead ? "badge-off" : "badge-on"}`}>
                      {item.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="actions">
                    {!item.isRead ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => markRead(item.id)}
                      >
                        Mark read
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this message?"
        message="This inquiry will be permanently removed from the database."
        confirmLabel="Delete"
        danger
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </PageMotion>
  );
}
