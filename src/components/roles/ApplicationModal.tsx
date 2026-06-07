import { CheckCircle2, X } from "lucide-react";
import { JobRole } from "../../types/job";
import { formatRateRange } from "../../lib/utils";
import { Button } from "../ui/Button";

interface ApplicationModalProps {
  job: JobRole | null;
  onClose: () => void;
  onSubmit: (job: JobRole) => void;
}

export function ApplicationModal({ job, onClose, onSubmit }: ApplicationModalProps) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-slate-950/30" onClick={onClose} aria-label="Close application" />
      <section className="absolute left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Apply with Clario</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{job.company} · {job.location} · {formatRateRange(job.hourlyRateMin, job.hourlyRateMax)}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            Clario will staff this contract role directly. Your application goes to our recruiting team for client submission review.
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Full name" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Email" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Phone" />
            <input className="h-11 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="LinkedIn or portfolio URL" />
          </div>
          <textarea className="min-h-28 w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-slate-400" placeholder="Briefly share your availability, work authorization, and strongest matching skills." />
          <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400" onClick={() => onSubmit(job)}>
            <CheckCircle2 className="h-4 w-4" />
            Submit application
          </Button>
        </div>
      </section>
    </div>
  );
}
