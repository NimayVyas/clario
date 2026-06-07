import { CandidateProfile } from "../types/candidate";
import { JobRole } from "../types/job";

const knownSkills = [
  "Python",
  "SQL",
  "AWS",
  "Azure",
  "GCP",
  "React",
  "TypeScript",
  "Java",
  "Spring Boot",
  "Spark",
  "PySpark",
  "Snowflake",
  "Databricks",
  "Kafka",
  "Tableau",
  "Power BI",
  "Kubernetes",
  "Terraform",
  "Node.js",
  "PostgreSQL",
  "Airflow",
  "dbt",
  "Machine Learning",
  "PyTorch",
  "TensorFlow",
];

const roleKeywords = [
  "Data Engineer",
  "Software Engineer",
  "Python Developer",
  "React Developer",
  "Java Backend Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Analyst",
  "Business Intelligence Developer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Snowflake Developer",
  "ETL Developer",
];

function extractSkills(text: string) {
  const lower = text.toLowerCase();
  return knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));
}

function extractYears(text: string) {
  const direct = text.match(/(\d{1,2})\+?\s*(?:years|yrs)/i);
  if (direct) return Number(direct[1]);
  const years = [...text.matchAll(/\b(20\d{2}|19\d{2})\b/g)].map((match) => Number(match[1]));
  if (years.length >= 2) return Math.max(1, Math.min(25, new Date().getFullYear() - Math.min(...years)));
  return undefined;
}

function extractCollege(text: string) {
  const match = text.match(/([A-Z][A-Za-z .&-]+(?:University|College|Institute|School))/);
  return match?.[1]?.trim();
}

function extractGpa(text: string) {
  const match = text.match(/GPA[:\s]+([0-4](?:\.\d{1,2})?)/i);
  return match?.[1];
}

function extractPositions(text: string) {
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const positions = lines.flatMap((line) => {
    const title = roleKeywords.find((role) => line.toLowerCase().includes(role.toLowerCase()));
    if (!title) return [];
    const companyMatch = line.match(/(?:at|@|-|,)\s*([A-Z][A-Za-z0-9 .&-]{2,})/);
    return [{ title, company: companyMatch?.[1]?.trim() ?? "Previous company" }];
  });
  return positions.slice(0, 8);
}

export function parseResumeText(text: string, email: string, resumeFileName: string): CandidateProfile {
  const skills = extractSkills(text);
  const positions = extractPositions(text);
  return {
    email,
    resumeFileName,
    yearsOfExperience: extractYears(text),
    skills: skills.length ? skills : ["Python", "SQL", "AWS", "React"],
    college: extractCollege(text),
    gpa: extractGpa(text),
    positions: positions.length ? positions : [
      { title: "Data Engineer", company: "Previous company" },
      { title: "Software Engineer", company: "Previous company" },
    ],
    preferredRoles: roleKeywords.filter((role) => text.toLowerCase().includes(role.toLowerCase())).slice(0, 4),
  };
}

export function parseMockResume(email: string, resumeFileName: string): CandidateProfile {
  return {
    email,
    resumeFileName,
    yearsOfExperience: 5,
    skills: ["Python", "SQL", "AWS", "Spark", "React", "Tableau"],
    college: "University of Maryland",
    gpa: "3.7",
    positions: [
      { title: "Data Engineer", company: "Capital One", years: "2022-2026" },
      { title: "Analytics Engineer", company: "Deloitte", years: "2020-2022" },
      { title: "Data Analyst", company: "Accenture", years: "2019-2020" },
    ],
    preferredRoles: ["Data Engineer", "AWS Data Engineer", "Python Developer", "Business Intelligence Developer"],
  };
}

export function scoreJobForCandidate(job: JobRole, profile?: CandidateProfile) {
  if (!profile) return job.aiFitScore;
  const skillHits = job.techStack.filter((skill) => profile.skills.some((candidateSkill) => candidateSkill.toLowerCase() === skill.toLowerCase())).length;
  const roleHit = profile.preferredRoles.some((role) => job.title.toLowerCase().includes(role.toLowerCase().replace(" developer", "").replace(" engineer", "")));
  const experienceBoost = (profile.yearsOfExperience ?? 0) >= 4 ? 8 : 0;
  return Math.min(99, Math.round(job.aiFitScore * 0.55 + skillHits * 8 + (roleHit ? 12 : 0) + experienceBoost));
}
