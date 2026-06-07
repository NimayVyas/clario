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
  { id: "outreach-accounts" as c