import { useMemo, useState } from "react";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import { ApplicationModal } from "../components/roles/ApplicationModal";
import { JobCard } from "../components/roles/JobCard";
import { JobDetailDrawer } from "../components/roles/JobDetailDrawer";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { scoreJobForCandidate } from "../services/resumeParserService";
import { CandidateProfile } from "../types/candidate";
import { JobRole } from "../types/job";

interface MatchesProps {
  jobs: JobRole[];
  profile?: CandidateProfile;
  onGoHome: () => void;
}

export function Matches({ jobs, profile, onGoHome }: MatchesProps) {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [applyingJob, setApplyingJob] = useState<JobRole | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);

  const rankedJobs = useMemo(() => jobs
    .map((job) => ({ job: { ...job, aiFitScore: scoreJobForCandidate(job, profile) }, score: scoreJobForCandidate(job, profile) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.job), [jobs, profile]);

  const toggleSaved = (job: JobRole) => {
    setSavedJobIds((current) => current.includes(job.id) ? current.filter((id) => id !== job.id) : [...current, job.id]);
  };

  const submitApplication = (job: JobRole) => {
    setAppliedJobIds((current) => current.includes(job.id) ? current : [...current, job.id]);
    setApplyingJob(null);
  };

  if (!profile) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Card className="max-w-xl p-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-semibold text-slate-950">Upload your resume to unlock matches.</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Clario ranks contract roles after reading your skills, experience, education, and work history.</p>
          <Button className="mt-5 bg-emerald-500 text-slate-950 hover:bg-emerald-400" onClick={onGoHome}>Upload resume <ArrowRight className="h-4 w-4" /></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Matches based on your resume</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Your highest-fit contract roles.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Ranked by your skills, years of experience, previous roles, and Clario’s contract fit scoring.
            </p>
          </div>
          <Card className="min-w-[280px] p-4 shadow-none">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950"><FileText className="h-4 w-4" /> {profile.resumeFileName}</div>
            <p className="mt-2 text-sm text-slate-500">{profile.yearsOfExperience ?? "Unknown"} years experience · {profile.college ?? "Education not listed"}</p>
            <div className="mt-3 flex flex-wrap gap-2">{profile.skills.slice(0, 5).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
          </Card>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {rankedJobs.slice(0, 15).map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              isApplied={appliedJobIds.includes(job.id)}
              onSave={toggleSaved}
              onView={setSelectedJob}
              onApply={setApplyingJob}
            />
          ))}
        </div>
        <aside className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">Resume signals</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">{profile.skills.length}</span> skills detected</p>
              <p><span className="font-semibold">{profile.positions.length}</span> previous positions curated</p>
              <p><span className="font-semibold">{rankedJobs.filter((job) => job.aiFitScore >= 85).length}</span> strong matches</p>
            </div>
          </Card>
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-slate-950">Positions we found</h2>
            <div className="mt-3 space-y-3">
              {profile.positions.map((position) => (
                <div key={`${position.title}-${position.company}`} className="text-sm">
                  <p className="font-semibold text-slate-950">{position.title}</p>
                  <p className="text-slate-500">{position.company}{position.years ? ` · ${position.years}` : ""}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
      <ApplicationModal job={applyingJob} onClose={() => setApplyingJob(null)} onSubmit={submitApplication} />
      <JobDetailDrawer job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
