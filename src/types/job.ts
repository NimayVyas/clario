export type RemoteType = "Remote" | "Hybrid" | "Onsite";
export type ContractType = "W2" | "C2C" | "1099" | "Contract-to-Hire";
export type JobStatus = "New" | "Verified" | "Duplicate Risk" | "Expiring Soon";

export interface JobRole {
  id: string;
  title: string;
  company: string;
  vendor: string;
  location: string;
  state: string;
  remoteType: RemoteType;
  contractType: ContractType;
  contractLength: string;
  hourlyRateMin: number;
  hourlyRateMax: number;
  techStack: string[];
  description: string;
  source: string;
  sourceUrl: string;
  postedDate: string;
  expiresDate: string;
  transparencyScore: number;
  aiFitScore: number;
  duplicateRiskScore: number;
  status: JobStatus;
  redFlags: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

export interface RoleFilters {
  search?: string;
  remoteType?: RemoteType | "All";
  minRate?: number;
  techStack?: string;
  state?: string;
  source?: string;
  contractType?: ContractType | "All";
}
