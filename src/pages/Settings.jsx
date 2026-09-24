import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../api";
import PageMotion from "../components/PageMotion";
import { SettingsSkeleton } from "../components/Skeleton";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi
      .getSettings()
      .then((res) => setForm({ ...empty, ...res.data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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

  if (loading) return <SettingsSkeleton />;

  return (
    <PageMotion>
      <div className="topbar">
        <h1>Site Settings</h1>
      </div>
      <motion.form
        className="card form-grid"
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {error ? <div className="error-banner">{error}</div> : null}
        {success ? <div className="success-banner">{success}</div> : null}
        <div className="form-grid two">
          <div className="field">
            <label>Company name</label>
            <input
              name="companyName"
              value={form.companyName}
              onChange={onChange}
              required
              placeholder="SBRGREEN CONSTRUCTION PRIVATE LIMITED"
            />
          </div>
          <div className="field">
            <label>Short name</label>
            <input
              name="shortName"
              value={form.shortName}
              onChange={onChange}
              required
              placeholder="SBRGREEN"
            />
          </div>
        </div>
        <div className="field">
          <label>Tagline</label>
          <input
            name="tagline"
            value={form.tagline}
            onChange={onChange}
            required
            placeholder="Building lasting structures. Growing greener futures."
          />
        </div>
        <div className="form-grid two">
          <div className="field">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              required
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder="info@sbrgreen.com"
            />
          </div>
        </div>
        <div className="field">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            required
            rows={3}
            placeholder="Full company address"
          />
        </div>
        <div className="field">
          <label>Business hours</label>
          <input
            name="hours"
            value={form.hours}
            onChange={onChange}
            required
            placeholder="Mon – Sat: 9:00 AM – 6:00 PM"
          />
        </div>
        <div className="form-grid two">
          <div className="field">
            <label>Hero image URL</label>
            <input
              name="heroImage"
              value={form.heroImage || ""}
              onChange={onChange}
              placeholder="https://example.com/hero.jpg"
            />
          </div>
          <div className="field">
            <label>About image URL</label>
            <input
              name="aboutImage"
              value={form.aboutImage || ""}
              onChange={onChange}
              placeholder="https://example.com/about.jpg"
            />
          </div>
        </div>
        <div className="field">
          <label>CTA image URL</label>
          <input
            name="ctaImage"
            value={form.ctaImage || ""}
            onChange={onChange}
            placeholder="https://example.com/cta.jpg"
          />
        </div>
        <div className="field">
          <label>About story (paragraph 1)</label>
          <textarea
            name="aboutStory1"
            value={form.aboutStory1 || ""}
            onChange={onChange}
            rows={4}
            placeholder="First about-us paragraph"
          />
        </div>
        <div className="field">
          <label>About story (paragraph 2)</label>
          <textarea
            name="aboutStory2"
            value={form.aboutStory2 || ""}
            onChange={onChange}
            rows={4}
            placeholder="Second about-us paragraph"
          />
        </div>
        <div className="field">
          <label>Careers intro</label>
          <textarea
            name="careersIntro"
            value={form.careersIntro || ""}
            onChange={onChange}
            rows={3}
            placeholder="Intro text for the careers page"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy} style={{ width: "auto" }}>
          {busy ? "Saving…" : "Save Settings"}
        </button>
      </motion.form>
    </PageMotion>
  );
}
