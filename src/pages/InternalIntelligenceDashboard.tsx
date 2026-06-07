import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copy, Database, FileText, PhoneCall, Plus, ShieldCheck } from "lucide-react";
import { DashboardMetricCard } from "../components/dashboard/DashboardMetricCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { LeadTable, RoleTable } from "../internal/components/InternalTables";
import { LiveSourceRunner } from "../internal/components/LiveSourceRunner";
import { PriorityBadge, ScoreBadge, StatusBadge } from "../internal/components/InternalBadges";
import { RoleDetailPanel } from "../internal/components/RoleDetailPanel";
import { companies, internalJobs, InternalJobRole, leads, outreachTasks, sources } from "../internal/data/intelligenceSeed";
import { groupTasksByStatus, topPartnershipOpportunities } from "../internal/services/intelligenceServices";

type InternalTab = "overview" | "roles" | "outreach" | "staffing" | "direct" | "companies" | "scripts" | "sources";

const tabs: Array<{ id: InternalTab; label: string }> = [
  { id: "overview", label: "Dashboard Overview" },
  { id: "roles", label: "Role Discovery" },
  { id: "outreach", label: "Outreach Queue" },
  { id: "staffing", label: "Staffing Companies" },
  { id: "direct", label: "Direct Partnerships" },
  { id: "companies", label: "Company Intelligence" },
  { id: "scripts", label: "Call Scripts" },
  { id: "sources", label: "Settings / Sources" },
];

const scriptTemplates = [
  { name: "Staffing company cold call", body: "Hey, this is [Name] from Clario. We help staffing teams source and screen stronger candidates for hard-to-fill contract tech roles. I noticed your team works on [role category], and I wanted to see if you are open to a lightweight delivery partnership where you keep the client relationship and we help improve shortlist quality." },
  { name: "Direct employer cold call", body: "Hey, this is [Name] from Clario. We help companies hiring contract data, cloud, and AI talent reduce weak submissions and get qualified shortlists faster. I noticed your team has several open contract roles in [skill area]. Are you open to seeing a 10-minute demo?" },
  { name: "Staffing company cold email", body: "Subject: Possible sourcing partnership for contract tech roles\n\nHi [Name],\n\nI’m building Clario, an AI-assisted sourcing and screening platform for contract data, cloud, and AI roles. We help staffing teams create stronger qualified shortlists faster while your firm keeps the client relationship.\n\nWould you be open to testing Clario on one hard-to-fill role?" },
  { name: "Direct employer cold email", body: "Subject: Faster shortlists for contract tech hiring\n\nHi [Name],\n\nI’m with Clario. We help companies hiring contract data, cloud, and AI talent reduce weak submissions and identify qualified candidates faster using transparent AI-assisted sourcing and candidate ranking.\n\nWould you be open to a quick 10-minute demo?" },
  { name: "Objection handling", body: "If they already use vendors: That makes sense. Clario is not trying to replace your process. We help improve shortlist quality before candidates reach your team." },
];

