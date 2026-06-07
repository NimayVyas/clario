import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { JobRole } from "../../types/job";
import { Card } from "../ui/Card";

const colors = ["#0f172a", "#64748b", "#cbd5e1"];

export function RemoteBreakdownChart({ jobs }: { jobs: JobRole[] }) {
  const data = ["Remote", "Hybrid", "Onsite"].map((name) => ({ name, value: jobs.filter((job) => job.remoteType === name).length }));
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Remote / hybrid / onsite breakdown</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88}>{data.map((entry, index) => <Cell key={entry.name} fill={colors[index]} />)}</Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
