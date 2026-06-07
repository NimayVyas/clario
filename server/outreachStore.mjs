import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "server", "data");
const dataFile = path.join(dataDir, "outreach-state.json");
let mutationQueue = Promise.resolve();

export const pitchAngles = [
  "Faster technical screening",
  "Better candidate quality",
  "Rate alignment",
  "Reduce underqualified submissions",
  "Client-ready contractor shortlists",
  "Recruiter productivity",
];

const today = "2026-06-07";

const seedAccounts = [
  ["acc-001", "Apex Staffing", "Staffing Company", "Washington, DC", ["Data Engineering", "AWS", "Python"], 94, "Strategic", "Ready for Outreach"],
  ["acc-002", "Northstar Talent", "IT Staffing Firm", "New York, NY", ["Java", "React", "Cloud"], 91, "Strategic", "Ready for Outreach"],
  ["acc-003", "BluePeak Recruiting", "Recruiting Agency", "Atlanta, GA", ["Analytics", "Snowflake", "SQL"], 88, "High", "Researching"],
  ["acc-004", "Harbor Workforce", "Staffing Company", "Chicago, IL", ["DevOps", "Kubernetes", "AWS"], 86, "High", "Contacted"],
  ["acc-005", "Vector Partners", "Consulting Firm", "Dallas, TX", ["Cybersecurity", "IAM", "FedRAMP"], 82, "High", "Ready for Outreach"],
  ["acc-006", "BrightPath Staffing", "IT Staffing Firm", "Charlotte, NC", ["Java", "Kafka", "Banking"], 89, "High", "Ready for Outreach"],
  ["acc-007", "Summit Recruiting", "Recruiting Agency", "Austin, TX", ["AI/ML", "Python", "MLOps"], 84, "High", "New"],
  ["acc-008", "Keystone Talent", "Staffing Company", "Remote US", ["React", "TypeScript", "Node.js"], 80, "Medium", "Nurture"],
].map(([id, name, accountType, headquarters, technicalSpecialties, fitScore, priority, stage], index) => ({
  id,
  name,
  accountType,
  website: `https://${String(name).toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`,
  headquarters,
  companySize: ["11-50", "51-200", "201-500", "501-1000"][index % 4],
  industriesServed: [["Finance", "Healthcare"], ["Government", "Cloud"], ["SaaS", "AI"], ["Retail", "Data"]][index % 4],
  technicalSpecialties,
  targetBuyer: "Founder / Recruiting Manager",
  estimatedContractHiringVolume: ["Medium", "High", "Very High"][index % 3],
  usesStaffingVendors: true,
  likelyPainPoints: [pitchAngles[index % pitchAngles.length], pitchAngles[(index + 2) % pitchAngles.length]],
  currentTools: ["LinkedIn Recruiter", "Bullhorn", "Greenhouse"].slice(0, (index % 3) + 1),
  leadSource: "Seeded Clario staffing target list",
  fitScore,
  priority,
  stage,
  owner: "Nimay",
  lastContactedDate: stage === "Contacted" ? "2026-06-06" : undefined,
  nextFollowUpDate: `2026-06-${String(8 + index).padStart(2, "0")}`,
  notes: "Staffing-company outreach target for Clario partnership development.",
  createdAt: today,
  updatedAt: today,
}));

const contactNames = [
  ["Alex", "Chen", "Founder", "Founder"],
  ["Morgan", "Patel", "Managing Partner", "Owner"],
  ["Taylor", "Johnson", "Recruiting Manager", "Recruiting Manager"],
  ["Jordan", "Smith", "Technical Recruiter", "Recruiter"],
  ["Casey", "Garcia", "Director of Talent", "Talent Acquisition"],
  ["Riley", "Lee", "Account Manager", "Account Manager"],
];

