import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import FilterBar from "../components/FilterBar";
import { fetchJobs, fetchJobsCount } from "../lib/api";

export default function JobsPage() {
  const [params] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const page = parseInt(params.get("page") || "1", 10);
  const pageSize = 12;

  const query = Object.fromEntries(params.entries());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [data, cnt] = await Promise.all([
          fetchJobs({ ...query, page, page_size: pageSize }),
          fetchJobsCount(query),
        ]);
        if (!cancelled) {
          setJobs(data);
          setTotal(cnt.total);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [params]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const makePageLink = (p) => {
    const q = new URLSearchParams({ ...query, page: String(p) }).toString();
    return `/jobs?${q}`;
  };

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Jobs</h1>
      <FilterBar />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border p-4">
              <div className="h-6 w-3/5 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-2/5 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-4/5 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <p className="mt-6 text-gray-600">No results.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {jobs.map((j) => (
              <Link key={j.id} to={`/jobs/${j.id}`} className="block">
                <JobCard job={j} />
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <Link to={makePageLink(Math.max(1, page - 1))} className="px-3 py-1 border rounded">
              Prev
            </Link>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Link to={makePageLink(Math.min(totalPages, page + 1))} className="px-3 py-1 border rounded">
              Next
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}
