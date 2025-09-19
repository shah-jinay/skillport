import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import { TopLocationsChart } from "../components/TopLocationsChart";
import { fetchJobs } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";
import VisaByCompanyChart from "../components/VisaByCompanyChart";

export default function Home() {
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchJobs({ sort: "posted_at:desc", page: 1, page_size: 6 });
        if (!cancelled) setLatestJobs(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load latest jobs. Please retry.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold tracking-tight">Find Visa-Friendly Tech Jobs</h1>
        <p className="mt-4 text-gray-600">
          Search tech roles from companies that support international talent.
        </p>

        <form onSubmit={onSubmit} className="mt-8 max-w-lg mx-auto flex" role="search" aria-label="Job search">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
            placeholder="Search by title, skill, or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search jobs"
          />
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-r-lg hover:bg-gray-800 transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Analytics Section */}
      <section className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Where jobs are growing</h2>
        <TopLocationsChart />
      </section>

      {/* Latest Jobs Section */}
      <section className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Latest Jobs</h2>
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline">
            View all jobs →
          </Link>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border p-4">
                <div className="h-6 w-3/5 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-2/5 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-4/5 bg-gray-200 rounded mb-4" />
                <div className="h-8 w-full bg-gray-200 rounded" />
            </div>
            ))}
        </div>
        ) : latestJobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
      <VisaByCompanyChart />

    </Layout>
  );
}