const seedContacts = seedAccounts.flatMap((account, accountIndex) =>
  [0, 1].map((offset) => {
    const [firstName, lastName, title, roleCategory] = contactNames[(accountIndex + offset) % contactNames.length];
    return {
      id: `con-${String(accountIndex * 2 + offset + 1).padStart(3, "0")}`,
      accountId: account.id,
      firstName,
      lastName,
      title,
      roleCategory,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${account.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`,
      phone: `(202) 555-${String(1100 + accountIndex * 17 + offset).slice(0, 4)}`,
      linkedinUrl: "Manual research required",
      location: account.headquarters,
      seniority: offset === 0 ? "Executive" : "Manager",
      department: "Recruiting",
      outreachStatus: account.stage === "Contacted" ? "Message Sent" : "Not Contacted",
      bestPitchAngle: account.likelyPainPoints[0],
      painPointHypothesis: account.likelyPainPoints[0],
      lastContactedDate: account.stage === "Contacted" ? "2026-06-06" : undefined,
      nextFollowUpDate: account.nextFollowUpDate,
      notes: "Suggested buyer for Clario staffing-company outreach.",
    };
  }),
);

const seedCampaigns = [
  {
    id: "camp-001",
    name: "Staffing Company Founder Outreach",
    segment: "Staffing companies",
    goal: "Book feedback calls and pilot conversations",
    status: "Active",
    contactsEnrolled: seedContacts.length,
    messagesSent: seedContacts.filter((contact) => contact.outreachStatus === "Message Sent").length,
    responses: 0,
    meetingsBooked: 0,
    responseRate: 0,
    meetingRate: 0,
    createdAt: today,
  },
];

const seedTasks = seedContacts.slice(0, 10).map((contact, index) => {
  const account = seedAccounts.find((item) => item.id === contact.accountId);
  return {
    id: `task-${String(index + 1).padStart(3, "0")}`,
    type: index % 2 === 0 ? "Email" : "LinkedIn Message",
    title: `Reach out to ${contact.firstName} ${contact.lastName}`,
    accountId: contact.accountId,
    contactId: contact.id,
    dueDate: `2026-06-${String(7 + index).padStart(2, "0")}`,
    priority: account?.priority ?? "Medium",
    status: "Open",
    owner: "Nimay",
    notes: `Recommended angle: ${contact.bestPitchAngle}.`,
  };
});

const seedMessageTemplates = [
  {
    id: "msg-001",
    category: "Staffing company founder",
    title: "Founder feedback intro",
    channel: "Email",
    body: "Hi [Name], I’m building Clario to help staffing firms screen technical contractors faster, align rates earlier, and submit stronger client-ready shortlists. Open to a quick feedback call?",
    responseRate: 22,
  },
  {
    id: "msg-002",
    category: "Technical recruiter",
    title: "Recruiter workflow intro",
    channel: "LinkedIn",
    body: "Hey [Name] - I’m building Clario for technical recruiters who need better resume parsing, rate alignment, and candidate shortlists. Would love your feedback.",
    responseRate: 18,
  },
  {
    id: "msg-003",
    category: "Follow-up",
    title: "No-response follow-up",
    channel: "Follow-up",
    body: "Hi [Name], quick follow-up on Clario. We’re helping staffing teams reduce underqualified submissions and move faster on contract tech roles.",
    responseRate: 12,
  },
];

function createSeedState() {
  return {
    accounts: seedAccounts,
    contacts: seedContacts,
    campaigns: seedCampaigns,
    tasks: seedTasks,
    messageTemplates: seedMessageTemplates,
    outreachEvents: [],
    sourcingRuns: [],
    pitchAngles,
  };
}

async function ensureState() {
  await mkdir(dataDir, { recursive: true });
  try {
    const state = JSON.parse(await readFile(dataFile, "utf8"));
    state.sourcingRuns ??= [];
    state.outreachEvents ??= [];
    return state;
  } catch {
    const state = createSeedState();
    await writeFile(dataFile, JSON.stringify(state, null, 2));
    return state;
  }
}

async function saveState(state) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(state, null, 2));
  return state;
}

function mutateState(mutator) {
  const operation = mutationQueue.then(async () => {
    const state = await ensureState();
    const result = await mutator(state);
    await saveState(state);
    return result;
  });
  mutationQueue = operation.catch(() => {});
  return operation;
}

function nextId(prefix, rows) {
  const max = rows.reduce((current, row) => {
    const value = Number(String(row.id).replace(`${prefix}-`, ""));
    return Number.isFinite(value) ? Math.max(current, value) : current;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function normalizeKey(value = "") {
  return String(value).trim().toLowerCase();
}

function splitList(value = "") {
  return String(value)
    .split(/[|;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCsv(text = "") {
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((header) => normalizeKey(header).replace(/[^a-z0-9]+/g, ""));
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function rowValue(row, names) {
  for (const name of names) {
    const value = row[normalizeKey(name).replace(/[^a-z0-9]+/g, "")];
    if (value) return value;
  }
  return "";
}

function inferAccountType(value = "") {
  if (/staff/i.test(value)) return "Staffing Company";
  if (/recruit/i.test(value)) return "Recruiting Agency";
  if (/consult/i.test(value)) return "Consulting Firm";
  return "Staffing Company";
}

function buildImportedAccount(row) {
  const name = rowValue(row, ["company", "company name", "account", "account name", "name"]);
  return {
    name,
    accountType: inferAccountType(`${name} ${rowValue(row, ["type", "account type"])}`),
    website: rowValue(row, ["website", "url", "domain", "linkedin company url"]),
    headquarters: rowValue(row, ["location", "headquarters", "city", "state"]) || "Unknown",
    companySize: rowValue(row, ["company size", "size"]) || "Unknown",
    industriesServed: splitList(rowValue(row, ["industries", "industries served"])),
    technicalSpecialties: splitList(rowValue(row, ["skills", "specialties", "technical specialties", "focus"])),
    targetBuyer: rowValue(row, ["target buyer", "buyer"]) || "Founder / Recruiting Manager",
    estimatedContractHiringVolume: rowValue(row, ["contract volume", "hiring volume"]) || "Unknown",
    likelyPainPoints: splitList(rowValue(row, ["pain points", "pain point", "pitch angle"])),
    leadSource: rowValue(row, ["source", "lead source"]) || "CSV import",
    notes: rowValue(row, ["notes", "note"]),
    fitScore: Number(rowValue(row, ["fit score", "score"])) || 76,
    priority: rowValue(row, ["priority"]) || "Medium",
  };
}

function buildImportedContact(row, accountId, account) {
  const fullName = rowValue(row, ["contact", "contact name", "person", "full name"]);
  const [fallbackFirstName = "", ...fallbackLast] = fullName.split(/\s+/);
  const title = rowValue(row, ["title", "job title", "role"]) || "Recruiting Manager";
  return {
    accountId,
    firstName: rowValue(row, ["first name", "firstname"]) || fallbackFirstName,
    lastName: rowValue(row, ["last name", "lastname"]) || fallbackLast.join(" "),
    title,
    roleCategory: /founder/i.test(title) ? "Founder" : /owner|partner/i.test(title) ? "Owner" : /account/i.test(title) ? "Account Manager" : /talent/i.test(title) ? "Talent Acquisition" : /recruit/i.test(title) ? "Recruiting Manager" : "Other",
    email: rowValue(row, ["email", "work email"]),
    phone: rowValue(row, ["phone", "mobile"]),
    linkedinUrl: rowValue(row, ["linkedin", "linkedin url", "person linkedin"]) || "Manual research required",
    location: rowValue(row, ["contact location", "location"]) || account.headquarters,
    seniority: rowValue(row, ["seniority"]) || "Unknown",
    department: rowValue(row, ["department"]) || "Recruiting",
    bestPitchAngle: rowValue(row, ["pitch angle", "pain point"]) || account.likelyPainPoints[0],
    painPointHypothesis: rowValue(row, ["pain point", "pitch angle"]) || account.likelyPainPoints[0],
    notes: rowValue(row, ["contact notes", "notes"]),
  };
}

export async function getOutreachState() {
  return ensureState();
}

export async function createAccount(input) {
  const state = await ensureState();
  const account = {
    id: nextId("acc", state.accounts),
    name: input.name || "New Staffing Account",
    accountType: input.accountType || "Staffing Company",
    website: input.website || "",
    headquarters: input.headquarters || "Remote US",
    companySize: input.companySize || "Unknown",
    industriesServed: input.industriesServed || [],
    technicalSpecialties: input.technicalSpecialties || [],
    targetBuyer: input.targetBuyer || "Founder / Recruiting Manager",
    estimatedContractHiringVolume: input.estimatedContractHiringVolume || "Unknown",
    usesStaffingVendors: true,
    likelyPainPoints: input.likelyPainPoints || ["Client-ready contractor shortlists"],
    currentTools: input.currentTools || [],
    leadSource: input.leadSource || "Manual entry",
    fitScore: input.fitScore || 70,
    priority: input.priority || "Medium",
    stage: "New",
    owner: input.owner || "Nimay",
    nextFollowUpDate: input.nextFollowUpDate || today,
    notes: input.notes || "",
    createdAt: today,
    updatedAt: today,
  };
  state.accounts.unshift(account);
  await saveState(state);
  return account;
}

export async function createContact(input) {
  const state = await ensureState();
  const account = state.accounts.find((item) => item.id === input.accountId);
  if (!account) throw new Error("Account not found");
  const contact = {
    id: nextId("con", state.contacts),
    accountId: input.accountId,
    firstName: input.firstName || "New",
    lastName: input.lastName || "Contact",
    title: input.title || "Recruiting Manager",
    roleCategory: input.roleCategory || "Recruiting Manager",
    email: input.email || "",
    phone: input.phone || "",
    linkedinUrl: input.linkedinUrl || "Manual research required",
    location: input.location || account.headquarters,
    seniority: input.seniority || "Manager",
    department: input.department || "Recruiting",
    outreachStatus: "Not Contacted",
    bestPitchAngle: input.bestPitchAngle || account.likelyPainPoints[0],
    painPointHypothesis: input.painPointHypothesis || account.likelyPainPoints[0],
    nextFollowUpDate: input.nextFollowUpDate || account.nextFollowUpDate,
    notes: input.notes || "",
  };
  state.contacts.unshift(contact);
  await saveState(state);
  return contact;
}

export async function importSourcingCsv({ csvText = "", sourceName = "CSV import" }) {
  const rows = parseCsv(csvText);
  if (!rows.length) throw new Error("CSV needs a header row and at least one company row.");
  return mutateState(async (state) => {
    const run = {
      id: nextId("src", state.sourcingRuns),
      type: "CSV_IMPORT",
      sourceName,
      status: "Completed",
      rowsReceived: rows.length,
      accountsCreated: 0,
      accountsUpdated: 0,
      contactsCreated: 0,
      tasksCreated: 0,
      notes: "Imported user-provided company/contact data. No contacts were invented.",
      createdAt: new Date().toISOString(),
    };

    for (const row of rows) {
      const imported = buildImportedAccount(row);
      if (!imported.name) continue;
      const existingAccount = state.accounts.find((account) => {
        const sameWebsite = imported.website && account.website && normalizeKey(account.website) === normalizeKey(imported.website);
        return sameWebsite || normalizeKey(account.name) === normalizeKey(imported.name);
      });
      let account = existingAccount;
      if (account) {
        Object.assign(account, {
          ...imported,
          technicalSpecialties: imported.technicalSpecialties.length ? imported.technicalSpecialties : account.technicalSpecialties,
          likelyPainPoints: imported.likelyPainPoints.length ? imported.likelyPainPoints : account.likelyPainPoints,
          leadSource: sourceName,
          updatedAt: today,
        });
        run.accountsUpdated += 1;
      } else {
        account = {
          id: nextId("acc", state.accounts),
          ...imported,
          industriesServed: imported.industriesServed,
          technicalSpecialties: imported.technicalSpecialties.length ? imported.technicalSpecialties : ["Contract staffing"],
          usesStaffingVendors: true,
          likelyPainPoints: imported.likelyPainPoints.length ? imported.likelyPainPoints : ["Client-ready contractor shortlists"],
          currentTools: [],
          stage: "Researching",
          owner: "Nimay",
          nextFollowUpDate: today,
          createdAt: today,
          updatedAt: today,
        };
        state.accounts.unshift(account);
        run.accountsCreated += 1;
      }

      const contactInput = buildImportedContact(row, account.id, account);
      const hasContact = contactInput.email || contactInput.linkedinUrl !== "Manual research required" || contactInput.firstName || contactInput.lastName;
      if (hasContact) {
        const existingContact = state.contacts.find((contact) => {
          const sameEmail = contactInput.email && contact.email && normalizeKey(contact.email) === normalizeKey(contactInput.email);
          const sameLinkedIn = contactInput.linkedinUrl !== "Manual research required" && contact.linkedinUrl && normalizeKey(contact.linkedinUrl) === normalizeKey(contactInput.linkedinUrl);
          return sameEmail || sameLinkedIn;
        });
        if (!existingContact) {
          state.contacts.unshift({
            id: nextId("con", state.contacts),
            ...contactInput,
            firstName: contactInput.firstName || "Unknown",
            lastName: contactInput.lastName || "Contact",
            outreachStatus: "Not Contacted",
            nextFollowUpDate: account.nextFollowUpDate,
          });
          run.contactsCreated += 1;
        }
      } else {
        state.tasks.unshift({
          id: nextId("task", state.tasks),
          type: "Research",
          title: `Find staffing buyer at ${account.name}`,
          accountId: account.id,
          contactId: "",
          dueDate: today,
          priority: account.priority,
          status: "Open",
          owner: "Nimay",
          notes: "Imported account has no verified contact. Research founder, owner, recruiting manager, or account manager.",
        });
        run.tasksCreated += 1;
      }
    }

    state.sourcingRuns.unshift(run);
    return { run, accounts: state.accounts, contacts: state.contacts, tasks: state.tasks };
  });
}

export async function createManualResearchRun({ companies = [], sourceName = "Manual research queue" }) {
  return mutateState(async (state) => {
    const run = {
      id: nextId("src", state.sourcingRuns),
      type: "MANUAL_RESEARCH",
      sourceName,
      status: "Completed",
      rowsReceived: companies.length,
      accountsCreated: 0,
      accountsUpdated: 0,
      contactsCreated: 0,
      tasksCreated: 0,
      notes: "Created research tasks from user-provided company names. No external scraping performed.",
      createdAt: new Date().toISOString(),
    };
    for (const company of companies) {
      const name = typeof company === "string" ? company : company.name;
      if (!name) continue;
      let account = state.accounts.find((item) => normalizeKey(item.name) === normalizeKey(name));
      if (!account) {
        account = {
          id: nextId("acc", state.accounts),
          name,
          accountType: "Staffing Company",
          website: typeof company === "object" ? company.website || "" : "",
          headquarters: typeof company === "object" ? company.location || "Unknown" : "Unknown",
          companySize: "Unknown",
          industriesServed: [],
          technicalSpecialties: ["Contract staffing"],
          targetBuyer: "Founder / Recruiting Manager",
          estimatedContractHiringVolume: "Unknown",
          usesStaffingVendors: true,
          likelyPainPoints: ["Client-ready contractor shortlists"],
          currentTools: [],
          leadSource: sourceName,
          fitScore: 70,
          priority: "Medium",
          stage: "Researching",
          owner: "Nimay",
          nextFollowUpDate: today,
          notes: "Queued for manual staffing-company contact research.",
          createdAt: today,
          updatedAt: today,
        };
        state.accounts.unshift(account);
        run.accountsCreated += 1;
      } else {
        run.accountsUpdated += 1;
      }
      state.tasks.unshift({
        id: nextId("task", state.tasks),
        type: "Research",
        title: `Find buyer contacts at ${account.name}`,
        accountId: account.id,
        contactId: "",
        dueDate: today,
        priority: account.priority,
        status: "Open",
        owner: "Nimay",
        notes: "Research LinkedIn/company site for founder, owner, recruiting manager, or account manager.",
      });
      run.tasksCreated += 1;
    }
    state.sourcingRuns.unshift(run);
    return { run, accounts: state.accounts, tasks: state.tasks };
  });
}

export async function getSourcingRuns() {
  const state = await ensureState();
  return state.sourcingRuns;
}

export function generateOutreachMessage(contact, account, { channel = "Email", pitchAngle } = {}) {
  const angle = pitchAngle || contact.bestPitchAngle || account.likelyPainPoints?.[0] || "client-ready contractor shortlists";
  if (channel === "LinkedIn") {
    return {
      subject: "",
      body: `Hey ${contact.firstName} - I’m building Clario to help staffing teams like ${account.name} with ${angle.toLowerCase()}. I’d love to learn how your team handles contract technical hiring today. Open to a quick feedback call?`,
    };
  }
  if (channel === "Follow-up") {
    return {
      subject: `Following up on Clario for ${account.name}`,
      body: `Hi ${contact.firstName},\n\nQuick follow-up on Clario. We’re helping staffing teams reduce underqualified submissions, align contractor rates earlier, and prepare client-ready shortlists faster.\n\nWorth a quick look for ${account.name}?\n\nBest,\nClario Team`,
    };
  }
  return {
    subject: `Quick idea for ${account.name}`,
    body: `Hi ${contact.firstName},\n\nI’m building Clario, a B2B AI hiring platform for contract technical talent. For staffing teams like ${account.name}, we help parse resumes, screen candidates, align rates, and create stronger client-ready shortlists.\n\nBased on your focus around ${account.technicalSpecialties.slice(0, 2).join(" and ") || "technical staffing"}, I thought ${angle.toLowerCase()} might be relevant.\n\nWould you be open to a short feedback call?\n\nBest,\nClario Team`,
  };
}

export async function generateMessage({ contactId, channel, pitchAngle }) {
  const state = await ensureState();
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) throw new Error("Contact not found");
  const account = state.accounts.find((item) => item.id === contact.accountId);
  if (!account) throw new Error("Account not found");
  return { contact, account, channel: channel || "Email", ...generateOutreachMessage(contact, account, { channel, pitchAngle }) };
}

export async function logOutreach({ contactId, channel = "Email", subject, body }) {
  const state = await ensureState();
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) throw new Error("Contact not found");
  const account = state.accounts.find((item) => item.id === contact.accountId);
  if (!account) throw new Error("Account not found");
  const message = body ? { subject: subject || `Quick idea for ${account.name}`, body } : generateOutreachMessage(contact, account, { channel });
  const event = {
    id: nextId("evt", state.outreachEvents),
    accountId: account.id,
    contactId: contact.id,
    channel,
    subject: message.subject,
    body: message.body,
    status: channel === "Email" ? "Drafted" : "Logged",
    createdAt: new Date().toISOString(),
    owner: "Nimay",
  };
  state.outreachEvents.unshift(event);
  contact.outreachStatus = channel === "LinkedIn" ? "Connection Sent" : "Message Sent";
  contact.lastContactedDate = today;
  contact.nextFollowUpDate = "2026-06-11";
  account.stage = "Contacted";
  account.lastContactedDate = today;
  account.nextFollowUpDate = "2026-06-11";
  account.updatedAt = today;
  const campaign = state.campaigns[0];
  if (campaign) campaign.messagesSent += 1;
  state.tasks.unshift({
    id: nextId("task", state.tasks),
    type: "Follow-Up",
    title: `Follow up with ${contact.firstName} ${contact.lastName}`,
    accountId: account.id,
    contactId: contact.id,
    dueDate: "2026-06-11",
    priority: account.priority,
    status: "Open",
    owner: "Nimay",
    notes: `Follow-up after ${channel} outreach.`,
  });
  await saveState(state);
  const mailto = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
  return { event, contact, account, mailto };
}

export async function updateTask(id, patch) {
  const state = await ensureState();
  const task = state.tasks.find((item) => item.id === id);
  if (!task) throw new Error("Task not found");
  Object.assign(task, patch);
  await saveState(state);
  return task;
}
