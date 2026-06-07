import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobRole } from "../../types/job";
import { Card } from "../ui/Card";

export function TopLocationsChart({ jobs }: { jobs: JobRole[] }) {
  const data = Object.entries(jobs.reduce<Record<string, number>>((acc, job) => ({ ...acc, [job.location]: (acc[job.location] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([location, roles]) => ({ location, roles }));
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Top hiring locations</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 28 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="location" type="category" width={110} /><Tooltip /><Bar dataKey="roles" fill="#334155" radius={[0, 4, 4, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
