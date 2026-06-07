import { Download, Plus, Search, Upload, UserPlus } from "lucide-react";
import { AppRoute, NavigationRoute } from "../../routes/routes";
import { ClarioLogo } from "../brand/ClarioLogo";
import { Button } from "../ui/Button";

interface TopbarProps {
  activeRoute: AppRoute;
  homeRoute: AppRoute;
  routes: NavigationRoute[];
  search: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onRouteChange: (route: AppRoute) => void;
  onLogout: () => void;
}

export function Topbar({ activeRoute, homeRoute, routes, search, onSearchChange, onExport, onRouteChange, onLogout }: TopbarProps) {
  const isEmployeeWorkspace = activeRoute === "employee" || activeRoute.startsWith("outreach-");
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:px-6">
        <div className="flex items-center justify-between lg:hidden">
          <button onClick={() => onRouteChange(homeRoute)} className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <ClarioLogo size="sm" showText={false} />
            <span>Clario</span>
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">NV</div>
        </div>
        <div className="flex gap-1 overflow-x-auto lg:hidden">
          {routes.map((route) => (
            <Button key={route.id} size="sm" variant={activeRoute === route.id ? "primary" : "ghost"} onClick={() => onRouteChange(route.id)}>
              {route.label}
            </Button>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title, client, skill, or location"
            className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isEmployeeWorkspace ? (
            <>
              <Button variant="outline"><Plus className="h-4 w-4" /> Add Account</Button>
              <Button variant="outline"><UserPlus className="h-4 w-4" /> Add Contact</Button>
              <Button variant="outline"><Upload className="h-4 w-4" /> Import CSV</Button>
              <Button className="bg-slate-950 text-white hover:bg-slate-800" onClick={onExport}><Download className="h-4 w-4" /> Export</Button>
            </>
          ) : (
            <Button className="bg-[#ff6b4a] text-white hover:bg-[#f45d3c]" onClick={onExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
          <Button variant="outline" onClick={onLogout}>Log out</Button>
          <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 lg:flex">NV</div>
        </div>
      </div>
    </header>
  );
}
