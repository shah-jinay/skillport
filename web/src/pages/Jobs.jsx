import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { JobCard } from "../components/JobCard";
import JobsFilterBar from "../components/JobsFilterBar";
import { fetchJobs } from "../lib/api";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(params.get("page") || 1);
  const page_size = Number(params.get("page_size") || 12);

  // current filters from URL (so refresh/shareable)
  const initial = useMemo(() => {
    const o = Object.fromEntries(params.entries());
    if (!o.sort) o.sort = "posted_at:desc";
    return o;
  }, [params]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await fetchJobs(Object.fromEntries(params.entries()));
      setJobs(data);
    } catch (e) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { load(); }, [load]);

  // When filter changes -> update URL params
  function handleFilterChange(next) {
    const merged = { ...Object.fromEntries(params.entries()), ...next };
    // remove empty keys for clean URLs
    for (const k of Object.keys(merged)) {
      if (merged[k] === "" || merged[k] === undefined || merged[k] === false) delete merged[k];
    }
    setParams(merged, { replace: true });
  }

  function gotoPage(p) {
    const merged = { ...Object.fromEntries(params.entries()), page: p };
    setParams(merged, { replace: true });
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      <JobsFilterBar initial={initial} onChange={handleFilterChange} />

      <div className="mt-6">
        {error && <p className="text-red-600">{error}</p>}
        {loading ? (
          <p className="text-gray-500">Loading jobs…</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No jobs match your filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jobs.map(j => <JobCard key={j.id} job={j} />)}
            </div>

            {/* simple pager */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => gotoPage(page - 1)}
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">Page {page}</span>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => gotoPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
