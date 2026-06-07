import { ChangeEvent, FormEvent, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, FileText, Lock, Mail, UploadCloud, UserRoundSearch, UsersRound } from "lucide-react";
import { CandidateProfile } from "../types/candidate";
import { parseMockResume, parseResumeText } from "../services/resumeParserService";
import { AuthSession, login, registerCandidate } from "../services/authService";
import { ClarioLogo } from "../components/brand/ClarioLogo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

interface HomeProps {
  profile?: CandidateProfile;
  onAuthenticated: (session: AuthSession, profile?: CandidateProfile) => void;
}

type LoginMode = "candidate" | "recruiter" | "employee";

export function Home({ profile, onAuthenticated }: HomeProps) {
  const [mode, setMode] = useState<LoginMode>("candidate");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [password, setPassword] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [parsedProfile, setParsedProfile] = useState<CandidateProfile | undefined>(profile);
  const [isParsing, setIsParsing] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const switchMode = (nextMode: LoginMode) => {
    setMode(nextMode);
    setAuthError("");
    if (nextMode === "employee") {
      setEmail("ops@clario.com");
      setPassword("clario123");
    } else if (nextMode === "recruiter") {
      setEmail("recruiter@example.com");
      setPassword("clario123");
    } else if (email === "ops@clario.com" || email === "recruiter@example.com") {
      setEmail(profile?.email ?? "");
      setPassword("");
    }
  };

  const parseFile = async (file: File, nextEmail = email) => {
    setIsParsing(true);
    const isText = file.type.includes("text") || file.name.toLowerCase().endsWith(".txt");
    const parsed = isText ? parseResumeText(await file.text(), nextEmail, file.name) : parseMockResume(nextEmail, file.name);
    setParsedProfile(parsed);
    setIsParsing(false);
    return parsed;
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    await parseFile(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      if (mode === "employee" || mode === "recruiter") {
        const session = await login({ email, password, role: mode });
        onAuthenticated(session);
        return;
      }
      const parsed = resumeFile ? await parseFile(resumeFile, email) : parseMockResume(email, "quick-start-resume.pdf");
      const session = await registerCandidate({ email, password, name: parsed.positions[0]?.company ? email.split("@")[0] : undefined });
      onAuthenticated(session, { ...parsed, email });
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_520px]">
        <section>
          <ClarioLogo className="mb-8" />
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800">
            <CheckCircle2 className="h-4 w-4" />
            60-second contract job matching
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-slate-950">
            Upload your resume. Get matched to Clario-staffed contract roles.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            We parse your resume for experience, skills, education, GPA when listed, and the companies you worked for. Then we rank contract roles you can apply to through Clario.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["No profile essay", "No recruiter call first", "No vague role feed"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </section>

        <Card className="p-5">
          <div>
            <p className="text-sm font-semibold text-orange-600">Choose your workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {mode === "candidate" ? "Upload your resume" : mode === "recruiter" ? "Recruiter login" : "Employee login"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === "candidate" ? "Email, password, resume. That is it." : mode === "recruiter" ? "Access candidate search and shortlists." : "Access resume review and operations queues."}
            </p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1">
            {([
              ["candidate", "Candidate"],
              ["recruiter", "Recruiter"],
              ["employee", "Employee"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                className={mode === value ? "rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm" : "rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"}
              >
                {label}
              </button>
            ))}
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
              <span className="relative block">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="h-12 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-slate-400" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{mode === "candidate" ? "Create a password" : "Password"}</span>
              <span className="relative block">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="h-12 w-full rounded-lg border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-slate-400" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="6+ characters" />
              </span>
            </label>
            {mode === "candidate" ? (
              <label className="grid cursor-pointer place-items-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:bg-slate-100">
                <UploadCloud className="h-8 w-8 text-slate-500" />
                <span className="mt-3 text-sm font-semibold text-slate-950">{resumeFile ? resumeFile.name : "Drop in your resume"}</span>
                <span className="mt-1 text-xs text-slate-500">PDF, DOCX, or TXT</span>
                <input className="sr-only" type="file" accept=".pdf,.doc,.docx,.txt,text/plain,application/pdf" onChange={handleFile} />
              </label>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-white p-2 text-slate-700">
                    {mode === "recruiter" ? <UserRoundSearch className="h-5 w-5" /> : <UsersRound className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{mode === "recruiter" ? "Recruiter/business portal" : "Clario employee portal"}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {mode === "recruiter" ? "Filter screened candidates without seeing candidate-only dashboards." : "Review resumes and application queues without seeing candidate-only dashboards."}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Demo: {mode === "recruiter" ? "recruiter@example.com" : "ops@clario.com"} / clario123
                    </p>
                  </div>
                </div>
              </div>
            )}
            {authError && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{authError}</div>}
            <Button className="h-12 w-full bg-[#ff6b4a] text-base text-white hover:bg-[#f45d3c]" type="submit" disabled={isParsing || isSubmitting}>
              {isParsing ? "Reading resume..." : isSubmitting ? "Signing in..." : mode === "candidate" ? "Find my matches" : mode === "recruiter" ? "Enter recruiter portal" : "Enter Clario Ops"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {mode === "candidate" && parsedProfile && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950"><FileText className="h-4 w-4" /> Resume parsed</div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <div><p className="text-xs text-slate-500">Experience</p><p className="font-semibold">{parsedProfile.yearsOfExperience ?? "Not listed"} years</p></div>
                <div><p className="text-xs text-slate-500">College</p><p className="font-semibold">{parsedProfile.college ?? "Not listed"}</p></div>
                <div><p className="text-xs text-slate-500">GPA</p><p className="font-semibold">{parsedProfile.gpa ?? "Not listed"}</p></div>
                <div><p className="text-xs text-slate-500">Resume</p><p className="font-semibold">{parsedProfile.resumeFileName}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{parsedProfile.skills.slice(0, 8).map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Positions and companies</p>
                {parsedProfile.positions.map((position) => (
                  <div key={`${position.title}-${position.company}`} className="flex items-center gap-2 text-sm text-slate-700">
                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                    {position.title} · {position.company}{position.years ? ` · ${position.years}` : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
