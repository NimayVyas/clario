import { X } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InternalJobRole } from "../data/intelligenceSeed";
import { classifyOpportunity } from "../services/intelligenceServices";
import { ScoreBadge, StatusBadge } from "./InternalBadges";

export function RoleDetailPanel({ job, onClose }: { job: InternalJobRole | null; onClose: () => void }) {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-slate-950/20" onClick={onClose} />
      <section className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role intelligence</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{job.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{job.companyName} · {classifyOpportunity(job).replaceAll("_", " ")}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Difficulty</p><ScoreBadge score={job.roleDifficultyScore} /></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Partnership</p><ScoreBadge score={job.partnershipScore} /></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Urgency</p><ScoreBadge score={job.urgencyScore} /></Card>
          </div>
          <section><h3 className="text-sm font-semibold">Parsed description</h3><p className="mt-2 text-sm leading-6 text-slate-600">{job.description}</p></section>
          <section><h3 className="text-sm font-semibold">Extracted skills</h3><p className="mt-2 text-sm text-slate-600">{[...job.requiredSkills, ...job.preferredSkills].join(", ")}</p></section>
          <section><h3 className="text-sm font-semibold">Why Clario could help</h3><p className="mt-2 text-sm leading-6 text-slate-600">This role has hard-to-fill skills, visible contract terms, and a high partnership score. Clario can create ranked candidate shortlists with screening notes before submission.</p></section>
          <section><h3 className="text-sm font-semibold">Suggested outreach angle</h3><p className="mt-2 text-sm leading-6 text-slate-600">Reduce weak submissions and shorten hiring cycles for contract {job.requiredSkills.slice(0, 2).join("/")} talent.</p></section>
          <section><h3 className="text-sm font-semibold">Suggested candidate profile</h3><p className="mt-2 text-sm leading-6 text-slate-600">{job.seniority} contractor with {job.requiredSkills.join(", ")} and recent {job.industry} delivery experience.</p></section>
          <section><h3 className="text-sm font-semibold">Suggested call script</h3><p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">Hey, this is [Name] from Clario. We help teams hiring contract {job.requiredSkills[0]} talent reduce weak submissions and get qualified shortlists faster. I noticed your open {job.title} role and wanted to see if you are open to a 10-minute demo.</p></section>
          <div className="flex items-center gap-2"><StatusBadge status={job.status} /><a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-700 underline">Open original job URL</a></div>
        </div>
      </section>
    </div>
  );
}
