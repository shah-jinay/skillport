import { useEffect, useMemo, useState } from "react";

const SENIORITY = ["junior", "mid", "senior", "lead"];
const EMPLOY = ["fulltime", "parttime", "contract", "intern"];
const SORTS = [
  { v: "posted_at:desc", label: "Newest" },
  { v: "posted_at:asc", label: "Oldest" },
  { v: "salary_max:desc", label: "Highest Salary" },
  { v: "salary_max:asc", label: "Lowest Salary" },
];

export default function JobsFilterBar({ initial = {}, onChange }) {
  const [q, setQ] = useState(initial.q || "");
  const [location, setLocation] = useState(initial.location || "");
  const [remote, setRemote] = useState(initial.remote === true || initial.remote === "true");
  const [visa, setVisa] = useState(initial.visa === true || initial.visa === "true");
  const [seniority, setSeniority] = useState(initial.seniority || "");
  const [employment_type, setEmployment] = useState(initial.employment_type || "");
  const [salaryMin, setSalaryMin] = useState(initial.salary_min ? Number(initial.salary_min) : "");
  const [sort, setSort] = useState(initial.sort || "posted_at:desc");

  // Build params to send upstream
  const params = useMemo(() => {
    const p = { sort, page: 1 }; // reset to first page on change
    if (q) p.q = q;
    if (location) p.location = location;
    if (remote) p.remote = true;
    if (visa) p.visa = true;
    if (seniority) p.seniority = seniority;
    if (employment_type) p.employment_type = employment_type;
    if (salaryMin !== "" && !Number.isNaN(Number(salaryMin))) p.salary_min = Number(salaryMin);
    return p;
  }, [q, location, remote, visa, seniority, employment_type, salaryMin, sort]);

  // Emit on any change
  useEffect(() => { onChange?.(params); }, [params, onChange]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-end bg-white border rounded-xl p-3">
      <div className="flex-1">
        <label className="block text-xs text-gray-500 mb-1">Search</label>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Title, skill, company"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="w-full md:w-48">
        <label className="block text-xs text-gray-500 mb-1">Location</label>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., Remote, NYC"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
          Remote
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={visa} onChange={(e) => setVisa(e.target.checked)} />
          Visa
        </label>
      </div>

      <div className="w-full md:w-40">
        <label className="block text-xs text-gray-500 mb-1">Seniority</label>
        <select className="w-full border rounded-lg px-3 py-2"
                value={seniority} onChange={(e) => setSeniority(e.target.value)}>
          <option value="">Any</option>
          {SENIORITY.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="w-full md:w-40">
        <label className="block text-xs text-gray-500 mb-1">Type</label>
        <select className="w-full border rounded-lg px-3 py-2"
                value={employment_type} onChange={(e) => setEmployment(e.target.value)}>
          <option value="">Any</option>
          {EMPLOY.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="w-full md:w-36">
        <label className="block text-xs text-gray-500 mb-1">Salary ≥</label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="e.g., 150000"
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value)}
          min={0}
        />
      </div>

      <div className="w-full md:w-44">
        <label className="block text-xs text-gray-500 mb-1">Sort</label>
        <select className="w-full border rounded-lg px-3 py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORTS.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}
