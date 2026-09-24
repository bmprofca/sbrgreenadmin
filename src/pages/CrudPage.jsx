import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { adminApi } from "../api";
import ConfirmModal from "../components/ConfirmModal";
import PageMotion from "../components/PageMotion";
import { TableSkeleton } from "../components/Skeleton";

export default function CrudPage({ config }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(config.empty);
  const [busy, setBusy] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.list(config.resource);
      setItems(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
    setSuccess("");
    setOpen(false);
    setEditing(null);
    setForm(config.empty);
    setDeleteId(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.resource]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...config.empty });
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...config.empty, ...item });
    setOpen(true);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (editing) {
        await adminApi.update(config.resource, editing.id, form);
        setSuccess("Updated successfully.");
      } else {
        await adminApi.create(config.resource, form);
        setSuccess("Created successfully.");
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.remove(config.resource, deleteId);
      setSuccess("Deleted successfully.");
      setDeleteId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <TableSkeleton
        rows={6}
        cols={config.columns.length + 2}
        withImage={Boolean(config.imageKey)}
      />
    );
  }

  return (
    <PageMotion>
      <div className="topbar">
        <h1>{config.title}</h1>
        <motion.button
          type="button"
          className="btn btn-primary"
          style={{ width: "auto" }}
          onClick={openCreate}
          whileTap={{ scale: 0.97 }}
        >
          Add New
        </motion.button>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {success ? <div className="success-banner">{success}</div> : null}
      <motion.div
        className="card table-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        {!items.length ? (
          <div className="empty">No records yet. Add the first one.</div>
        ) : (
          <table>
            <thead>
              <tr>
                {config.imageKey ? <th>Image</th> : null}
                {config.columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Active</th>
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
                  {config.imageKey ? (
                    <td>
                      <img
                        className="thumb"
                        src={item[config.imageKey] || item.image || item.src}
                        alt=""
                      />
                    </td>
                  ) : null}
                  {config.columns.map((col) => (
                    <td key={col.key}>
                      {String(item[col.key] ?? "").length > 90
                        ? `${String(item[col.key]).slice(0, 90)}…`
                        : item[col.key]}
                    </td>
                  ))}
                  <td>
                    <span className={`badge ${item.isActive ? "badge-on" : "badge-off"}`}>
                      {item.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </button>
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

      <AnimatePresence>
        {open ? (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.form
              className="modal form-grid"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={onSubmit}
            >
              <h2>{editing ? `Edit ${config.title}` : `Add ${config.title}`}</h2>
              {config.fields.map((field) => (
                <div className="field" key={field.name}>
                  {field.type === "checkbox" ? (
                    <label>
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={Boolean(form[field.name])}
                        onChange={onChange}
                      />{" "}
                      {field.label}
                    </label>
                  ) : field.type === "textarea" ? (
                    <>
                      <label>{field.label}</label>
                      <textarea
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={onChange}
                        required={field.required}
                        rows={4}
                        placeholder={field.placeholder}
                      />
                    </>
                  ) : field.type === "select" ? (
                    <>
                      <label>{field.label}</label>
                      <select
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={onChange}
                        required={field.required}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <label>{field.label}</label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        value={form[field.name] ?? ""}
                        onChange={onChange}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    </>
                  )}
                </div>
              ))}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "auto" }}
                  disabled={busy}
                >
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete this item?"
        message="This action cannot be undone. The record will be permanently removed."
        confirmLabel="Delete"
        danger
        busy={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </PageMotion>
  );
}
