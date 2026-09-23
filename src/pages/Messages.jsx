import { useEffect, useState } from "react";
import { adminApi } from "../api";

export default function Messages() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const load = () =>
    adminApi
      .messages()
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await adminApi.markRead(id);
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    await adminApi.deleteMessage(id);
    load();
  };

  return (
    <>
      <div className="topbar">
        <h1>Contact Messages</h1>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      <div className="card table-wrap">
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
              {items.map((item) => (
                <tr key={item.id}>
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
                  <td><div className="message-body">{item.message}</div></td>
                  <td>
                    <span className={`badge ${item.isRead ? "badge-off" : "badge-on"}`}>
                      {item.isRead ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="actions">
                    {!item.isRead ? (
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => markRead(item.id)}>
                        Mark read
                      </button>
                    ) : null}
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
