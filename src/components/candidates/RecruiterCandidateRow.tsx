import { Clock, DollarSign, MapPin } from "lucide-react";
import { CandidateRecord } from "../../data/mockCandidates";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface RecruiterCandidateRowProps {
  candidate: CandidateRecord;
}

export function RecruiterCandidateRow({ candidate }: RecruiterCandidateRowProps) {
  const topSkills = candidate.skills.slice(0, 3);
  const remainingSkillCount = Math.max(candidate.skills.length - topSkills.length, 0);

  return (
    <Card className="p-4 shadow-none transition hover:border-slate-300 hover:shadow-soft">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.15fr)_minmax(360px,1fr)_180px] xl:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-6 text-slate-950">{candidate.name}</h3>
            <Badge tone={candidate.status === "Client Ready" ? "green" : candidate.status === "Submitted" ? "blue" : "slate"}>{candidate.status}</Badge>
          </div>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{candidate.targetRoles.join(" / ")}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="min-w-0 rounded-md bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400"><MapPin className="h-3.5 w-3.5" /> Location</p>
            <p className="mt-1 truncate text-sm font-medium text-slate-700">{candidate.location}</p>
          </div>
          <div className="rounded-md bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400"><DollarSign className="h-3.5 w-3.5" /> Rate</p>
            <p className="mt-1 text-sm font-medium text-slate-700">${candidate.preferredRate}/hr</p>
          </div>
          <div className="rounded-md bg-slate-50 px-3 py-2">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400"><Clock className="h-3.5 w-3.5" /> Available</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{candidate.availability}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex max-w-full flex-wrap gap-2 xl:justify-end">
            {topSkills.map((skill) => <Badge key={skill}>{skill}</Badge>)}
            {remainingSkillCount > 0 && <Badge>+{remainingSkillCount}</Badge>}
          </div>
          <Button className="w-full bg-[#ff6b4a] text-white hover:bg-[#f45d3c] xl:w-32" size="sm">Shortlist</Button>
        </div>
      </div>
    </Card>
  );
}
