import { ReactNode } from "react";
import { AppRoute, NavigationRoute } from "../../routes/routes";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  activeRoute: AppRoute;
  homeRoute: AppRoute;
  routes: NavigationRoute[];
  search: string;
  onSearchChange: (value: string) => void;
  onRouteChange: (route: AppRoute) => void;
  onExport: () => void;
  onLogout: () => void;
  children: ReactNode;
}

export function AppShell({ activeRoute, homeRoute, routes, search, onSearchChange, onRouteChange, onExport, onLogout, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeRoute={activeRoute} homeRoute={homeRoute} routes={routes} onRouteChange={onRouteChange} />
      <div className="min-w-0 flex-1">
        <Topbar activeRoute={activeRoute} homeRoute={homeRoute} routes={routes} search={search} onSearchChange={onSearchChange} onRouteChange={onRouteChange} onExport={onExport} onLogout={onLogout} />
        <main c