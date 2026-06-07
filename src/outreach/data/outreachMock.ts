export type AccountType =
  | "Staffing Company"
  | "IT Staffing Firm"
  | "Recruiting Agency"
  | "Consulting Firm"
  | "Employer"
  | "HR Team"
  | "Contingent Workforce Team"
  | "University Career Center"
  | "Bootcamp"
  | "Talent Community"
  | "Partner Organization";

export type Priority = "Low" | "Medium" | "High" | "Strategic";
export type AccountStage = "New" | "Researching" | "Ready for Outreach" | "Contacted" | "Responded" | "Meeting Booked" | "Pilot Discussion" | "Closed Won" | "Closed Lost" | "Nurture";
export type RoleCategory = "Founder" | "Owner" | "Recruiter" | "Recruiting Manager" | "Account Manager" | "HR Leader" | "Talent Acquisition" | "Hiring Manager" | "Contingent Workforce" | "Procurement" | "University Career Services" | "Other";
export type OutreachStatus = "Not Contacted" | "Connection Sent" | "Message Sent" | "Responded" | "Meeting Booked" | "Not Interested" | "Nurture";

export interface Account {
  id: string;
  name: string;
  accountType: AccountType;
  website: string;
  headquarters: string;
  companySize: string;
  industriesServed: string[];
  technicalSpecialties: string[];
  targetBuyer: string;
  estimatedContractHiringVolume: string;
  usesStaffingVendors: boolean;
  likelyPainPoints: string[];
  currentTools: string[];
  leadSource: string;
  fitScore: number;
  priority: Priority;
  stage: AccountStage;
  owner: string;
  lastContactedDate?: string;
  nextFollowUpDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  title: string;
  roleCategory: RoleCategory;
  email: string;
  phone: string;
  linkedinUrl: string;
  location: string;
  seniority: string;
  department: string;
  outreachStatus: OutreachStatus;
  bestPitchAngle: string;
  painPointHypothesis: string;
  lastContactedDate?: string;
  nextFollowUpDate?: string;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  goal: string;
  status: "Draft" | "Active" | "Paused" | "Complete";
  contactsEnrolled: number;
  messagesSent: number;
  responses: number;
  meetingsBooked: number;
  responseRate: number;
  meetingRate: number;
  createdAt: string;
}

export interface OutreachTask {
  id: string;
  type: "Call" | "LinkedIn Message" | "Email" | "Follow-Up" | "Research" | "Meeting" | "Demo" | "Proposal";
  title: string;
  accountId: string;
  contactId: string;
  dueDate: string;
  priority: Priority;
  status: "Open" | "In Progress" | "Completed" | "Snoozed";
  owner: string;
  notes: string;
}

export interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  channel: "LinkedIn" | "Email" | "Follow-up";
  body: string;
  responseRate: number;
}

export const pitchAngles = [
  "Faster technical screening",
  "Better candidate quality",
  "Rate alignment",
  "Reduce underqualified submissions",
  "Build higher-quality contractor pool",
  "University talent pipeline",
  "Recruiter productivity",
  "Client-ready shortlists",
  "Structured resume intelligence",
  "Contractor availability tracking",
];

const accountTypes: AccountType[] = ["Staffing Company", "IT Staffing Firm", "Recruiting Agency", "Consulting Firm", "Employer", "HR Team", "Contingent Workforce Team", "University Career Center", "Bootcamp", "Talent Community", "Partner Organization"];
const stages: AccountStage[] = ["New", "Researching", "Ready for Outreach", "Contacted", "Responded", "Meeting Booked", "Pilot Discussion", "Nurture"];
const priorities: Priority[] = ["Low", "Medium", "High", "Strategic"];
const locations = ["Washington, DC", "New York, NY", "Atlanta, GA", "Chicago, IL", "Dallas, TX", "Charlotte, NC", "Austin, TX", "San Francisco, CA", "Seattle, WA", "Remote US"];
const specialties = [["Data Engineering", "Python", "AWS"], ["Cloud", "DevOps", "Kubernetes"], ["AI/ML", "Python", "RAG"], ["Cybersecurity", "IAM", "FedRAMP"], ["Java", "React", "Full-stack"], ["Snowflake", "Databricks", "Analytics"]];
const companyWords = ["Apex", "Northstar", "BluePeak", "Civic", "Harbor", "Orbit", "Summit", "Keystone", "BrightPath", "Vector", "Nexus", "Pioneer"];
const suffixes = ["Talent", "Staffing", "Recruiting", "Partners", "Cloud", "Analytics", "Systems", "Workforce", "Advisory", "Career Center"];

