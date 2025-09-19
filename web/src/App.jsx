import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { JobCard } from "./components/JobCard";
import { fetchJobs } from "./lib/api";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchJobs({ search: q })
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center">Find Visa-Friendly Tech Jobs</h1>

      <div className="mt-6 max-w-3xl mx-auto flex gap-3">
        <input
          className="flex-1 border rounded-xl px-4 py-3"
          placeholder="Search job titles (e.g., Backend)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="mt-10 text-center text-sm">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      )}
    </Layout>
  );
}
