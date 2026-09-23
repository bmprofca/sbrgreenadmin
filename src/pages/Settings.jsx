import { useEffect, useState } from "react";
import { adminApi } from "../api";

const empty = {
  companyName: "",
  shortName: "",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  heroImage: "",
  aboutImage: "",
  ctaImage: "",
  aboutStory1: "",
  aboutStory2: "",
  careersIntro: "",
};

export default function Settings() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch((err) => setError(err.message));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const res = await adminApi.updateSettings(form);
      setForm({ ...empty, ...res.data });
      setSuccess("Settings saved to database.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <h1>Site Settings</h1>
      </div>
      <form className="card form-grid" onSubmit={onSubmit}>
        {error ? <div className="error-banner">{error}</div> : null}
        {success ? <div className="success-banner">{success}</div> : null}
        <div className="form-grid two">
          <div className="field">
            <label>Company name</label>
            <input name="companyName" value={form.companyName} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Short name</label>
            <input name="shortName" value={form.shortName} onChange={onChange} required />
          </div>
        </div>
        <div className="field">
          <label>Tagline</label>
          <input name="tagline" value={form.tagline} onChange={onChange} required />
        </div>
        <div className="form-grid two">
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={onChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <textarea name="address" value={form.address} onChange={onChange} required rows={3} />
        </div>
        <div className="field">
          <label>Business hours</label>
          <input name="hours" value={form.hours} onChange={onChange} required />
        </div>
        <div className="form-grid two">
          <div className="field">
            <label>Hero image URL</label>
            <input name="heroImage" value={form.heroImage || ""} onChange={onChange} />
          </div>
          <div className="field">
            <label>About image URL</label>
            <input name="aboutImage" value={form.aboutImage || ""} onChange={onChange} />
          </div>
        </div>
        <div className="field">
          <label>CTA image URL</label>
          <input name="ctaImage" value={form.ctaImage || ""} onChange={onChange} />
        </div>
        <div className="field">
          <label>About story (paragraph 1)</label>
          <textarea name="aboutStory1" value={form.aboutStory1 || ""} onChange={onChange} rows={4} />
        </div>
        <div className="field">
          <label>About story (paragraph 2)</label>
          <textarea name="aboutStory2" value={form.aboutStory2 || ""} onChange={onChange} rows={4} />
        </div>
        <div className="field">
          <label>Careers intro</label>
          <textarea name="careersIntro" value={form.careersIntro || ""} onChange={onChange} rows={3} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy} style={{ width: "auto" }}>
          {busy ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </>
  );
}
