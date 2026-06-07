export type SourceType = "COMPANY_CAREER_PAGE" | "STAFFING_SITE" | "JOB_BOARD" | "PROCUREMENT_PORTAL" | "MANUAL_UPLOAD";
export type InternalStatus = "NEW" | "REVIEWED" | "QUEUED_FOR_OUTREACH" | "CONTACTED" | "IN_CONVERSATION" | "PARTNERED" | "REJECTED" | "ARCHIVED";
export type LeadStatus = "NEW" | "RESEARCHED" | "QUEUED" | "CONTACTED" | "RESPONDED" | "CALL_BOOKED" | "PARTNERED" | "NOT_A_FIT";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "CONTACTED" | "FOLLOW_UP_NEEDED" | "CALL_BOOKED" | "PARTNERED" | "NOT_A_FIT";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface InternalJobRole {
  id: string;
  title: string;
  companyName: string;
  companyWebsite: string;
  jobUrl: string;
  sourceName: string;
  sourceType: SourceType;
  location: string;
  remoteType: "REMOTE" | "HYBRID" | "ONSITE" | "UNKNOWN";
  employmentType: "CONTRACT" | "CONTRACT_TO_HIRE" | "FULL_TIME" | "UNKNOWN";
  duration: string;
  payRateMin?: number;
  payRateMax?: number;
  billRateEstimate?: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  seniority: string;
  industry: string;
  postedDate: string;
  discoveredAt: string;
  status: InternalStatus;
  roleDifficultyScore: number;
  partnershipScore: number;
  urgencyScore: number;
  notes: string;
}

export interface CompanyIntel {
  id: string;
  name: string;
  website: string;
  industry: string;
  headquarters: string;
  careersUrl: string;
  contactPageUrl: string;
  procurementUrl?: string;
  vendorPageUrl?: string;
  isStaffingCompany: boolean;
  isDirectEmployer: boolean;
  isGovernmentContractor: boolean;
  knownVmsOrMsp?: string;
  partnershipFitScore: number;
  notes: string;
}

export interface Lead {
  id: string;
  companyId: string;
  companyName: string;
  website: string;
  type: "STAFFING_COMPANY" | "DIRECT_EMPLOYER";
  specialization?: string;
  locations?: string;
  targetRoles: string[];
  publicContactPage?: string;
  publicPhone?: string;
  publicGenericEmail?: string;
  openContractRolesCount?: number;
  targetDepartments?: string[];
  likelyPainPoint: string;
  partnershipAngle: string;
  leadScore: number;
  status: LeadStatus;
  nextFollowUpAt: string;
  notes: string;
}

