import { Activity, BadgeDollarSign, Clock, Gauge, Sparkles, Timer } from "lucide-react";
import { JobRole } from "../types/job";
import { formatCurrency } from "../lib/utils";
import { DashboardMetricCard } from "../components/dashboard/DashboardMetricCard";
import { RemoteBreakdownChart } from "../components/dashboard/RemoteBreakdownChart";
import { ScoreDistributionChart } from "../components/dashboard/ScoreDistributionChart";
import { TopLocationsChart } from "../components/dashboard/TopLocationsChart";
import { TechStackChart } from "../components/analytics/TechStackChart";

export function Dashboard({ jobs }: { jobs: JobRole[] }) {
  const avgRate = Math.round(jobs.reduce((sum, job) => sum + (job.hourlyRateMin + job.hourlyRateMax) / 2, 0) / jobs.length);
  const avgTransparency = Math.round(jobs.reduce((sum, job) => sum + job.transparencyScore, 0) / jobs.length);
  const avgFit = Math.round(jobs.reduce((sum, job) => sum + job.aiFitScore, 0) / jobs.length);
  const today = "2026-06-04";
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-medium text-slate-500">Transparent contract tech roles across the U.S.</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Find contract roles you can apply to through Clario.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">Review roles with visible rates, clients, terms, and fit scoring before our staffing team submits you for client consideration.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardMetricCard label="Total contract roles found" value={jobs.length} helper="Across approved mock sources" icon={Activity} />
        <DashboardMetricCard label="Average hourly rate" value={`${formatCurrency(avgRate)}/hr`} helper="Visible candidate pay range" icon={BadgeDollarSign} />
        <DashboardMetricCard label="New roles added today" value={jobs.filter((job) => job.postedDate === today).length} helper="Fresh roles from current sync" icon={Sparkles} />
        <DashboardMetricCard label="Expiring soon roles" value={jobs.filter((job) => job.status === "Expiring Soon").length} helper="Prioritize before source expiry" icon={Timer} />
        <DashboardMetricCard label="Average transparency score" value={avgTransparency} helper="Rate, client, terms, source clarity" icon={Gauge} />
        <DashboardMetricCard label="Average AI fit score" value={avgFit} helper="Pay, demand, flexibility, market fit" icon={Clock} />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <ScoreDistributionChart jobs={jobs} />
        <RemoteBreakdownChart jobs={jobs} />
        <TopLocationsChart jobs={jobs} />
        <TechStackChart jobs={jobs} />
      </section>
    </div>
  );
}
