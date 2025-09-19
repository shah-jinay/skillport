import { useEffect, useState } from "react";
import { logVisit } from "./lib/api";
import { Layout } from "./components/Layout";
import { JobCard } from "./components/JobCard";

export default function App() {
  const [health, setHealth] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // 1) Health check
    fetch("http://localhost:8000/health")
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(data => setHealth(data))
      .catch(e => {
        console.error("Health check failed:", e);
        setErr(e.message);
        setHealth({ ok: false });
      });

    // 2) Log ONE visit (remove your direct POST to avoid duplicates)
    logVisit(window.location.pathname);
  }, []);

  const sampleJob = {
    title: "Backend Engineer",
    company: "Acme Inc",
    location: "Remote",
    remote: true,
    visa_confidence: "High",
    tech_tags: ["Python", "FastAPI", "Postgres"],
    source_url: "#",
  };

  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center">
        Find Visa-Friendly Tech Jobs
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <JobCard job={sampleJob} />
        <JobCard job={{ ...sampleJob, company: "Globex", visa_confidence: "Medium" }} />
        <JobCard job={{ ...sampleJob, company: "Initech", visa_confidence: "Low" }} />
      </div>

      <p className="mt-10 text-center text-sm">
        API Health: {JSON.stringify(health)}
        {err && <span className="text-red-600">, error: {err}</span>}
      </p>
    </Layout>
  );
}
