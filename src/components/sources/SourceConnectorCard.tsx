import { Database, RefreshCw } from "lucide-react";
import { SourceConnector } from "../../data/mockSources";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function SourceConnectorCard({ source }: { source: SourceConnector }) {
  const tone = source.status === "Connected" ? "green" : source.status === "Pending" ? "amber" : "slate";
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-600"><Database className="h-4 w-4" /></div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">{source.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{source.type}</p>
          </div>
        </div>
        <Badge tone={tone}>{source.status}</Badge>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-slate-500">Last sync</p><p className="mt-1 font-medium text-slate-950">{source.lastSyncTime}</p></div>
        <div><p className="text-xs text-slate-500">Roles imported</p><p className="mt-1 font-medium text-slate-950">{source.rolesImported}</p></div>
        <div><p className="text-xs text-slate-500">Avg transparency</p><p className="mt-1 font-medium text-slate-950">{source.averageTransparencyScore}</p></div>
        <div><p className="text-xs text-slate-500">Quality score</p><p className="mt-1 font-medium text-slate-950">{source.sourceQualityScore}</p></div>
      </div>
      <Button className="mt-5 w-full" variant="outline"><RefreshCw className="h-4 w-4" /> Sync source</Button>
    </Card>
  );
}
