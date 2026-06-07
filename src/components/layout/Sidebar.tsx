import { AppRoute, NavigationRoute } from "../../routes/routes";
import { cn } from "../../lib/utils";
import { ClarioLogo } from "../brand/ClarioLogo";

interface SidebarProps {
  activeRoute: AppRoute;
  homeRoute: AppRoute;
  routes: NavigationRoute[];
  onRouteChange: (route: AppRoute) => void;
}

export function Sidebar({ activeRoute, homeRoute, routes, onRouteChange }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <button onClick={() => onRouteChange(homeRoute)} className="mb-8 flex items-center gap-3 px-2 text-left">
        <ClarioLogo size="sm" />
      </button>
      <nav className="space-y-1">
        {routes.map((route) => {
          const Icon = route.icon;
          const active = activeRoute === route.id;
          return (
            <button
              key={route.id}
              onClick={() => onRouteChange(route.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
        Role-based workspace access keeps candidate, recruiter, and Clario operations tools separate.
      </div>
    </aside>
  );
}
