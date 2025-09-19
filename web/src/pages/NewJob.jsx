import { useState } from "react";
import { useAuth } from "../authContext";

export default function NewJob() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "", description: "", location: "Remote",
    remote: true, visa_sponsorship: true, company_id: 1
  });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });
    if (!r.ok) { setMsg("Failed to create job"); return; }
    const data = await r.json();
    setMsg(`Created: ${data.title} (#${data.id})`);
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Title"
          value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
        <textarea className="w-full border rounded p-2" placeholder="Description"
          value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
        <input className="w-full border rounded p-2" placeholder="Location"
          value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.remote}
            onChange={e=>setForm({...form, remote:e.target.checked})}/> Remote
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.visa_sponsorship}
            onChange={e=>setForm({...form, visa_sponsorship:e.target.checked})}/> Visa sponsorship
        </label>
        <input className="w-full border rounded p-2" type="number" placeholder="Company ID"
          value={form.company_id} onChange={e=>setForm({...form, company_id:Number(e.target.value)})}/>
        <button className="px-4 py-2 rounded bg-black text-white">Create</button>
      </form>
      {msg && <p className="mt-3 text-green-700">{msg}</p>}
    </div>
  );
}
