import { Send, X } from "lucide-react";
import { JobRole } from "../../types/job";
import { formatRateRange } from "../../lib/utils";
import { Button } from "../ui/Button";
import { RedFlagList } from "./RedFlagList";
import { ScoreRing } from "./ScoreRing";
import { SkillBadge } from "./SkillBadge";
import { SourceBadge } from "./SourceBadge";
import { TransparencyBadge } from "./TransparencyBadge";

const recruiterQuestions = [
  "Can you confirm the end client?",
  "Is the listed rate the max bill rate or candidate pay rate?",
  "Is this W2, C2C, 1099, or contract-to-hire?",
  "How long is the initial contract?",
  "Is the role remote, hybrid, or onsite?",
  "Are there already submitted candidates for this role?",
];

export function JobDetailDrawer({ job, onClose }: { job: JobRole | null; onClose: () => void }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-slate-950/20" onClick={onClose} aria-label="Close drawer" />
      <section className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Clario role detail</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{job.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Client", job.company],
              ["Staffing path", "Apply through Clario"],
              ["Location", `${job.location} · ${job.remoteType}`],
              ["Contract", `${job.contractType} · ${job.contractLength}`],
              ["Rate", formatRateRange(job.hourlyRateMin, job.hourlyRateMax)],
              ["Dates", `${job.postedDate} to ${job.expiresDate}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs text-slate-500">{label}</div>
                <div className="mt-1 text-sm font-medium text-slate-950">{value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 p-4">
            <ScoreRing score={job.transparencyScore} label="Transparency" />
            <ScoreRing score={job.aiFitScore} label="AI fit" />
            <ScoreRing score={job.duplicateRiskScore} label="Duplicate risk" />
            <TransparencyBadge score={job.transparencyScore} />
            <SourceBadge source={job.source} />
          </div>

          <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="text-sm font-semibold text-emerald-950">Candidate submission path</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-900">
              This is a contract role staffed by Clario. Apply through Clario first; our team will verify fit, availability, work authorization, and candidate pay expectations before client submission.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-950">AI-generated summary</h3>
            <p className="text-sm leading-6 text-slate-600">
              {job.company} is seeking a {job.title} on a {job.contractType} contract. The role offers {formatRateRange(job.hourlyRateMin, job.hourlyRateMax)}, is {job.remoteType.toLowerCase()}, and emphasizes {job.techStack.slice(0, 4).join(", ")}.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-950">Required skills</h3>
              <div className="flex flex-wrap gap-2">{job.requiredSkills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-950">Nice-to-have skills</h3>
              <div className="flex flex-wrap gap-2">{job.niceToHaveSkills.map((skill) => <SkillBadge key={skill} skill={skill} />)}</div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-950">Full job description</h3>
            <p className="text-sm leading-6 text-slate-600">{job.description}</p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-950">Risk signals</h3>
              <RedFlagList flags={job.redFlags} />
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-950">Recruiter questions</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                {recruiterQuestions.map((question) => <li key={question}>{question}</li>)}
              </ul>
            </div>
          </section>
          <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">
            <Send className="h-4 w-4" />
            Apply through Clario
          </Button>
        </div>
      </section>
    </div>
  );
}
