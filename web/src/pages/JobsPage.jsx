// web/src/pages/JobsPage.jsx
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import { fetchJobs } from "../lib/api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState("");
  const [visa, setVisa] = useState("");
  const [sort, setSort] = useState("posted_at:desc");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchJobs({ q, location, remote, visa, sort, page, page_size: 12 });
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [q, location, remote, visa, sort, page]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Jobs</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Search title/description"
               value={q} onChange={e=>setQ(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Location"
               value={location} onChange={e=>setLocation(e.target.value)} />
        <select className="border rounded px-3 py-2" value={remote} onChange={e=>setRemote(e.target.value)}>
          <option value="">Remote/Onsite</option>
          <option value="true">Remote</option>
          <option value="false">Onsite</option>
        </select>
        <select className="border rounded px-3 py-2" value={visa} onChange={e=>setVisa(e.target.value)}>
          <option value="">Visa: Any</option>
          <option value="true">Visa: Yes</option>
          <option value="false">Visa: No</option>
        </select>
        <select className="border rounded px-3 py-2" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="posted_at:desc">Newest</option>
          <option value="posted_at:asc">Oldest</option>
          <option value="salary_max:desc">Highest Salary</option>
          <option value="salary_max:asc">Lowest Salary</option>
        </select>
      </div>

      {loading ? <p className="mt-8 text-sm text-center">Loading…</p> :
        jobs.length === 0 ? <p className="mt-8 text-sm text-center">No jobs match your filters.</p> :
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {jobs.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      }

      <div className="mt-8 flex justify-center gap-3">
        <button className="px-3 py-2 border rounded" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
        <span className="px-3 py-2">Page {page}</span>
        <button className="px-3 py-2 border rounded" onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </Layout>
  );
}
