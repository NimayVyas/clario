import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Building2, CalendarCheck, Download, Mail, MessageSquare, Plus, Search, Upload, Users } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Account, accounts as fallbackAccounts, campaigns as fallbackCampaigns, contacts as fallbackContacts, messageTemplates as fallbackMessageTemplates, pitchAngles as fallbackPitchAngles, tasks as fallbackTasks } from "../data/outreachMock";
import { calculateContactPriority } from "../services/leadScoringService";
import { generateEmailMessage, generateFollowUpMessage, generateLinkedInMessage, generateMeetingRequest } from "../services/messageGenerationService";
import { createOutreachAccount, createOutreachContact, createResearchQueue, fetchOutreachState, fetchSourcingRuns, generateOutreachDraft, importSourcingCsv, logOutreachSend, SourcingRun, updateOutreachTask } from "../services/outreachApi";

export type OutreachSection = "outreach-dashboard" | "accounts" | "contacts" | "lead-queue" | "campaigns" | "tasks" | "research" | "messages" | "outreach-analytics" | "outreach-settings";

interface EmployeeOutreachDashboardProps {
  section: OutreachSection;
  search: string;
}

const sectionTitles: Record<OutreachSection, string> = {
  "outreach-dashboard": "Dashboard",
  accounts: "Accounts",
  contacts: "Contacts",
  "lead-queue": "Lead Queue",
  campaigns: "Campaigns",
  tasks: "Tasks",
  research: "Research",
  messages: "Messages",
  "outreach-analytics": "Analytics",
  "outreach-settings": "Settings",
};

function scoreTone(score: number) {
  if (score >= 85) return "green";
  if (score >= 70) return "blue";
  if (score >= 55) return "amber";
  return "slate";
}

function priorityTone(priority: string) {
  if (priority === "Strategic") return "red";
  if (priority === "High") return "amber";
  if (priority === "Medium") return "blue";
  return "slate";
}

function MetricCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <Card className="p-4 shadow-none">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </Card>
  );
}

