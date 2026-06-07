import { useMemo, useState } from "react";
import { CheckCircle2, FileText, PhoneCall, Send, UploadCloud } from "lucide-react";
import { CandidateCard } from "../components/candidates/CandidateCard";
import { DashboardMetricCard } from "../components/dashboard/DashboardMetricCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CandidateRecord, mockCandidates } from "../data/mockCandidates";

export function EmployeeDashboard({ search }: { search: string }) {
  const [status, setStatus] = useState<CandidateRecord["status"] | "All">("All");
  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockCandidates.filter((candidate) => {
      const matchesSearch = !query || [candidate.name, candidate.email, candidate.location, candidate.resumeFileName, ...candidate.skills, ...candidate.targetRoles].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = status === "All" || candidate.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const nextUp = filteredCandidates[0] ?? mockCandidates[0];

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm font-semibold text-orange-600">Clario internal workspace</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Resume operations dashboard.</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Manually review parsed resumes, confirm candidate details, and move qualified talent into recruiter-ready queues.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard label="New resumes" value={mockCandidates.filter((c) => c.status === "New Resume").length} helper="Awaiting first review" icon={FileText} />
        <DashboardMetricCard label="Needs review" value={mockCandidates.filter((c) => c.status === "Needs Review").length} helper="Manual cleanup needed" icon={UploadCloud} />
        <DashboardMetricCard label="Screened" value={mockCandidates.filter((c) => c.status === "Screened").length} helper="Ready for recruiter action" icon={PhoneCall} />
        <DashboardMetricCard label="Client ready" value={mockCandidates.filter((c) => c.status === "Client Ready").length} helper="Can be submitted today" icon={CheckCircle2} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <Card className="p-3">
            <div className="flex flex-wrap gap-2">
              {(["All", "New Resume", "Needs Review", "Screened", "Client Ready", "Submitted"] as const).map((option) => (
                <Button key={option} variant={status === option ? "primary" : "secondary"} size="sm" onClick={() => setStatus(option)}>{option}</Button>
              ))}
            </div>
          </Card>
          {filteredCandidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} actionLabel="Open review" />
          ))}
        </section>

        <aside className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">Next resume to handle</h2>
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{nextUp.name}</p>
                  <p className="text-sm text-slate-500">{nextUp.resumeFileName}</p>
                </div>
                <Badge tone="amber">{nextUp.status}</Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p><span className="font-semibold">Experience:</span> {nextUp.yearsOfExperience} years</p>
                <p><span className="font-semibold">College:</span> {nextUp.college ?? "Not listed"}</p>
                <p><span className="font-semibold">GPA:</span> {nextUp.gpa ?? "Not listed"}</p>
                <p><span className="font-semibold">Rate:</span> ${nextUp.preferredRate}/hr</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              <Button className="bg-[#ff6b4a] text-white hover:bg-[#f45d3c]"><CheckCircle2 className="h-4 w-4" /> Mark screened</Button>
              <Button variant="outline"><PhoneCall className="h-4 w-4" /> Schedule candidate call</Button>
              <Button variant="outline"><Send className="h-4 w-4" /> Send to recruiter pool</Button>
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">Manual checklist</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {["Confirm work authorization", "Verify rate expectation", "Check resume parse accuracy", "Curate past companies", "Tag target roles"].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                  {item}
                </label>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
