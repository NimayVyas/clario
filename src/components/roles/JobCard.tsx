import { Bookmark, BriefcaseBusiness, CalendarDays, CheckCircle2, Eye, MapPin, Sparkles } from "lucide-react";
import { JobRole } from "../../types/job";
import { formatRateRange } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { DuplicateRiskBadge } from "./DuplicateRiskBadge";
import { RemoteTypeBadge } from "./RemoteTypeBadge";
import { SkillBadge } from "./SkillBadge";
import { TransparencyBadge } from "./TransparencyBadge";

interface JobCardProps {
  job: JobRole;
  isSaved: boolean;
  isApplied: boolean;
  onSave: (job: JobRole) => void;
  onView: (job: JobRole) => void;
  onApply: (job: JobRole) => void;
}

export function JobCard({ job, isSaved, isApplied, onSave, onView, onApply }: JobCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="grid gap-4 p-5 lg:grid-cols-[1fr_180px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="green">{job.postedDate === "2026-06-04" ? "New today" : "Recently posted"}</Badge>
            <Badge tone="blue">Clario staffed contract</Badge>
            <TransparencyBadge score={job.transparencyScore} />
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{job.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{job.company} · Contract technology role</p>
            </div>
            <button
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
              onClick={() => onSave(job)}
              aria-label={isSaved ? "Unsave role" : "Save role"}
            >
              <Bookmark className={isSaved ? "h-4 w-4 fill-slate-950 text-slate-950" : "h-4 w-4"} />
            </button>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-3">
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{job.location}</span>
            <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-slate-400" />{job.contractType} · {job.contractLength}</span>
            <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" />Expires {job.expiresDate}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <RemoteTypeBadge type={job.remoteType} />
            <Badge tone="green">{formatRateRange(job.hourlyRateMin, job.hourlyRateMax)}</Badge>
            <DuplicateRiskBadge score={job.duplicateRiskScore} />
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">{job.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">{job.techStack.slice(0, 6).map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
        </div>
        <div className="rounded-xl bg-slate-950 p-4 text-white">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-emerald-400 text-2xl font-semibold">{job.aiFitScore}%</div>
          <p className="mt-4 text-center text-sm font-semibold uppercase tracking-wide">Match score</p>
          <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
            <p className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-emerald-300" />Visible client and rate</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />Contract terms upfront</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Less than 25 applicants · Clario recruiter review before client submission</p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => onView(job)}><Eye className="h-4 w-4" /> Details</Button>
          <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={isApplied} onClick={() => onApply(job)}>
            {isApplied ? "Applied" : "Apply now"}
          </Button>
        </div>
      </div>
    </article>
  );
}