export interface OutreachTask {
  id: string;
  leadType: "STAFFING_COMPANY" | "DIRECT_EMPLOYER" | "ROLE_SPECIFIC";
  leadName: string;
  relatedJobRoleId?: string;
  relatedCompanyId?: string;
  taskType: "COLD_EMAIL" | "COLD_CALL" | "LINKEDIN_MANUAL" | "DEMO_PREP" | "FOLLOW_UP" | "RESEARCH";
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  callScript: string;
  emailDraft: string;
  demoNotes: string;
  researchSummary: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

const descriptions = {
  data: "Long-term contract role building production data pipelines with Python, SQL, Spark, Databricks, and AWS. Immediate need, high business visibility, and repeated data platform work.",
  cloud: "Contract cloud engineering role focused on AWS, Terraform, Kubernetes, CI/CD, monitoring, and secure infrastructure automation for production systems.",
  ai: "Contract AI engineering role building retrieval workflows, model evaluation, Python services, and applied AI prototypes for internal product teams.",
  cyber: "Contract cybersecurity role supporting IAM, cloud security controls, vulnerability management, and audit readiness for regulated environments.",
};

export const internalJobs = [
  ["ij-001", "AWS Data Engineer", "Northstar Analytics", "https://northstar-demo.example", "https://northstar-demo.example/careers/aws-data-engineer", "Northstar Careers", "COMPANY_CAREER_PAGE", "Washington, DC", "HYBRID", "CONTRACT", "12 months", 82, 108, 128, descriptions.data, ["Python", "SQL", "AWS", "Spark"], ["Databricks", "Airflow"], "Senior", "Financial Services", "2026-06-04", "2026-06-04", "NEW", 86, 91, 82, "Repeated data roles and public vendor page."],
  ["ij-002", "PySpark Developer", "BluePeak Talent", "https://bluepeak-talent.example", "https://bluepeak-talent.example/jobs/pyspark-contract", "BluePeak Jobs", "STAFFING_SITE", "Remote US", "REMOTE", "CONTRACT", "9 months", 70, 92, 112, descriptions.data + " Our client needs immediate support.", ["PySpark", "Python", "SQL"], ["Snowflake"], "Mid", "Staffing", "2026-06-03", "2026-06-04", "QUEUED_FOR_OUTREACH", 78, 88, 76, "Staffing source language says our client."],
  ["ij-003", "AI Engineer", "CivicCloud Systems", "https://civiccloud-demo.example", "https://civiccloud-demo.example/jobs/ai-engineer", "CivicCloud Careers", "COMPANY_CAREER_PAGE", "Arlington, VA", "HYBRID", "CONTRACT_TO_HIRE", "6 months", 98, 130, 154, descriptions.ai, ["Python", "RAG", "AWS"], ["LangChain", "Evaluation"], "Senior", "SaaS", "2026-06-04", "2026-06-04", "REVIEWED", 91, 84, 79, "Strong demo candidate for direct partnership."],
  ["ij-004", "Cloud Security Engineer", "Harbor Federal Tech", "https://harborfed-demo.example", "https://harborfed-demo.example/procurement/cloud-security", "Public Procurement Portal", "PROCUREMENT_PORTAL", "Reston, VA", "ONSITE", "CONTRACT", "18 months", 92, 118, 140, descriptions.cyber, ["Cybersecurity", "AWS", "IAM"], ["FedRAMP", "Splunk"], "Senior", "Government Contractor", "2026-06-02", "2026-06-04", "NEW", 89, 86, 74, "Government contractor with procurement page."],
  ["ij-005", "React Contract Developer", "Orbit Retail Labs", "https://orbit-retail.example", "https://orbit-retail.example/careers/react-contract", "Manual CSV", "MANUAL_UPLOAD", "Chicago, IL", "REMOTE", "CONTRACT", "6 months", 62, 84, 100, descriptions.cloud, ["React", "TypeScript", "Node.js"], ["GraphQL"], "Mid", "Retail", "2026-06-01", "2026-06-04", "CONTACTED", 62, 67, 58, "Useful role but lower partnership fit."],
].map(([id, title, companyName, companyWebsite, jobUrl, sourceName, sourceType, location, remoteType, employmentType, duration, payRateMin, payRateMax, billRateEstimate, description, requiredSkills, preferredSkills, seniority, industry, postedDate, discoveredAt, status, roleDifficultyScore, partnershipScore, urgencyScore, notes]) => ({
  id,
  title,
  companyName,
  companyWebsite,
  jobUrl,
  sourceName,
  sourceType,
  location,
  remoteType,
  employmentType,
  duration,
  payRateMin,
  payRateMax,
  billRateEstimate,
  description,
  requiredSkills,
  preferredSkills,
  seniority,
  industry,
  postedDate,
  discoveredAt,
  status,
  roleDifficultyScore,
  partnershipScore,
  urgencyScore,
  notes,
})) as InternalJobRole[];

export const companies: CompanyIntel[] = [
  { id: "co-001", name: "Northstar Analytics", website: "https://northstar-demo.example", industry: "Financial Services", headquarters: "Washington, DC", careersUrl: "https://northstar-demo.example/careers", contactPageUrl: "https://northstar-demo.example/contact", procurementUrl: "https://northstar-demo.example/vendors", isStaffingCompany: false, isDirectEmployer: true, isGovernmentContractor: false, knownVmsOrMsp: "Fieldglass", partnershipFitScore: 91, notes: "Repeated data/cloud contract roles with public vendor page." },
  { id: "co-002", name: "BluePeak Talent", website: "https://bluepeak-talent.example", industry: "IT Staffing", headquarters: "New York, NY", careersUrl: "https://bluepeak-talent.example/jobs", contactPageUrl: "https://bluepeak-talent.example/contact", isStaffingCompany: true, isDirectEmployer: false, isGovernmentContractor: false, partnershipFitScore: 88, notes: "Data/cloud staffing firm with hard-to-fill contract roles." },
  { id: "co-003", name: "CivicCloud Systems", website: "https://civiccloud-demo.example", industry: "SaaS", headquarters: "Arlington, VA", careersUrl: "https://civiccloud-demo.example/jobs", contactPageUrl: "https://civiccloud-demo.example/contact", vendorPageUrl: "https://civiccloud-demo.example/procurement", isStaffingCompany: false, isDirectEmployer: true, isGovernmentContractor: true, partnershipFitScore: 84, notes: "Contract-to-hire AI and cloud roles." },
];

export const leads: Lead[] = [
  { id: "sl-001", companyId: "co-002", companyName: "BluePeak Talent", website: "https://bluepeak-talent.example", type: "STAFFING_COMPANY", specialization: "Data/cloud staffing", locations: "National", targetRoles: ["PySpark Developer", "AWS Data Engineer"], publicContactPage: "https://bluepeak-talent.example/contact", publicPhone: "Public main line", publicGenericEmail: "partnerships@bluepeak-talent.example", likelyPainPoint: "Hard-to-fill data roles and candidate quality pressure.", partnershipAngle: "Clario can source and screen stronger data/cloud candidates while BluePeak keeps the client relationship.", leadScore: 88, status: "QUEUED", nextFollowUpAt: "2026-06-06", notes: "High-fit staffing partnership demo." },
  { id: "dl-001", companyId: "co-001", companyName: "Northstar Analytics", website: "https://northstar-demo.example", type: "DIRECT_EMPLOYER", targetRoles: ["AWS Data Engineer", "Snowflake Developer"], openContractRolesCount: 4, targetDepartments: ["Data Platform", "Analytics"], publicContactPage: "https://northstar-demo.example/contact", likelyPainPoint: "Repeated contract data hiring and vendor quality issues.", partnershipAngle: "Clario helps reduce weak submissions and shorten contract data hiring cycles.", leadScore: 91, status: "RESEARCHED", nextFollowUpAt: "2026-06-05", notes: "Use vendor page angle." },
  { id: "dl-002", companyId: "co-003", companyName: "CivicCloud Systems", website: "https://civiccloud-demo.example", type: "DIRECT_EMPLOYER", targetRoles: ["AI Engineer", "Cloud Engineer"], openContractRolesCount: 3, targetDepartments: ["Product AI", "Platform"], publicContactPage: "https://civiccloud-demo.example/contact", likelyPainPoint: "Applied AI hiring is slow and noisy.", partnershipAngle: "Clario can rank AI contractor shortlists with screening notes before submission.", leadScore: 84, status: "NEW", nextFollowUpAt: "2026-06-07", notes: "Good 10-minute demo target." },
];

export const outreachTasks: OutreachTask[] = [
  { id: "ot-001", leadType: "DIRECT_EMPLOYER", leadName: "Northstar Analytics", relatedJobRoleId: "ij-001", relatedCompanyId: "co-001", taskType: "COLD_CALL", priority: "URGENT", status: "TODO", dueDate: "2026-06-05", callScript: "Hey, this is [Name] from Clario. We help companies hiring contract data, cloud, and AI talent reduce weak submissions and get qualified shortlists faster. I noticed your team has several open contract roles in data engineering. Are you open to a 10-minute demo?", emailDraft: "Subject: Faster shortlists for contract data hiring\n\nHi [Name],\n\nI’m with Clario. We help teams hiring contract data and cloud talent reduce weak submissions and identify qualified candidates faster using transparent AI-assisted sourcing and ranking.\n\nWould you be open to a quick 10-minute demo?\n\nBest,\n[Employee Name]", demoNotes: "Show role scoring, candidate ranking, and vendor-quality workflow.", researchSummary: "Multiple contract data roles and public vendor page.", nextFollowUpAt: "2026-06-07" },
  { id: "ot-002", leadType: "STAFFING_COMPANY", leadName: "BluePeak Talent", relatedJobRoleId: "ij-002", relatedCompanyId: "co-002", taskType: "COLD_EMAIL", priority: "HIGH", status: "IN_PROGRESS", dueDate: "2026-06-05", callScript: "Hey, this is [Name] from Clario. We help staffing teams source and screen stronger candidates for hard-to-fill contract tech roles.", emailDraft: "Subject: Possible sourcing partnership for contract tech roles\n\nHi [Name],\n\nI’m building Clario, an AI-assisted sourcing and screening platform for contract data, cloud, and AI roles. We help staffing teams create stronger qualified shortlists faster while your firm keeps the client relationship.\n\nWould you be open to testing Clario on one hard-to-fill role?\n\nBest,\n[Employee Name]", demoNotes: "Pitch lightweight delivery partnership.", researchSummary: "Staffing source with repeated data roles.", nextFollowUpAt: "2026-06-06" },
];

export const sources = [
  { id: "src-001", name: "Northstar Careers", url: "https://northstar-demo.example/careers", type: "COMPANY_CAREER_PAGE", enabled: true, crawlFrequencyHours: 24, lastRunStatus: "SUCCESS", notes: "Public careers page. Respect robots and rate limits." },
  { id: "src-002", name: "BluePeak Jobs", url: "https://bluepeak-talent.example/jobs", type: "STAFFING_SITE", enabled: true, crawlFrequencyHours: 12, lastRunStatus: "PARTIAL", notes: "Staffing site. Visible public pages only." },
  { id: "src-003", name: "CSV Upload", url: "manual://csv", type: "CSV_IMPORT", enabled: true, crawlFrequencyHours: 0, lastRunStatus: "SUCCESS", notes: "Employee-provided role imports." },
];
