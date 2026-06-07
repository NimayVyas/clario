import { AlertTriangle, CheckCircle2 } from "lucide-react";

export function RedFlagList({ flags }: { flags: string[] }) {
  if (!flags.length) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        No major red flags detected
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {flags.map((flag) => (
        <li key={flag} className="flex items-center gap-2 text-sm text-slate-700">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          {flag}
        </li>
      ))}
    </ul>
  );
}
