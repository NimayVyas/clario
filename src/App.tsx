import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { getAllRoles } from "./services/jobService";
import { AppRoute, getDefaultRouteForRole, getRoutesForRole, isRouteAllowedForRole } from "./routes/routes";
import { Analytics } from "./pages/Analytics";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Matches } from "./pages/Matches";
import { EmployeeOutreachDashboard } from "./outreach/pages/EmployeeOutreachDashboard";
import { RecruiterDashboard } from "./pages/RecruiterDashboard";
import { Roles } from "./pages/Roles";
import { Settings } from "./pages/Settings";
import { Sources } from "./pages/Sources";
import { CandidateProfile } from "./types/candidate";
import { AuthSession, fetchCurrentSession, logout as logoutSession } from "./services/authService";

export default function App() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>("home");
  const [session, setSession] = useState<AuthSession | undefined>();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [search, setSearch] = useState("");
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | undefined>();
  const jobs = useMemo(() => getAllRoles().filter((job) => ["W2", "C2C", "1099", "Contract-to-Hire"].includes(job.contractType)), []);
  const [visibleRoleJobs, setVisibleRoleJobs] = useState(jobs);
  const handleVisibleJobsChange = useCallback((nextJobs: typeof jobs) => setVisibleRoleJobs(nextJobs), []);
  const userRole = session?.user.role ?? "candidate";
  const homeRoute = session ? getDefaultRouteForRole(userRole) : "home";

  useEffect(() => {
    let mounted = true;
    fetchCurrentSession()
      .then((currentSession) => {
        if (!mounted) return;
        if (currentSession) {
          setSession(currentSession);
          setActiveRoute((route) => isRouteAllowedForRole(route, currentSession.user.role) ? route : getDefaultRouteForRole(currentSession.user.role));
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (mounted) setIsAuthReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!session && activeRoute !== "home") {
      setActiveRoute("home");
      return;
    }
    if (session && !isRouteAllowedForRole(activeRoute, session.user.role)) {
      setActiveRoute(getDefaultRouteForRole(session.user.role));
    }
  }, [activeRoute, isAuthReady, session]);

  const handleAuthenticated = (nextSession: AuthSession, profile?: CandidateProfile) => {
    setSession(nextSession);
    if (profile) setCandidateProfile(profile);
    setSearch("");
    setActiveRoute(getDefaultRouteForRole(nextSession.user.role));
  };

  const logout = async () => {
    await logoutSession(session);
    setSession(undefined);
    setSearch("");
    setActiveRoute("home");
  };

  const handleRouteChange = (route: AppRoute) => {
    if (!session) {
      setActiveRoute("home");
      return;
    }
    setActiveRoute(isRouteAllowedForRole(route, session.user.role) ? route : getDefaultRouteForRole(session.user.role));
  };

  const page = {
    home: <Home profile={candidateProfile} onAuthenticated={handleAuthenticated} />,
    matches: <Matches jobs={jobs} profile={candidateProfile} onGoHome={() => setActiveRoute("home")} />,
    dashboard: <Dashboard jobs={jobs} />,
    roles: <Roles jobs={jobs} search={search} onVisibleJobsChange={handleVisibleJobsChange} />,
    employee: <EmployeeOutreachDashboard section="outreach-dashboard" search={search} />,
    "outreach-accounts": <EmployeeOutreachDashboard section="accounts" search={search} />,
    "outreach-contacts": <EmployeeOutreachDashboard section="contacts" search={search} />,
    "outreach-lead-queue": <EmployeeOutreachDashboard section="lead-queue" search={search} />,
    "outreach-campaigns": <EmployeeOutreachDashboard section="campaigns" search={search} />,
    "outreach-tasks": <EmployeeOutreachDashboard section="tasks" search={search} />,
    "outreach-research": <EmployeeOutreachDashboard section="research" search={search} />,
    "outreach-messages": <EmployeeOutreachDashboard section="messages" search={search} />,
    "outreach-analytics": <EmployeeOutreachDashboard section="outreach-analytics" search={search} />,
    "outreach-settings": <EmployeeOutreachDashboard section="outreach-settings" search={search} />,
    recruiter: <RecruiterDashboard search={search} />,
    sources: <Sources />,
    analytics: <Analytics jobs={jobs} />,
    settings: <Settings />,
  }[activeRoute];

  if (!isAuthReady) {
    return <div className="grid min-h-screen place-items-center bg-white text-sm font-medium text-slate-500">Loading Clario...</div>;
  }

  if (activeRoute === "home") {
    return page;
  }

  return (
    <AppShell
      activeRoute={activeRoute}
      homeRoute={homeRoute}
      routes={getRoutesForRole(userRole)}
      search={search}
      onSearchChange={setSearch}
      onRouteChange={handleRouteChange}
      onLogout={logout}
      onExport={() => {
        if (userRole === "employee") window.alert("Clario Ops queue alerts enabled.");
        else if (userRole === "recruiter") window.alert("Recruiter candidate alerts enabled.");
        else window.alert(`Job alerts enabled for ${activeRoute === "roles" ? visibleRoleJobs.length : jobs.length} Clario contract roles.`);
      }}
    >
      {page}
    </AppShell>
  );
}
