import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AverageRateChart } from "../components/analytics/AverageRateChart";
import { SourceQualityChart } from "../components/analytics/SourceQualityChart";
import { TechStackChart } from "../components/analytics/TechStackChart";
import { RemoteBreakdownChart } from "../components/dashboard/RemoteBreakdownChart";
import { ScoreDistributionChart } from "../components/dashboard/ScoreDistributionChart";
import { TopLocationsChart } from "../components/dashboard/TopLocationsChart";
import { Card } from "../components/ui/Card";
import { JobRole } from "../types/job";

export function Analytics({ jobs }: { jobs: JobRole[] }) {
  const contractData = Object.entries(jobs.reduce<Record<string, number>>((acc, job) => ({ ...acc, [job.contractType]: (acc[job.contractType] ?? 0) + 1 }), {})).map(([type, roles]) => ({ type, roles }));
  const duplicateData = Object.entries(jobs.reduce<Record<string, { total: number; count: number }>>((acc, job) => {
    const next = acc[job.source] ?? { total: 0, count: 0 };
    next.total += job.duplicateRiskScore;
    next.count += 1;
    return { ...acc, [job.source]: next };
  }, {})).map(([source, value]) => ({ source, risk: Math.round(value.total / value.count) }));

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-2xl font-semibold text-slate-950">Analytics</h1>
        <p className="mt-2 text-sm text-slate-600">Role supply, rate quality, source health, and duplicate risk across approved role feeds.</p>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <TopLocationsChart jobs={jobs} />
        <AverageRateChart jobs={jobs} />
        <RemoteBreakdownChart jobs={jobs} />
        <ScoreDistributionChart jobs={jobs} />
        <TechStackChart jobs={jobs} />
        <SourceQualityChart />
        <Card className="p-4"><h3 className="mb-4 text-sm font-semibold text-slate-950">Contract type breakdown</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={contractData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="type" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="roles" fill="#0f172a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card className="p-4"><h3 className="mb-4 text-sm font-semibold text-slate-950">Duplicate risk by source</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={duplicateData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="source" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="risk" fill="#475569" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
      </div>
    </div>
  );
}
