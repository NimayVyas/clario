import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobRole } from "../../types/job";
import { Card } from "../ui/Card";

export function AverageRateChart({ jobs }: { jobs: JobRole[] }) {
  const buckets = jobs.reduce<Record<string, { total: number; count: number }>>((acc, job) => {
    const key = job.title.replace(/ Engineer| Developer/g, "");
    const next = acc[key] ?? { total: 0, count: 0 };
    next.total += (job.hourlyRateMin + job.hourlyRateMax) / 2;
    next.count += 1;
    return { ...acc, [key]: next };
  }, {});
  const data = Object.entries(buckets).slice(0, 8).map(([role, value]) => ({ role, rate: Math.round(value.total / value.count) }));
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Average rate by role type</h3>
      <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="role" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="rate" fill="#0f172a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
    </Card>
  );
}
