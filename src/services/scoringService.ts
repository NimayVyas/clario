import { JobRole } from "../types/job";

const verifiedSources = new Set([
  "Partner Feed",
  "Company Career Pages",
  "LinkedIn-style feed",
  "Indeed-style feed",
  "Dice-style feed",
  "BuiltIn-style feed",
  "CSV Upload",
  "Manual Entry",
]);

export function calculateTransparencyScore(job: Partial<JobRole>) {
  let score = 0;
  if (job.hourlyRateMin && job.hourlyRateMax) score += 20;
  if (job.company && job.company !== "Confidential") score += 20;
  if (job.contractLength) score += 15;
  if (job.location && job.remoteType) score += 15;
  if ((job.description?.length ?? 0) > 120) score += 10;
  if (job.source && verifiedSources.has(job.source)) score += 10;
  if ((job.duplicateRiskScore ?? 0) < 65) score += 10;
  return Math.min(100, score);
}

export function calculateAiFitScore(job: Partial<JobRole>) {
  const avgRate = ((job.hourlyRateMin ?? 0) + (job.hourlyRateMax ?? 0)) / 2;
  const highDemand = ["Python", "AWS", "Spark", "React", "TypeScript", "Snowflake", "Kubernetes", "PyTorch", "Kafka"];
  const demandHits = job.techStack?.filter((skill) => highDemand.includes(skill)).length ?? 0;
  let score = 35;

  score += Math.min(20, Math.max(0, (avgRate - 55) / 4));
  score += Math.min(18, demandHits * 4);
  if ((job.contractLength ?? "").includes("12") || (job.contractLength ?? "").includes("18")) score += 10;
  if (job.remoteType === "Remote") score += 10;
  if ((job.description?.length ?? 0) > 180) score += 7;
  if (job.company && job.company !== "Confidential") score += 5;

  return Math.round(Math.min(100, score));
}

export function transparencyLabel(score: number) {
  if (score >= 80) return "High Transparency";
  if (score >= 60) return "Medium Transparency";
  return "Low Transparency";
}