function AccountTable({ rows, onSelect }: { rows: Account[]; onSelect: (account: Account) => void }) {
  return (
    <Card className="overflow-hidden shadow-none">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>{["Account", "Type", "Location", "Specialties", "Fit", "Priority", "Stage", "Next action"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((account) => (
              <tr key={account.id} className="hover:bg-slate-50">
                <td className="px-4 py-3"><button className="font-semibold text-slate-950" onClick={() => onSelect(account)}>{account.name}</button><p className="text-xs text-slate-500">{account.website}</p></td>
                <td className="px-4 py-3">{account.accountType}</td>
                <td className="px-4 py-3">{account.headquarters}</td>
                <td className="px-4 py-3">{account.technicalSpecialties.join(", ")}</td>
                <td className="px-4 py-3"><Badge tone={scoreTone(account.fitScore)}>{account.fitScore}</Badge></td>
                <td className="px-4 py-3"><Badge tone={priorityTone(account.priority)}>{account.priority}</Badge></td>
                <td className="px-4 py-3">{account.stage}</td>
                <td className="px-4 py-3 text-slate-600">{account.nextFollowUpDate ? `Follow up ${account.nextFollowUpDate}` : "Research buyer"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AccountDrawer({ account, contacts, onClose, onCreateTask, onDraftEmail }: { account: Account | null; contacts: typeof fallbackContacts; onClose: () => void; onCreateTask: (account: Account) => void; onDraftEmail: (account: Account) => void }) {
  if (!account) return null;
  const accountContacts = contacts.filter((contact) => contact.accountId === account.id).slice(0, 6);
  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-slate-950/20" onClick={onClose} />
      <section className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account detail</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">{account.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{account.accountType} · {account.headquarters}</p>
          </div>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Fit score</p><p className="mt-1 text-xl font-semibold">{account.fitScore}</p></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Priority</p><p className="mt-1 text-xl font-semibold">{account.priority}</p></Card>
            <Card className="p-3 shadow-none"><p className="text-xs text-slate-500">Stage</p><p className="mt-1 text-sm font-semibold">{account.stage}</p></Card>
          </div>
          <section><h3 className="text-sm font-semibold">Pain point hypothesis</h3><p className="mt-2 text-sm leading-6 text-slate-600">{account.likelyPainPoints.join(". ")}.</p></section>
          <section><h3 className="text-sm font-semibold">Fit score explanation</h3><p className="mt-2 text-sm leading-6 text-slate-600">High fit comes from technical hiring focus, buyer clarity, contract hiring volume, and relevant industries.</p></section>
          <section><h3 className="text-sm font-semibold">Contacts</h3><div className="mt-3 space-y-2">{accountContacts.map((contact) => <div key={contact.id} className="rounded-lg border border-slate-200 p-3 text-sm"><span className="font-semibold">{contact.firstName} {contact.lastName}</span><span className="text-slate-500"> · {contact.title}</span></div>)}</div></section>
          <section><h3 className="text-sm font-semibold">Recommended pitch angle</h3><p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">{account.likelyPainPoints[0]}</p></section>
          <div className="grid gap-2 sm:grid-cols-3"><Button onClick={() => onCreateTask(account)}>Create Task</Button><Button variant="outline" onClick={() => onDraftEmail(account)}>Generate Message</Button><Button variant="outline">Move Stage</Button></div>
        </div>
      </section>
    </div>
  );
}

export function EmployeeOutreachDashboard({ section, search }: EmployeeOutreachDashboardProps) {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [accountType, setAccountType] = useState("All");
  const [stage, setStage] = useState("All");
  const [accounts, setAccounts] = useState(fallbackAccounts);
  const [contacts, setContacts] = useState(fallbackContacts);
  const [campaigns, setCampaigns] = useState(fallbackCampaigns);
  const [tasks, setTasks] = useState(fallbackTasks);
  const [messageTemplates, setMessageTemplates] = useState(fallbackMessageTemplates);
  const [pitchAngles, setPitchAngles] = useState(fallbackPitchAngles);
  const [apiStatus, setApiStatus] = useState("Connecting to Clario API...");
  const [draftMessage, setDraftMessage] = useState(generateEmailMessage(fallbackContacts[0], fallbackAccounts[0]));
  const [selectedComposerContactId, setSelectedComposerContactId] = useState(fallbackContacts[0]?.id ?? "");
  const [sourcingRuns, setSourcingRuns] = useState<SourcingRun[]>([]);
  const [csvText, setCsvText] = useState("");
  const [companyQueue, setCompanyQueue] = useState("");
  const [sourceName, setSourceName] = useState("Manual staffing-company source");
  const query = search.trim().toLowerCase();

  const loadOutreach = useCallback(async () => {
    try {
      const state = await fetchOutreachState();
      setAccounts(state.accounts);
      setContacts(state.contacts);
      setCampaigns(state.campaigns);
      setTasks(state.tasks);
      setMessageTemplates(state.messageTemplates);
      setPitchAngles(state.pitchAngles);
      const sourcing = await fetchSourcingRuns();
      setSourcingRuns(sourcing.runs);
      setSelectedComposerContactId((current) => current || state.contacts[0]?.id || "");
      setDraftMessage((current) => current || generateEmailMessage(state.contacts[0], state.accounts[0]));
      setApiStatus("Live backend connected");
    } catch (error) {
      setApiStatus(`Using local fallback data. Start npm run api to persist outreach. ${error instanceof Error ? error.message : ""}`.trim());
    }
  }, []);

  useEffect(() => {
    loadOutreach();
  }, [loadOutreach]);

  const draftAndLogOutreach = async (contactId: string, channel: "Email" | "LinkedIn" | "Follow-up" = "Email") => {
    try {
      const generated = await generateOutreachDraft({ contactId, channel });
      setDraftMessage(`${generated.subject ? `Subject: ${generated.subject}\n\n` : ""}${generated.body}`);
      const result = await logOutreachSend({ contactId, channel, subject: generated.subject, body: generated.body });
      await loadOutreach();
      setApiStatus(`${channel} outreach logged for ${result.contact.firstName} ${result.contact.lastName}`);
      if (channel === "Email") window.location.href = result.mailto;
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Could not draft outreach.");
    }
  };

  const createQuickAccount = async () => {
    const name = window.prompt("Staffing company name");
    if (!name) return;
    const website = window.prompt("Website or LinkedIn URL") || "";
    await createOutreachAccount({ name, website, accountType: "Staffing Company", technicalSpecialties: ["Contract staffing"], likelyPainPoints: ["Client-ready contractor shortlists"] });
    await loadOutreach();
  };

  const createQuickContact = async () => {
    const accountId = selectedAccount?.id || accounts[0]?.id;
    if (!accountId) return;
    const firstName = window.prompt("Contact first name");
    if (!firstName) return;
    const lastName = window.prompt("Contact last name") || "";
    const email = window.prompt("Contact email") || "";
    await createOutreachContact({ accountId, firstName, lastName, email, title: "Recruiting Manager", roleCategory: "Recruiting Manager" });
    await loadOutreach();
  };

  const completeTask = async (taskId: string) => {
    await updateOutreachTask(taskId, { status: "Completed" });
    await loadOutreach();
  };

  const importCsv = async () => {
    try {
      const result = await importSourcingCsv({ csvText, sourceName });
      await loadOutreach();
      setApiStatus(`Imported ${result.run.accountsCreated} accounts, updated ${result.run.accountsUpdated}, added ${result.run.contactsCreated} contacts`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "CSV import failed.");
    }
  };

  const queueCompaniesForResearch = async () => {
    const companies = companyQueue.split(/\n/).map((item) => item.trim()).filter(Boolean);
    if (!companies.length) return;
    const result = await createResearchQueue({ companies, sourceName: "Manual staffing company research" });
    await loadOutreach();
    setApiStatus(`Queued ${result.run.tasksCreated} company research tasks`);
  };

  const filteredAccounts = useMemo(() => accounts.filter((account) => {
    const matchesSearch = !query || [account.name, account.accountType, account.headquarters, account.owner, ...account.industriesServed, ...account.technicalSpecialties].some((value) => value.toLowerCase().includes(query));
    const matchesType = accountType === "All" || account.accountType === accountType;
    const matchesStage = stage === "All" || account.stage === stage;
    return matchesSearch && matchesType && matchesStage;
  }).sort((a, b) => b.fitScore - a.fitScore), [query, accountType, stage]);

  const filteredContacts = useMemo(() => contacts.filter((contact) => {
    const account = accounts.find((item) => item.id === contact.accountId);
    return !query || [contact.firstName, contact.lastName, contact.title, contact.roleCategory, account?.name ?? ""].some((value) => value.toLowerCase().includes(query));
  }), [query]);

  const leadQueue = useMemo(() => filteredContacts
    .map((contact) => ({ contact, account: accounts.find((account) => account.id === contact.accountId)! }))
    .filter((item) => item.account)
    .sort((a, b) => b.account.fitScore - a.account.fitScore)
    .slice(0, 30), [filteredContacts]);

  const accountTypeData = Object.entries(accounts.reduce<Record<string, number>>((acc, account) => ({ ...acc, [account.accountType]: (acc[account.accountType] ?? 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const pipelineData = Object.entries(accounts.reduce<Record<string, number>>((acc, account) => ({ ...acc, [account.stage]: (acc[account.stage] ?? 0) + 1 }), {})).map(([stageName, value]) => ({ stageName, value }));
  const roleData = Object.entries(contacts.reduce<Record<string, number>>((acc, contact) => ({ ...acc, [contact.roleCategory]: (acc[contact.roleCategory] ?? 0) + 1 }), {})).map(([role, value]) => ({ role, value }));

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Clario Employee Outreach Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{sectionTitles[section]}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Internal growth, sales, and partnership command center for staffing firms, recruiters, HR teams, employers, and talent partners.</p>
          <p className="mt-2 text-xs font-medium text-emerald-700">{apiStatus}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={createQuickAccount}><Plus className="h-4 w-4" /> Add Account</Button>
          <Button variant="outline" onClick={createQuickContact}><Users className="h-4 w-4" /> Add Contact</Button>
          <Button variant="outline" onClick={() => section === "research" ? document.getElementById("sourcing-csv")?.scrollIntoView({ behavior: "smooth", block: "center" }) : window.alert("Open Research in the employee sidebar to use the sourcing pipeline.")}><Upload className="h-4 w-4" /> Import CSV</Button>
          <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </section>

      {section === "outreach-dashboard" && (
        <div className="space-y-5">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total target accounts" value={accounts.length} helper="Mock CRM accounts" />
            <MetricCard label="HR contacts identified" value={contacts.filter((c) => c.roleCategory.includes("HR") || c.roleCategory.includes("Talent")).length} helper="Buyer contacts" />
            <MetricCard label="High-priority leads" value={accounts.filter((a) => a.priority === "High" || a.priority === "Strategic").length} helper="High or strategic" />
            <MetricCard label="Meetings booked" value={contacts.filter((c) => c.outreachStatus === "Meeting Booked").length} helper="Across segments" />
            <MetricCard label="Avg lead fit score" value={Math.round(accounts.reduce((sum, a) => sum + a.fitScore, 0) / accounts.length)} helper="Account fit" />
          </section>
          <section className="grid gap-4 xl:grid-cols-2">
            <Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Outreach pipeline</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="stageName" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
            <Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Accounts by type</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={accountTypeData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>{accountTypeData.map((entry, index) => <Cell key={entry.name} fill={["#111827", "#6b7280", "#9ca3af", "#d1d5db"][index % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></Card>
          </section>
          <AccountTable rows={filteredAccounts.slice(0, 10)} onSelect={setSelectedAccount} />
        </div>
      )}

      {section === "accounts" && (
        <div className="space-y-4">
          <Card className="p-3"><div className="grid gap-3 md:grid-cols-3"><select className="h-10 rounded-md border border-slate-200 px-3 text-sm" value={accountType} onChange={(event) => setAccountType(event.target.value)}><option>All</option>{[...new Set(accounts.map((a) => a.accountType))].map((type) => <option key={type}>{type}</option>)}</select><select className="h-10 rounded-md border border-slate-200 px-3 text-sm" value={stage} onChange={(event) => setStage(event.target.value)}><option>All</option>{[...new Set(accounts.map((a) => a.stage))].map((item) => <option key={item}>{item}</option>)}</select><div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 text-sm text-slate-500"><Search className="h-4 w-4" /> Global search filters this table</div></div></Card>
          <AccountTable rows={filteredAccounts} onSelect={setSelectedAccount} />
        </div>
      )}

      {section === "contacts" && (
        <Card className="overflow-hidden shadow-none"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Contact", "Account", "Role", "Status", "Priority", "Pitch angle", "Next follow-up"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y">{filteredContacts.slice(0, 80).map((contact) => { const account = accounts.find((item) => item.id === contact.accountId)!; return <tr key={contact.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-semibold">{contact.firstName} {contact.lastName}<p className="text-xs font-normal text-slate-500">{contact.email}</p></td><td className="px-4 py-3">{account.name}</td><td className="px-4 py-3">{contact.roleCategory}</td><td className="px-4 py-3"><Badge>{contact.outreachStatus}</Badge></td><td className="px-4 py-3"><Badge tone={priorityTone(calculateContactPriority(contact, account))}>{calculateContactPriority(contact, account)}</Badge></td><td className="px-4 py-3 text-slate-600">{contact.bestPitchAngle}</td><td className="px-4 py-3">{contact.nextFollowUpDate}</td></tr>; })}</tbody></table></Card>
      )}

      {section === "lead-queue" && (
        <div className="grid gap-4 xl:grid-cols-3">
          {leadQueue.slice(0, 24).map(({ contact, account }) => <Card key={contact.id} className="p-4 shadow-none"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{account.name}</h3><p className="mt-1 text-sm text-slate-500">{contact.firstName} {contact.lastName} · {contact.title}</p></div><Badge tone={scoreTone(account.fitScore)}>{account.fitScore}</Badge></div><p className="mt-3 text-sm leading-6 text-slate-600">{contact.bestPitchAngle}</p><div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{generateLinkedInMessage(contact, account)}</div><div className="mt-4 grid gap-2 sm:grid-cols-2"><Button onClick={() => draftAndLogOutreach(contact.id, "Email")}>Draft email</Button><Button variant="outline" onClick={() => draftAndLogOutreach(contact.id, "LinkedIn")}>Log LinkedIn</Button></div></Card>)}
        </div>
      )}

      {section === "campaigns" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_360px]"><Card className="overflow-hidden shadow-none"><table className="w-full text-left text-sm"><thead className="border-b bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Campaign", "Segment", "Status", "Sent", "Responses", "Meetings", "Rates"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y">{campaigns.map((campaign) => <tr key={campaign.id}><td className="px-4 py-3 font-semibold">{campaign.name}</td><td className="px-4 py-3">{campaign.segment}</td><td className="px-4 py-3"><Badge>{campaign.status}</Badge></td><td className="px-4 py-3">{campaign.messagesSent}</td><td className="px-4 py-3">{campaign.responses}</td><td className="px-4 py-3">{campaign.meetingsBooked}</td><td className="px-4 py-3">{campaign.responseRate}% / {campaign.meetingRate}%</td></tr>)}</tbody></table></Card><Card className="p-4"><h3 className="font-semibold">Campaign builder</h3><div className="mt-4 space-y-3"><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"><option>Staffing companies</option><option>HR leaders</option><option>Universities</option></select><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"><option>Staffing company founder intro</option><option>Technical recruiter feedback</option></select><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm"><option>Day 1, Day 4, Day 10</option></select><Button className="w-full">Create mock campaign</Button></div></Card></div>
      )}

      {section === "tasks" && (
        <div className="grid gap-4 xl:grid-cols-4">{["Open", "In Progress", "Completed", "Snoozed"].map((status) => <Card key={status} className="p-3 shadow-none"><h3 className="mb-3 text-sm font-semibold">{status}</h3><div className="space-y-3">{tasks.filter((task) => task.status === status).slice(0, 8).map((task) => <Card key={task.id} className="p-3 shadow-none"><div className="flex items-center justify-between"><p className="font-semibold">{task.type}</p><Badge tone={priorityTone(task.priority)}>{task.priority}</Badge></div><p className="mt-2 text-sm text-slate-600">{task.title}</p><p className="mt-2 text-xs text-slate-500">Due {task.dueDate} · {task.owner}</p>{task.status !== "Completed" && <Button className="mt-3 w-full" size="sm" variant="outline" onClick={() => completeTask(task.id)}>Mark done</Button>}</Card>)}</div></Card>)}</div>
      )}

      {section === "research" && (
        <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <Card className="p-4 shadow-none">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">CSV sourcing import</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Paste real staffing-company data from a spreadsheet, Apollo, Clay, manual research, or a CRM export. Rows with contacts create contacts; rows without contacts create research tasks.</p>
                </div>
                <Badge tone="green">Real data in</Badge>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-[240px_1fr]">
                <label className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-500">Source name</span>
                  <input className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400" value={sourceName} onChange={(event) => setSourceName(event.target.value)} />
                </label>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">Supported headers: company, website, location, contact first name, contact last name, title, email, linkedin, specialties, pain point, notes.</div>
              </div>
              <textarea id="sourcing-csv" className="mt-3 min-h-48 w-full rounded-md border border-slate-200 p-3 font-mono text-xs leading-5 outline-none focus:border-slate-400" value={csvText} onChange={(event) => setCsvText(event.target.value)} placeholder={"company,website,location,contact first name,contact last name,title,email,specialties,pain point\nYour Staffing Co,https://company.com,New York NY,Jane,Doe,Founder,jane@company.com,Data Engineering;AWS,Client-ready contractor shortlists"} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={importCsv}><Upload className="h-4 w-4" /> Import CSV</Button>
                <Button variant="outline" onClick={() => setCsvText("")}>Clear</Button>
              </div>
            </Card>

            <Card className="p-4 shadow-none">
              <h3 className="font-semibold">Manual research queue</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">Paste company names when you do not have verified contacts yet. Clario will create accounts and research tasks, not invented people.</p>
              <textarea className="mt-3 min-h-32 w-full rounded-md border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-slate-400" value={companyQueue} onChange={(event) => setCompanyQueue(event.target.value)} placeholder={"Paste one real staffing company per line\nCompany name\nAnother staffing company"} />
              <Button className="mt-3" variant="outline" onClick={queueCompaniesForResearch}>Queue research tasks</Button>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="border-slate-200 bg-slate-50 p-4 shadow-none">
              <h3 className="font-semibold">Pipeline status</h3>
              <div className="mt-3 space-y-3">
                {sourcingRuns.slice(0, 5).map((run) => (
                  <div key={run.id} className="rounded-md border border-slate-200 bg-white p-3 text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-950">{run.sourceName}</p>
                      <Badge>{run.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{run.type} · {new Date(run.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-600">{run.accountsCreated} created, {run.accountsUpdated} updated, {run.contactsCreated} contacts, {run.tasksCreated} tasks.</p>
                  </div>
                ))}
                {!sourcingRuns.length && <p className="text-sm leading-6 text-slate-600">No sourcing runs yet.</p>}
              </div>
            </Card>
            <Card className="border-slate-200 bg-slate-50 p-4 shadow-none">
              <h3 className="font-semibold">Enrichment connectors</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">The backend is ready for CSV/manual sourcing today. Apollo, Hunter, People Data Labs, or Clay can be added once API keys are configured.</p>
            </Card>
            <Card className="border-slate-200 bg-slate-50 p-4 shadow-none">
              <h3 className="font-semibold">Compliance note</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Only import contacts you are allowed to use for B2B outreach. The app logs drafts and follow-ups, but it does not send email without your explicit action.</p>
            </Card>
          </aside>
        </div>
      )}

      {section === "messages" && (
        <div className="grid gap-4 lg:grid-cols-[1fr_420px]"><div className="grid gap-4 md:grid-cols-2">{messageTemplates.map((template) => <Card key={template.id} className="p-4 shadow-none"><div className="flex items-start justify-between"><h3 className="font-semibold">{template.title}</h3><Badge>{template.channel}</Badge></div><p className="mt-2 text-xs text-slate-500">{template.category} · {template.responseRate}% response</p><p className="mt-3 text-sm leading-6 text-slate-600">{template.body}</p></Card>)}</div><Card className="p-4"><h3 className="font-semibold">Message composer</h3><div className="mt-4 space-y-3"><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" value={selectedComposerContactId} onChange={(event) => setSelectedComposerContactId(event.target.value)}>{contacts.slice(0, 40).map((contact) => <option key={contact.id} value={contact.id}>{contact.firstName} {contact.lastName}</option>)}</select><select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm">{pitchAngles.map((angle) => <option key={angle}>{angle}</option>)}</select><textarea className="min-h-40 w-full rounded-md border border-slate-200 p-3 text-sm" value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} /><div className="grid gap-2 sm:grid-cols-2"><Button onClick={() => draftAndLogOutreach(selectedComposerContactId, "Email")}><Mail className="h-4 w-4" /> Draft email</Button><Button variant="outline" onClick={() => draftAndLogOutreach(selectedComposerContactId, "LinkedIn")}><MessageSquare className="h-4 w-4" /> Log LinkedIn</Button><Button variant="outline" onClick={() => draftAndLogOutreach(selectedComposerContactId, "Follow-up")}>Follow-up</Button><Button variant="outline" onClick={() => setDraftMessage(generateMeetingRequest(contacts.find((contact) => contact.id === selectedComposerContactId) ?? contacts[0], accounts.find((account) => account.id === (contacts.find((contact) => contact.id === selectedComposerContactId) ?? contacts[0])?.accountId) ?? accounts[0]))}>Meeting</Button></div></div></Card></div>
      )}

      {section === "outreach-analytics" && (
        <div className="grid gap-4 xl:grid-cols-2"><Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Contacts by role</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={roleData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="role" tick={{ fontSize: 10 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#111827" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card><Card className="p-4"><h3 className="mb-4 text-sm font-semibold">Response rate by campaign</h3><div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={campaigns}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="segment" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="responseRate" fill="#6b7280" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></Card></div>
      )}

      {section === "outreach-settings" && (
        <div className="grid gap-4 lg:grid-cols-3"><Card className="p-4"><Building2 className="h-5 w-5 text-slate-500" /><h3 className="mt-3 font-semibold">CSV import</h3><p className="mt-2 text-sm leading-6 text-slate-600">Upload accounts, contacts, campaign membership, and CRM exports.</p><Button className="mt-4 w-full" variant="outline">Import CSV</Button></Card><Card className="p-4"><CalendarCheck className="h-5 w-5 text-slate-500" /><h3 className="mt-3 font-semibold">Follow-up rules</h3><p className="mt-2 text-sm leading-6 text-slate-600">Default cadence: day 1, day 4, day 10, day 21.</p><Button className="mt-4 w-full" variant="outline">Edit cadence</Button></Card><Card className="p-4"><Download className="h-5 w-5 text-slate-500" /><h3 className="mt-3 font-semibold">Export</h3><p className="mt-2 text-sm leading-6 text-slate-600">Export filtered accounts, contacts, tasks, and campaign results.</p><Button className="mt-4 w-full" variant="outline">Export CSV</Button></Card></div>
      )}

      <AccountDrawer account={selectedAccount} contacts={contacts} onClose={() => setSelectedAccount(null)} onCreateTask={(account) => window.alert(`Task queue is connected. Use Lead Queue to reach out to ${account.name}.`)} onDraftEmail={(account) => { const contact = contacts.find((item) => item.accountId === account.id); if (contact) draftAndLogOutreach(contact.id, "Email"); }} />
    </div>
  );
}
