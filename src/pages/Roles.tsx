import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Heart, Send } from "lucide-react";
import { ApplicationModal } from "../components/roles/ApplicationModal";
import { JobCard } from "../components/roles/JobCard";
import { JobDetailDrawer } from "../components/roles/JobDetailDrawer";
import { JobFilters } from "../components/roles/JobFilters";
import { JobRole, RoleFilters } from "../types/job";
import { Card } from "../components/ui/Card";

export function Roles({ jobs, search, onVisibleJobsChange }: { jobs: JobRole[]; search: string; onVisibleJobsChange: (jobs: JobRole[]) => void }) {
  const [filters, setFilters] = useState<RoleFilters>({});
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobRole | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const visibleJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesGlobal = !query || [job.title, job.company, job.vendor, job.location, ...job.techStack].some((value) => value.toLowerCase().includes(query));
      return matchesGlobal;
    });
  }, [jobs, search]);

  const filteredJobs = useMemo(() => visibleJobs.filter((job) => {
    const matchesRemote = !filters.remoteType || filters.remoteType === "All" || job.remoteType === filters.remoteType;
    const matchesRate = !filters.minRate || job.hourlyRateMax >= filters.minRate;
    const matchesTech = !filters.techStack || filters.techStack === "All" || job.techStack.includes(filters.techStack);
    const matchesState = !filters.state || filters.state === "All" || job.state === filters.state;
    const matchesSource = !filters.source || filters.source === "All" || job.source === filters.source;
    const matchesContract = !filters.contractType || filters.contractType === "All" || job.contractType === filters.contractType;
    return matchesRemote && matchesRate && matchesTech && matchesState && matchesSource && matchesContract;
  }), [visibleJobs, filters]);

  useEffect(() => {
    onVisibleJobsChange(filteredJobs);
  }, [filteredJobs, onVisibleJobsChange]);

  const options = useMemo(() => ({
    states: [...new Set(jobs.map((job) => job.state))].sort(),
    sources: [...new Set(jobs.map((job) => job.source))].sort(),
    techStacks: [...new Set(jobs.flatMap((job) => job.techStack))].sort(),
  }), [jobs]);

  const toggleSaved = (job: JobRole) => {
    setSavedJobIds((current) => current.includes(job.id) ? current.filter((id) => id !== job.id) : [...current, job.id]);
  };

  const submitApplication = (job: JobRole) => {
    setAppliedJobIds((current) => current.includes(job.id) ? current : [...current, job.id]);
    setApplyingJob(null);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Transparent contract tech roles across the U.S.</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Apply to Clario-staffed contract roles.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">See the client, rate, work model, contract terms, and match score before you apply. No hidden client. No vague rate. No black-box staffing.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Recommended</p><p className="mt-1 text-xl font-semibold">{filteredJobs.length}</p></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Saved</p><p className="mt-1 text-xl font-semibold">{savedJobIds.length}</p></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Applied</p><p className="mt-1 text-xl font-semibold">{appliedJobIds.length}</p></Card>
          </div>
        </div>
      </section>
      <JobFilters filters={filters} options={options} onChange={setFilters} />
      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {filteredJobs.length ? filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              isApplied={appliedJobIds.includes(job.id)}
              onSave={toggleSaved}
              onView={setSelectedJob}
              onApply={setApplyingJob}
            />
          )) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No contract roles match the current filters.</div>
          )}
        </div>
        <aside className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">Your activity</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Heart className="h-4 w-4" />Saved roles</span><span className="font-semibold">{savedJobIds.length}</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><Send className="h-4 w-4" />Applications</span><span className="font-semibold">{appliedJobIds.length}</span></div>
              <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2 text-slate-600"><CheckCircle2 className="h-4 w-4" />Client-ready roles</span><span className="font-semibold">{filteredJobs.filter((job) => job.transparencyScore >= 80).length}</span></div>
            </div>
          </Card>
          <Card className="border-emerald-200 bg-emerald-50 p-4">
            <h2 className="text-sm font-semibold text-emerald-950">How applying works</h2>
            <p className="mt-2 text-sm leading-6 text-emerald-900">Submit once through Clario. We review your fit, confirm availability and work authorization, then move qualified candidates into client submission.</p>
          </Card>
        </aside>
      </div>
      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
      <ApplicationModal job={applyingJob} onClose={() => setApplyingJob(null)} onSubmit={submitApplication} />
    </div>
  );
}
