import { ExternalLink, Plus } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InternalJobRole, Lead } from "../data/intelligenceSeed";
import { ScoreBadge, StatusBadge } from "./InternalBadges";

export function RoleTable({ jobs, onSelect }: { jobs: InternalJobRole[]; onSelect: (job: InternalJobRole) => void }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>{["Role", "Company", "Source", "Location", "Skills", "Pay", "Scores", "Status", "Actions"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><button className="font-semibold text-slate-950" onClick={() => onSelect(job)}>{job.title}</button><p className="text-xs text-slate-500">{job.employmentType.replaceAll("_", " ")}</p></td>
                <td className="px-4 py-3">{job.companyName}</td>
                <td className="px-4 py-3">{job.sourceType.replaceAll("_", " ")}</td>
                <td className="px-4 py-3">{job.location} · {job.remoteType}</td>
                <td className="px-4 py-3">{job.requiredSkills.slice(0, 3).join(", ")}</td>
                <td className="px-4 py-3">{job.payRateMin ? `$${job.payRateMin}-${job.payRateMax}/hr` : "Not listed"}</td>
                <td className="px-4 py-3"><div className="flex gap-1"><ScoreBadge score={job.partnershipScore} /><ScoreBadge score={job.urgencyScore} /></div></td>
                <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => onSelect(job)}><Plus className="h-3.5 w-3.5" /> Queue</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{["Company", "Type", "Roles", "Angle", "Score", "Status", "Follow-up"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50">
              <td className="px-4 py-3"><a className="inline-flex items-center gap-1 font-semibold text-slate-950" href={lead.website} target="_blank" rel="noreferrer">{lead.companyName}<ExternalLink className="h-3 w-3" /></a></td>
              <td className="px-4 py-3">{lead.type.replaceAll("_", " ")}</td>
              <td className="px-4 py-3">{lead.targetRoles.join(", ")}</td>
              <td className="max-w-md px-4 py-3 text-slate-600">{lead.partnershipAngle}</td>
              <td className="px-4 py-3"><ScoreBadge score={lead.leadScore} /></td>
              <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
              <td className="px-4 py-3">{lead.nextFollowUpAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