export function InternalIntelligenceDashboard({ search }: { search: string }) {
  const [activeTab, setActiveTab] = useState<InternalTab>("overview");
  const [selectedJob, setSelectedJob] = useState<InternalJobRole | null>(null);
  const [roleFilter, setRoleFilter] = useState("All");
  const [liveJobs, setLiveJobs] = useState<InternalJobRole[]>([]);
  const query = search.trim().toLowerCase();
  const allJobs = useMemo(() => [...liveJobs, ...internalJobs], [liveJobs]);

  const visibleJobs = useMemo(() => allJobs.filter((job) => {
    const matchesSearch = !query || [job.title, job.companyName, job.location, job.sourceName, ...job.requiredSkills].some((value) => value.toLowerCase().includes(query));
    const matchesFilter = roleFilter === "All" || job.requiredSkills.includes(roleFilter) || job.sourceType === roleFilter || job.remoteType === roleFilter || job.employmentType === roleFilter;
    return matchesSearch && matchesFilter;
  }), [allJobs, query, roleFilter]);

  const opportunities = topPartnershipOpportunities(allJobs, leads);
  const groupedTasks = groupTasksByStatus(outreachTasks);
  const skillData = Object.entries(allJobs.flatMap((job) => job.requiredSkills).reduce<Record<string, number>>((acc, skill) => ({ ...acc, [skill]: (acc[skill] ?? 0) + 1 }), {})).map(([skill, roles]) => ({ skill, roles }));
  const sourceData = Object.entries(allJobs.reduce<Record<string, number>>((acc, job) => ({ ...acc, [job.sourceType]: (acc[job.sourceType] ?? 0) + 1 }), {})).map(([name, value]) => ({ name: name.replaceAll("_", " "), value }));

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm font-semibold text-violet-600">Clario Internal Intelligence Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Contract role discovery to partnership outreach.</h1>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">Discover public contract technology roles, classify partnership paths, and move high-fit opportunities into a compliant outreach queue.</p>
      </section>

      <Card className="border-violet-200 bg-violet-50 p-4 shadow-none">
        <div className="flex items-start gap-3 text-sm leading-6 text-violet-950">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p>Compliance note: Clario only stores public business and job information from permitted public sources, APIs, RSS feeds, approved imports, and normal browser-accessible pages. We respect robots.txt, terms, rate limits, paywalls, login walls, CAPTCHAs, and require consent before candidate submission.</p>
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2">
        {tabs.map((tab) => <Button key={tab.id} size="sm" variant={activeTab === tab.id ? "primary" : "ghost"} onClick={() => setActiveTab(tab.id)}>{tab.label}</Button>)}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-5">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardMetricCard label="Total roles discovered" value={allJobs.length} helper={`${liveJobs.length} live connector roles`} icon={Database} />
            <DashboardMetricCard label="Contract roles found" value={allJobs.filter((j) => j.employmentType.includes("CONTRACT")).length} helper="Contract or CTH" icon={FileText} />
            <DashboardMetricCard label="Staffing leads" value={leads.filter((l) => l.type === "STAFFING_COMPANY").length} helper="Potential delivery partners" icon={PhoneCall} />
            <DashboardMetricCard label="Outreach due today" value={outreachTasks.filter((t) => t.dueDate === "2026-06-05").length} helper="Calls, emails, demos" icon={Copy} />
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Roles by skill category</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={skillData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="skill" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="roles" fill="#6d28d9" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
            <Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Roles by source type</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={88}>{sourceData.map((entry, index) => <Cell key={entry.name} fill={["#111827", "#6d28d9", "#94a3b8", "#c4b5fd"][index % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></Card>
          </section>
          <Card className="overflow-hidden"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Opportunity</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Why it matters</th></tr></thead><tbody>{opportunities.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="px-4 py-3 font-semibold">{item.name}</td><td className="px-4 py-3">{item.type.replaceAll("_", " ")}</td><td className="px-4 py-3"><ScoreBadge score={item.score} /></td><td className="px-4 py-3 text-slate-600">{item.note}</td></tr>)}</tbody></table></Card>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">{["All", "CONTRACT", "CONTRACT_TO_HIRE", "REMOTE", "HYBRID", "ONSITE", "Python", "SQL", "AWS", "PySpark", "Snowflake", "Databricks", "React"].map((f) => <Button key={f} size="sm" variant={roleFilter === f ? "primary" : "secondary"} onClick={() => setRoleFilter(f)}>{f.replaceAll("_", " ")}</Button>)}</div>
          <RoleTable jobs={visibleJobs} onSelect={setSelectedJob} />
        </div>
      )}

      {activeTab === "outreach" && (
        <div className="grid gap-4 xl:grid-cols-3">
          {["TODO", "IN_PROGRESS", "CONTACTED", "FOLLOW_UP_NEEDED", "CALL_BOOKED", "PARTNERED"].map((status) => (
            <Card key={status} className="p-3 shadow-none"><h3 className="mb-3 text-sm font-semibold">{status.replaceAll("_", " ")}</h3><div className="space-y-3">{(groupedTasks[status] ?? []).map((task) => <Card key={task.id} className="p-3 shadow-none"><div className="flex items-center justify-between"><p className="font-semibold">{task.leadName}</p><PriorityBadge priority={task.priority} /></div><p className="mt-2 text-xs text-slate-500">{task.taskType.replaceAll("_", " ")} · Due {task.dueDate}</p><p className="mt-3 text-sm leading-6 text-slate-600">{task.researchSummary}</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline">Copy email</Button><Button size="sm" variant="outline">Mark contacted</Button></div></Card>)}</div></Card>
          ))}
        </div>
      )}

      {activeTab === "staffing" && <LeadTable leads={leads.filter((lead) => lead.type === "STAFFING_COMPANY")} />}
      {activeTab === "direct" && <LeadTable leads={leads.filter((lead) => lead.type === "DIRECT_EMPLOYER")} />}

      {activeTab === "companies" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {companies.map((company) => <Card key={company.id} className="p-4"><div className="flex items-start justify-between"><h3 className="font-semibold">{company.name}</h3><ScoreBadge score={company.partnershipFitScore} /></div><p className="mt-1 text-sm text-slate-500">{company.industry} · {company.headquarters}</p><p className="mt-3 text-sm leading-6 text-slate-600">{company.notes}</p><div className="mt-4 flex flex-wrap gap-2"><StatusBadge status={company.isStaffingCompany ? "STAFFING_COMPANY" : "DIRECT_EMPLOYER"} />{company.procurementUrl && <Badge tone="blue">Vendor page</Badge>}</div><textarea className="mt-4 min-h-24 w-full rounded-md border border-slate-200 p-2 text-sm" defaultValue="Call notes and demo notes..." /></Card>)}
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {scriptTemplates.map((script) => <Card key={script.name} className="p-4"><h3 className="text-sm font-semibold">{script.name}</h3><textarea className="mt-3 min-h-44 w-full rounded-md border border-slate-200 p-3 text-sm leading-6" defaultValue={script.body} /><Button className="mt-3" variant="outline" size="sm"><Copy className="h-4 w-4" /> Copy template</Button></Card>)}
        </div>
      )}

      {activeTab === "sources" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <LiveSourceRunner onJobsFetched={(jobs) => setLiveJobs((current) => [...jobs, ...current.filter((job) => !job.id.startsWith("live-"))])} />
            {sources.map((source) => <Card key={source.id} className="p-4"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{source.name}</h3><p className="mt-1 text-sm text-slate-500">{source.url}</p></div><StatusBadge status={source.lastRunStatus} /></div><p className="mt-3 text-sm text-slate-600">{source.notes}</p></Card>)}
          </div>
          <Card className="p-4"><h3 className="font-semibold">Add source</h3><div className="mt-4 space-y-3"><input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Source name" /><input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" placeholder="Public URL, RSS, API, or CSV" /><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"><option>COMPANY_CAREER_PAGE</option><option>STAFFING_SITE</option><option>RSS</option><option>API</option><option>CSV_IMPORT</option></select><Button className="w-full"><Plus className="h-4 w-4" /> Add compliant source</Button></div><div className="mt-5 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">CSV columns: title, companyName, jobUrl, location, employmentType, description, postedDate, sourceName.</div></Card>
        </div>
      )}

      <RoleDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
