import { InternalJobRole, Lead, OutreachTask, Priority } from "../data/intelligenceSeed";

const hardSkills = ["Python", "PySpark", "Snowflake", "Databricks", "AWS", "Cybersecurity", "AI", "RAG", "Aladdin", "Kubernetes"];

export function calculateRoleDifficultyScore(job: Pick<InternalJobRole, "requiredSkills" | "seniority" | "description">) {
  const skillScore = job.requiredSkills.filter((skill) => hardSkills.some((hard) => skill.toLowerCase().includes(hard.toLowerCase()))).length * 10;
  const seniorityScore = job.seniority.toLowerCase().includes("senior") ? 18 : 8;
  const urgencyScore = /urgent|immediate|asap|backfill|long-term/i.test(job.description) ? 16 : 4;
  return Math.min(100, 30 + skillScore + seniorityScore + urgencyScore);
}

export function calculatePartnershipScore(job: InternalJobRole, similarRoleCount = 1) {
  let score = 20;
  if (job.employmentType === "CONTRACT" || job.employmentType === "CONTRACT_TO_HIRE") score += 22;
  if (job.sourceType === "STAFFING_SITE") score += 18;
  if (similarRoleCount >= 3) score += 16;
  if (job.requiredSkills.some((skill) => hardSkills.includes(skill))) score += 14;
  if (job.companyWebsite || job.jobUrl) score += 10;
  return Math.min(100, score);
}

export function calculateUrgencyScore(job: InternalJobRole) {
  let score = 35;
  if (/urgent|immediate|asap|backfill|long-term contract/i.test(job.description)) score += 30;
  if (job.postedDate >= "2026-06-03") score += 18;
  if (job.employmentType === "CONTRACT") score += 12;
  return Math.min(100, score);
}

export function classifyOpportunity(job: InternalJobRole) {
  const staffingSignals = /our client|w2 contract|c2c|vendor|implementation partner|staffing|recruiting|talent|workforce/i;
  if (job.sourceType === "STAFFING_SITE" || staffingSignals.test(`${job.description} ${job.companyName}`)) return "STAFFING_COMPANY";
  return "DIRECT_EMPLOYER";
}

export function priorityFromScores(partnershipScore: number, urgencyScore: number): Priority {
  if (partnershipScore >= 85 && urgencyScore >= 75) return "URGENT";
  if (partnershipScore >= 75) return "HIGH";
  if (partnershipScore >= 60) return "MEDIUM";
  return "LOW";
}

export function topPartnershipOpportunities(jobs: InternalJobRole[], leads: Lead[]) {
  return [...jobs.map((job) => ({ id: job.id, name: job.companyName, type: classifyOpportunity(job), score: job.partnershipScore, note: job.title })),
    ...leads.map((lead) => ({ id: lead.id, name: lead.companyName, type: lead.type, score: lead.leadScore, note: lead.partnershipAngle }))]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function groupTasksByStatus(tasks: OutreachTask[]) {
  return tasks.reduce<Record<string, OutreachTask[]>>((acc, task) => {
    acc[task.status] = [...(acc[task.status] ?? []), task];
    return acc;
  }, {});
}
