import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchJobsByLocation } from "../lib/api";

export function TopLocationsChart() {
  const [data, setData] = useState([]);
  useEffect(() => { fetchJobsByLocation().then(setData); }, []);
  return (
    <div className="p-4 border rounded-xl bg-white">
      <h3 className="font-semibold mb-2">Top Locations</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="location" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
