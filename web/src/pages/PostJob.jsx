import { useState } from "react";
import { createJob, fetchCompanies } from "../lib/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../authContext";

export default function PostJob() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", location: "",
    remote: false, visa_sponsorship: true, company_id: "",
    employment_type: "", seniority: "",
    salary_min: "", salary_max: "", salary_currency: "USD",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try { setCompanies(await fetchCompanies()); } catch (_) {}
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setSaving(true);
    try {
      const payload = {
        ...form,
        company_id: form.company_id ? Number(form.company_id) : null,
        remote: Boolean(form.remote),
        visa_sponsorship: Boolean(form.visa_sponsorship),
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };
      const job = await createJob(payload);
      nav(`/jobs/${job.id}`);
    } catch (e) {
      setErr(e.message || "Failed to post job");
    } finally { setSaving(false); }
  }

  function F(k, v) { setForm(s => ({ ...s, [k]: v })); }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Post a Job</h1>
      {err && <p className="text-red-600 mb-4">{err}</p>}

      <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
        <input className="border p-2 rounded" placeholder="Title"
               value={form.title} onChange={e=>F("title", e.target.value)} required />
        <textarea className="border p-2 rounded" placeholder="Description"
                  value={form.description} onChange={e=>F("description", e.target.value)} />
        <input className="border p-2 rounded" placeholder="Location"
               value={form.location} onChange={e=>F("location", e.target.value)} />

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.remote}
                   onChange={e=>F("remote", e.target.checked)} /> Remote
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.visa_sponsorship}
                   onChange={e=>F("visa_sponsorship", e.target.checked)} /> Visa sponsor
          </label>
        </div>

        <select className="border p-2 rounded" value={form.company_id}
                onChange={e=>F("company_id", e.target.value)}>
          <option value="">— Select Company —</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Employment type (fulltime, contract)"
                 value={form.employment_type} onChange={e=>F("employment_type", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Seniority (junior, mid, senior)"
                 value={form.seniority} onChange={e=>F("seniority", e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <input className="border p-2 rounded" placeholder="Salary min" type="number"
                 value={form.salary_min} onChange={e=>F("salary_min", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Salary max" type="number"
                 value={form.salary_max} onChange={e=>F("salary_max", e.target.value)} />
          <input className="border p-2 rounded" placeholder="Currency" maxLength={3}
                 value={form.salary_currency} onChange={e=>F("salary_currency", e.target.value.toUpperCase())} />
        </div>

        <button disabled={saving}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
          {saving ? "Posting…" : "Post Job"}
        </button>
      </form>
    </Layout>
  );
}
