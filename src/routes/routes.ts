import { BarChart3, BriefcaseBusiness, Building2, ClipboardList, Home, LayoutDashboard, LucideIcon, Mail, MessageSquare, Search, Settings, Sparkles, Target, UserRoundSearch, Users } from "lucide-react";

export type AppRoute =
  | "home"
  | "matches"
  | "dashboard"
  | "roles"
  | "employee"
  | "outreach-accounts"
  | "outreach-contacts"
  | "outreach-lead-queue"
  | "outreach-campaigns"
  | "outreach-tasks"
  | "outreach-research"
  | "outreach-messages"
  | "outreach-analytics"
  | "outreach-settings"
  | "recruiter"
  | "sources"
  | "analytics"
  | "settings";
export type UserRole = "candidate" | "employee" | "recruiter";

export interface NavigationRoute {
  id: AppRoute;
  label: string;
  icon: LucideIcon;
}

export const candidateRoutes: NavigationRoute[] = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "matches" as const, label: "Matches", icon: Sparkles },
  { id: "roles" as const, label: "Jobs", icon: BriefcaseBusiness },
  { id: "dashboard" as const, label: "Overview", icon: LayoutDashboard },
  { id: "settings" as const, label: "Profile", icon: Settings },
];

export const employeeRoutes: NavigationRoute[] = [
  { id: "employee" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "outreach-accounts" as const, label: "Accounts", icon: Building2 },
  { id: "outreach-contacts" as const, label: "Contacts", icon: Users },
  { id: "outreach-lead-queue" as const, label: "Lead Queue", icon: Target },
  { id: "outreach-campaigns" as const, label: "Campaigns", icon: Mail },
  { id: "outreach-tasks" as const, label: "Tasks", icon: ClipboardList },
  { id: "outreach-research" as const, label: "Research", icon: Search },
  { id: "outreach-messages" as const, label: "Messages", icon: MessageSquare },
  { id: "outreach-analytics" as const, label: "Analytics", icon: BarChart3 },
  { id: "outreach-settings" as const, label: "Settings", icon: Settings },
];

export const recruiterRoutes: NavigationRoute[] = [
  { id: "recruiter" as const, label: "Recruiter Portal", icon: UserRoundSearch },
];

export function getRoutesForRole(role: UserRole): NavigationRoute[] {
  if (role === "employee") return employeeRoutes;
  if (role === "recruiter") return recruiterRoutes;
  return candidateRoutes;
}

export function getDefaultRouteForRole(role: UserRole): AppRoute {
  if (role === "employee") return "employee";
  if (role === "recruiter") return "recruiter";
  return "matches";
}

export function isRouteAllowedForRole(route: AppRoute, role: UserRole): boolean {
  return getRoutesForRole(role).some((item) => item.id === route);
}
