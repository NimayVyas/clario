import { LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

export function DashboardMetricCard({ label, value, helper, icon: Icon }: { label: string; value: string | number; helper: string; icon: LucideIcon }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
          <p className="mt-2 text-xs text-slate-500">{helper}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600"><Icon className="h-4 w-4" /></div>
      </div>
    </Card>
  );
}
