import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { fetchJob } from "../lib/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setErr("");
      try {
        const data = await fetchJob(id);
        if (!cancelled) setJob(data);
      } catch (e) {
        if (!cancelled) setErr("Failed to load job.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return (
    <Layout>
      {loading ? (
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-6" />
          <div className="h-40 w-full bg-gray-200 rounded" />
        </div>
      ) : err ? (
        <p className="text-center text-red-600">{err}</p>
      ) : !job ? (
        <p className="text-center text-gray-600">Job not found.</p>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline">← Back to jobs</Link>

          <h1 className="mt-4 text-3xl font-semibold">{job.title}</h1>
          <p className="mt-2 text-gray-700">
            {job.company?.name} • {job.location || "Location N/A"} • {job.remote ? "Remote" : "On-site"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.visa_sponsorship && (
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Visa Sponsorship</span>
            )}
            {job.employment_type && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{job.employment_type}</span>
            )}
            {job.seniority && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{job.seniority}</span>
            )}
            {(job.salary_min || job.salary_max) && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {job.salary_currency || "USD"} {job.salary_min ?? "?"} – {job.salary_max ?? "?"}
              </span>
            )}
          </div>

          <div className="mt-8 prose max-w-none">
            <h2>Description</h2>
            <p className="whitespace-pre-wrap">{job.description || "No description provided."}</p>
          </div>

          {job.company?.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-block bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Apply / Company Careers
            </a>
          )}
        </div>
      )}
    </Layout>
  );
}
