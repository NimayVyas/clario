import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { mockSources } from "../../data/mockSources";
import { Card } from "../ui/Card";

export function SourceQualityChart() {
  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-950">Source quality comparison</h3>
      <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={mockSources}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} /><Tooltip /><Bar dataKey="sourceQualityScore" fill="#0f172a" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
    </Card>
  );
}
