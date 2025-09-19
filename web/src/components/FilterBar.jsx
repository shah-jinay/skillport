import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FilterBar() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [q, setQ] = useState(params.get("q") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [remote, setRemote] = useState(params.get("remote") === "true");
  const [visa, setVisa] = useState(params.get("visa") === "true");
  const [seniority, setSeniority] = useState(params.get("seniority") || "");
  const [employmentType, setEmploymentType] = useState(params.get("employment_type") || "");
  const [salaryMin, setSalaryMin] = useState(params.get("salary_min") || "");
  const [salaryMax, setSalaryMax] = useState(params.get("salary_max") || "");
  const [sort, setSort] = useState(params.get("sort") || "posted_at:desc");

  // Build query string from state
  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (location) p.set("location", location);
    if (remote) p.set("remote", "true");
    if (visa) p.set("visa", "true");
    if (seniority) p.set("seniority", seniority);
    if (employmentType) p.set("employment_type", employmentType);
    if (salaryMin) p.set("salary_min", salaryMin);
    if (salaryMax) p.set("salary_max", salaryMax);
    if (sort) p.set("sort", sort);
    // reset page when filtering
    p.set("page", "1");
    return p.toString();
  }, [q, location, remote, visa, seniority, employmentType, salaryMin, salaryMax, sort]);

  function apply() {
    navigate(`/jobs?${queryString}`);
  }

  function resetAll() {
    setQ(""); setLocation(""); setRemote(false); setVisa(false);
    setSeniority(""); setEmploymentType(""); setSalaryMin(""); setSalaryMax("");
    setSort("posted_at:desc");
    navigate("/jobs");
  }

  // Keep UI in sync if URL changes externally
  useEffect(() => {
    setQ(params.get("q") || "");
    setLocation(params.get("location") || "");
    setRemote(params.get("remote") === "true");
    setVisa(params.get("visa") === "true");
    setSeniority(params.get("seniority") || "");
    setEmploymentType(params.get("employment_type") || "");
    setSalaryMin(params.get("salary_min") || "");
    setSalaryMax(params.get("salary_max") || "");
    setSort(params.get("sort") || "posted_at:desc");
  }, [params]);

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <div className="grid md:grid-cols-6 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (title, skills)"
          className="border rounded-lg px-3 py-2"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded-lg px-3 py-2"
        />
        <select
          value={seniority}
          onChange={(e) => setSeniority(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Seniority</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Employment</option>
          <option value="fulltime">Full-time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
        </select>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
            Remote
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={visa} onChange={(e) => setVisa(e.target.checked)} />
            Visa
          </label>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="posted_at:desc">Newest</option>
          <option value="posted_at:asc">Oldest</option>
          <option value="salary_max:desc">Salary (high → low)</option>
          <option value="salary_max:asc">Salary (low → high)</option>
        </select>
      </div>

      <div className="grid md:grid-cols-4 gap-3 mt-3">
        <input
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value.replace(/\D/g, ""))}
          placeholder="Min salary"
          className="border rounded-lg px-3 py-2"
        />
        <input
          value={salaryMax}
          onChange={(e) => setSalaryMax(e.target.value.replace(/\D/g, ""))}
          placeholder="Max salary"
          className="border rounded-lg px-3 py-2"
        />

        <button onClick={apply} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
          Apply Filters
        </button>
        <button onClick={resetAll} className="border px-4 py-2 rounded-lg">
          Reset
        </button>
      </div>
    </div>
  );
}
