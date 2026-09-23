import { useEffect, useState } from "react";
import { adminApi } from "../api";

export default function CrudPage({ config }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(config.empty);
  const [busy, setBusy] = useState(false);

  const load = () =>
    adminApi
      .list(config.resource)
      .then((res) => setItems(res.data))
      .catch((err) => setError(err.message));

  useEffect(() => {
    setError("");
    setSuccess("");
    setOpen(false);
    setEditing(null);
    setForm(config.empty);
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

  const onDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await adminApi.remove(config.resource, id);
      setSuccess("Deleted successfully.");
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="topbar">
        <h1>{config.title}</h1>
        <button type="button" className="btn btn-primary" style={{ width: "auto" }} onClick={openCreate}>
          Add New
        </button>
      </div>
      {error ? <div className="error-banner">{error}</div> : null}
      {success ? <div className="success-banner">{success}</div> : null}
      <div className="card table-wrap">
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
              {items.map((item) => (
                <tr key={item.id}>
                  {config.imageKey ? (
                    <td>
                      <img className="thumb" src={item[config.imageKey] || item.image || item.src} alt="" />
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
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open ? (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <form
            className="modal form-grid"
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
                    />
                  </>
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ width: "auto" }} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
