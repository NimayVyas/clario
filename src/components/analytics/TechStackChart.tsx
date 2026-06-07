import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobRole } from "../../types/job";
import { Card } from "../ui/Card";

export function TechStackChart({ jobs }: { jobs: JobRole[] }) {
  const data = Object.entries(jobs.flatMap((job) => job.techStack).reduce<Record<string, number>>((acc, skill) => ({ ...acc, [skill]: (acc[skill] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, roles]) => ({ skill, roles }));
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Top tech stacks</h3>
      <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 10 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="skill" type="category" width={90} /><Tooltip /><Bar dataKey="roles" fill="#475569" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div>
    </Card>
  );
}
