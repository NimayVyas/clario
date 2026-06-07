import { BriefcaseBusiness, Clock, DollarSign, MapPin } from "lucide-react";
import { CandidateRecord } from "../../data/mockCandidates";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface CandidateCardProps {
  candidate: CandidateRecord;
  actionLabel: string;
  onAction?: (candidate: CandidateRecord) => void;
}

export function CandidateCard({ candidate, actionLabel, onAction }: CandidateCardProps) {
  const statusTone = candidate.status === "Client Ready" || candidate.status === "Submitted" ? "green" : candidate.status === "Needs Review" ? "amber" : "blue";

  return (
    <Card className="p-4 shadow-none transition hover:shadow-soft">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone}>{candidate.status}</Badge>
            <Badge>{candidate.resumeScore}% resume score</Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-950">{candidate.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{candidate.email}</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-4">
            <span className="inline-flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-slate-400" />{candidate.yearsOfExperience} years</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{candidate.location}</span>
            <span className="inline-flex items-center gap-2"><DollarSign className="h-4 w-4 text-slate-400" />${candidate.preferredRate}/hr</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{candidate.availability}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.skills.slice(0, 7).map((skill) => <Badge key={skill}>{skill}</Badge>)}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{candidate.notes}</p>
        </div>
        <div className="min-w-44 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target roles</p>
          <div className="mt-2 space-y-1 text-sm font-medium text-slate-800">
            {candidate.targetRoles.map((role) => <p key={role}>{role}</p>)}
          </div>
          <Button className="mt-4 w-full bg-[#ff6b4a] text-white hover:bg-[#f45d3c]" onClick={() => onAction?.(candidate)}>{actionLabel}</Button>
        </div>
      </div>
    </Card>
  );
}
