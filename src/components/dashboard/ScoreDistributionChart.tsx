import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobRole } from "../../types/job";
import { Card } from "../ui/Card";

export function ScoreDistributionChart({ jobs }: { jobs: JobRole[] }) {
  const data = [
    { range: "0-59", roles: jobs.filter((job) => job.transparencyScore < 60).length },
    { range: "60-79", roles: jobs.filter((job) => job.transparencyScore >= 60 && job.transparencyScore < 80).length },
    { range: "80-100", roles: jobs.filter((job) => job.transparencyScore >= 80).length },
  ];
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Role quality score distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="range" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="roles" fill="#0f172a" radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
