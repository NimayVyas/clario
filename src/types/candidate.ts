export interface CandidateExperience {
  title: string;
  company: string;
  years?: string;
}

export interface CandidateProfile {
  email: string;
  resumeFileName: string;
  yearsOfExperience?: number;
  skills: string[];
  college?: string;
  gpa?: string;
  positions: CandidateExperience[];
  preferredRoles: string[];
}
