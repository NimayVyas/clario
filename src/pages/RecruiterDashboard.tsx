import { useMemo, useState } from "react";
import { Mail, SlidersHorizontal } from "lucide-react";
import { RecruiterCandidateRow } from "../components/candidates/RecruiterCandidateRow";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CandidateRecord, mockCandidates } from "../data/mockCandidates";

export function RecruiterDashboard({ search }: { search: string }) {
  const [skill, setSkill] = useState("All");
  const [role, setRole] = useState("All");
  const [workPreference, setWorkPreference] = useState<CandidateRecord["workPreference"] | "All">("All");
  const [maxRate, setMaxRate] = useState("");

  const skills = useMemo(() => [...new Set(mockCandidates.flatMap((candidate) => candidate.skills))].sort(), []);
  const roles = useMemo(() => [...new Set(mockCandidates.flatMap((candidate) => candidate.targetRoles))].sort(), []);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return mockCandidates.filter((candidate) => {
      const matchesSearch = !query || [candidate.name, candidate.email, candidate.location, ...candidate.skills, ...candidate.targetRoles].some((value) => value.toLowerCase().includes(query));
      const matchesSkill = skill === "All" || candidate.skills.includes(skill);
      const matchesRole = role === "All" || candidate.targetRoles.includes(role);
      const matchesWork = workPreference === "All" || candidate.workPreference === workPreference;
      const matchesRate = !maxRate || candidate.preferredRate <= Number(maxRate);
      return matchesSearch && matchesSkill && matchesRole && matchesWork && matchesRate;
    });
  }, [search, skill, role, workPreference, maxRate]);

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-orange-600">Recruiter portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Candidate search.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Search screened Clario candidates by role, skill, work model, and rate.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Badge tone="green">{mockCandidates.filter((c) => c.status === "Client Ready").length} client ready</Badge>
          <Badge>{filteredCandidates.length} visible</Badge>
        </div>
      </section>

      <Card className="p-4 shadow-none">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-950">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Role</span>
            <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={role} onChange={(event) => setRole(event.target.value)}>
              <option>All</option>
              {roles.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Skill</span>
            <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={skill} onChange={(event) => setSkill(event.target.value)}>
              <option>All</option>
              {skills.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Work model</span>
            <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={workPreference} onChange={(event) => setWorkPreference(event.target.value as CandidateRecord["workPreference"] | "All")}>
              <option>All</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Rate ceiling</span>
            <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" placeholder="Max hourly rate" value={maxRate} onChange={(event) => setMaxRate(event.target.value)} type="number" />
          </label>
        </div>
      </Card>

      <div className="grid gap-5 2xl:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <RecruiterCandidateRow key={candidate.id} candidate={candidate} />
          ))}
          {!filteredCandidates.length && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">No candidates match those filters.</div>
          )}
        </section>
        <aside className="space-y-4">
          <Card className="p-4 shadow-none">
            <h2 className="text-sm font-semibold text-slate-950">Shortlist</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Choose candidates, then ask Clario for a submission packet and availability confirmation.</p>
            <Button className="mt-4 w-full bg-[#ff6b4a] text-white hover:bg-[#f45d3c]"><Mail className="h-4 w-4" /> Request candidate packet</Button>
          </Card>
          <Card className="p-4 shadow-none">
            <h2 className="text-sm font-semibold text-slate-950">Common skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 8).map((item) => <Badge key={item}>{item}</Badge>)}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