export const accounts: Account[] = Array.from({ length: 60 }, (_, index) => {
  const accountType = accountTypes[index % accountTypes.length];
  const spec = specialties[index % specialties.length];
  const fitScore = Math.min(98, 52 + (index % 10) * 4 + (accountType.includes("Staffing") || accountType.includes("Recruiting") ? 12 : 0));
  return {
    id: `acc-${String(index + 1).padStart(3, "0")}`,
    name: `${companyWords[index % companyWords.length]} ${suffixes[index % suffixes.length]}`,
    accountType,
    website: `https://example-${index + 1}.com`,
    headquarters: locations[index % locations.length],
    companySize: ["11-50", "51-200", "201-500", "501-1000", "1000+"][index % 5],
    industriesServed: [["Finance", "Healthcare"], ["Government", "Cloud"], ["SaaS", "AI"], ["Retail", "Data"], ["Education", "Workforce"]][index % 5],
    technicalSpecialties: spec,
    targetBuyer: accountType.includes("University") ? "Career Services Director" : accountType.includes("Employer") || accountType.includes("HR") ? "HR / Talent Acquisition Leader" : "Founder / Recruiting Manager",
    estimatedContractHiringVolume: ["Low", "Medium", "High", "Very High"][index % 4],
    usesStaffingVendors: index % 3 !== 0,
    likelyPainPoints: [pitchAngles[index % pitchAngles.length], pitchAngles[(index + 3) % pitchAngles.length]],
    currentTools: ["LinkedIn Recruiter", "Bullhorn", "Greenhouse"].slice(0, (index % 3) + 1),
    leadSource: ["Manual research", "CSV import", "Approved business directory", "Partner source", "LinkedIn manual research"][index % 5],
    fitScore,
    priority: fitScore >= 88 ? "Strategic" : fitScore >= 78 ? "High" : priorities[index % priorities.length],
    stage: stages[index % stages.length],
    owner: ["Nimay", "Maya", "Jordan", "Avery"][index % 4],
    lastContactedDate: index % 4 === 0 ? undefined : `2026-06-${String((index % 5) + 1).padStart(2, "0")}`,
    nextFollowUpDate: `2026-06-${String((index % 9) + 6).padStart(2, "0")}`,
    notes: "Mock CRM account for Clario internal outreach and partnership tracking.",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-06",
  };
});

const roleCategories: RoleCategory[] = ["Founder", "Owner", "Recruiter", "Recruiting Manager", "Account Manager", "HR Leader", "Talent Acquisition", "Hiring Manager", "Contingent Workforce", "Procurement", "University Career Services", "Other"];
const firstNames = ["Alex", "Morgan", "Taylor", "Jordan", "Casey", "Riley", "Jamie", "Avery", "Maya", "Drew", "Sam", "Priya"];
const lastNames = ["Chen", "Patel", "Johnson", "Smith", "Garcia", "Lee", "Brown", "Davis", "Wilson", "Martinez", "Nguyen", "Khan"];

export const contacts: Contact[] = Array.from({ length: 120 }, (_, index) => {
  const account = accounts[index % accounts.length];
  const roleCategory = roleCategories[index % roleCategories.length];
  return {
    id: `con-${String(index + 1).padStart(3, "0")}`,
    accountId: account.id,
    firstName: firstNames[index % firstNames.length],
    lastName: lastNames[(index + 3) % lastNames.length],
    title: roleCategory === "Founder" ? "Founder" : roleCategory === "Recruiter" ? "Technical Recruiter" : roleCategory,
    roleCategory,
    email: `contact${index + 1}@${account.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`,
    phone: `(202) 555-${String(1000 + index).slice(0, 4)}`,
    linkedinUrl: "Manual research only",
    location: account.headquarters,
    seniority: ["Executive", "Director", "Manager", "IC"][index % 4],
    department: roleCategory.includes("Recruit") ? "Recruiting" : roleCategory.includes("HR") ? "Human Resources" : "Operations",
    outreachStatus: ["Not Contacted", "Connection Sent", "Message Sent", "Responded", "Meeting Booked", "Nurture"][index % 6] as OutreachStatus,
    bestPitchAngle: pitchAngles[index % pitchAngles.length],
    painPointHypothesis: account.likelyPainPoints[0],
    lastContactedDate: index % 5 === 0 ? undefined : `2026-06-${String((index % 5) + 1).padStart(2, "0")}`,
    nextFollowUpDate: `2026-06-${String((index % 9) + 6).padStart(2, "0")}`,
    notes: "Suggested contact for Clario growth outreach.",
  };
});

