import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import { createJob, fetchJobs } from "../lib/api";
import { useAuth } from "../context/AuthProvider";

export default function RecruiterConsole() {
  const { logout } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", location: "",
    remote: true, visa_sponsorship: true, company_id: 1,
    employment_type: "fulltime", seniority: "mid",
    salary_min: "", salary_max: "", salary_currency: "USD",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [jobs, setJobs] = useState([]);

  async function load() { try { setJobs(await fetchJobs({ sort: "posted_at:desc", page_size: 12 })); } catch {} }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setSubmitting(true);
    try {
      const payload = {
        ...form,
        remote: !!form.remote, visa_sponsorship: !!form.visa_sponsorship,
        company_id: Number(form.company_id),
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };
      await createJob(payload);
      setForm(f => ({ ...f, title:"", description:"", salary_min:"", salary_max:"" }));
      await load();
    } catch (e) {
      const s = String(e);
      if (s.includes("403")) setErr("Forbidden (need recruiter/admin role).");
      else if (s.includes("401")) setErr("Please login again.");
      else setErr("Failed to create job.");
    } finally { setSubmitting(false); }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Recruiter Console</h1>
        <button className="text-sm text-gray-600 underline" onClick={logout}>Sign out</button>
      </div>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 p-4 border rounded-2xl bg-white">
        <input className="border rounded-lg px-3 py-2" placeholder="Title"
               value={form.title} onChange={e=>setForm(f=>({ ...f, title:e.target.value }))} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Location (e.g., Remote, NYC)"
               value={form.location} onChange={e=>setForm(f=>({ ...f, location:e.target.value }))} />
        <textarea className="md:col-span-2 border rounded-lg px-3 py-2" placeholder="Description"
               value={form.description} onChange={e=>setForm(f=>({ ...f, description:e.target.value }))} />

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.remote}
                   onChange={e=>setForm(f=>({ ...f, remote:e.target.checked }))} /> Remote
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.visa_sponsorship}
                   onChange={e=>setForm(f=>({ ...f, visa_sponsorship:e.target.checked }))} /> Visa
          </label>
        </div>

        <select className="border rounded-lg px-3 py-2"
                value={form.employment_type} onChange={e=>setForm(f=>({ ...f, employment_type:e.target.value }))}>
          <option value="fulltime">fulltime</option><option value="parttime">parttime</option>
          <option value="contract">contract</option><option value="intern">intern</option>
        </select>

        <select className="border rounded-lg px-3 py-2"
                value={form.seniority} onChange={e=>setForm(f=>({ ...f, seniority:e.target.value }))}>
          <option value="junior">junior</option><option value="mid">mid</option>
          <option value="senior">senior</option><option value="lead">lead</option>
        </select>

        <input className="border rounded-lg px-3 py-2" placeholder="Salary min" type="number"
               value={form.salary_min} onChange={e=>setForm(f=>({ ...f, salary_min:e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Salary max" type="number"
               value={form.salary_max} onChange={e=>setForm(f=>({ ...f, salary_max:e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Currency"
               value={form.salary_currency} onChange={e=>setForm(f=>({ ...f, salary_currency:e.target.value }))} />
        <input className="border rounded-lg px-3 py-2" placeholder="Company ID" type="number"
               value={form.company_id} onChange={e=>setForm(f=>({ ...f, company_id:e.target.value }))} />

        {err && <p className="md:col-span-2 text-red-600">{err}</p>}
        <div className="md:col-span-2">
          <button className="bg-black text-white px-6 py-2 rounded-lg" disabled={submitting}>
            {submitting ? "Creating…" : "Create Job"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-10 mb-4">Recent Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jobs.map(j => <JobCard key={j.id} job={j} />)}
      </div>
    </Layout>
  );
}
