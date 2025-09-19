import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function VisaByCompanyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stats/visa/by-company");
        if (!res.ok) throw new Error("Failed to load stats");
        const rows = await res.json();
        if (!cancelled) setData(rows);
      } catch (e) {
        if (!cancelled) setData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="p-4 border rounded-xl bg-white">Loading visa filings…</div>;
  if (!data.length) return <div className="p-4 border rounded-xl bg-white">No visa filings yet.</div>;

  return (
    <div className="p-4 border rounded-xl bg-white">
      <h3 className="font-semibold mb-2">Visa Filings by Company</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="company" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" stackId="a" name="Approved" />
            <Bar dataKey="denied" stackId="a" name="Denied" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