export const campaigns: Campaign[] = [
  "Staffing Firm Founder Outreach",
  "Technical Recruiter Feedback Campaign",
  "HR Leader Pilot Campaign",
  "University Partnership Campaign",
  "Consulting Firm Contractor Hiring Campaign",
  "Cloud Staffing Partner Sprint",
  "Healthcare HR Contractor Pilot",
  "Government Contractor Vendor Outreach",
].map((name, index) => ({
  id: `camp-${index + 1}`,
  name,
  segment: ["Staffing companies", "Technical recruiters", "HR leaders", "Universities", "Consulting firms"][index % 5],
  goal: "Book feedback calls and pilot conversations",
  status: ["Active", "Draft", "Paused", "Complete"][index % 4] as Campaign["status"],
  contactsEnrolled: 18 + index * 7,
  messagesSent: 12 + index * 5,
  responses: 3 + index,
  meetingsBooked: 1 + Math.floor(index / 2),
  responseRate: 18 + index * 2,
  meetingRate: 7 + index,
  createdAt: "2026-06-01",
}));

export const tasks: OutreachTask[] = Array.from({ length: 40 }, (_, index) => {
  const account = accounts[index % accounts.length];
  const contact = contacts[index % contacts.length];
  return {
    id: `task-${String(index + 1).padStart(3, "0")}`,
    type: ["Call", "LinkedIn Message", "Email", "Follow-Up", "Research", "Meeting", "Demo", "Proposal"][index % 8] as OutreachTask["type"],
    title: `${index % 3 === 0 ? "Follow up with" : "Reach out to"} ${contact.firstName} ${contact.lastName}`,
    accountId: account.id,
    contactId: contact.id,
    dueDate: `2026-06-${String((index % 10) + 1).padStart(2, "0")}`,
    priority: account.priority,
    status: ["Open", "In Progress", "Completed", "Snoozed"][index % 4] as OutreachTask["status"],
    owner: account.owner,
    notes: `Recommended angle: ${contact.bestPitchAngle}.`,
  };
});

const baseTemplates = [
  ["Staffing company founder", "Hey [Name] - I’m building Clario, an AI platform that helps staffing firms screen technical candidates faster, align rates earlier, and submit stronger client-ready shortlists. Open to a quick 15-minute feedback call?"],
  ["Technical recruiter", "Hey [Name] - I’m building Clario to help technical recruiters parse resumes, screen candidates, check rate alignment, and know who is actually worth submitting to a client. I’d love your feedback."],
  ["HR leader", "Hey [Name] - I’m working on Clario, a B2B AI hiring platform that helps companies identify qualified, available, rate-aligned technical contractors faster. Would you be open to sharing how your team handles contractor hiring today?"],
  ["University career center", "Hey [Name] - I’m building Clario, a platform that helps companies discover screened, contract-ready technical talent. We’re exploring university partnerships for students and alumni."],
];

export const messageTemplates: MessageTemplate[] = Array.from({ length: 20 }, (_, index) => {
  const [category, body] = baseTemplates[index % baseTemplates.length];
  return {
    id: `msg-${String(index + 1).padStart(3, "0")}`,
    category,
    title: `${category} ${index % 2 === 0 ? "intro" : "follow-up"}`,
    channel: ["LinkedIn", "Email", "Follow-up"][index % 3] as MessageTemplate["channel"],
    body,
    responseRate: 12 + (index % 8) * 3,
  };
});
