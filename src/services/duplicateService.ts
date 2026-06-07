import { JobRole } from "../types/job";

function overlap(a: string[] = [], b: string[] = []) {
  const set = new Set(a.map((item) => item.toLowerCase()));
  return b.filter((item) => set.has(item.toLowerCase())).length;
}

export function detectDuplicateRisk(job: Partial<JobRole>, allJobs: Partial<JobRole>[]) {
  const candidates = allJobs.filter((other) => other.id !== job.id);
  let highest = 0;

  for (const other of candidates) {
    let score = 0;
    if (other.sourceUrl && other.sourceUrl === job.sourceUrl) score += 45;
    if (other.title === job.title) score += 20;
    if (other.location === job.location) score += 12;
    if (other.vendor === job.vendor) score += 12;
    if (overlap(other.techStack, job.techStack) >= 3) score += 16;
    if (other.company === job.company) score += 12;
    if (other.description && job.description && other.description.slice(0, 80) === job.description.slice(0, 80)) score += 10;
    highest = Math.max(highest, score);
  }

  return Math.min(100, highest);
}
