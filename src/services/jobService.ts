import { baseMockJobs } from "../data/mockJobs";
import { JobRole, RoleFilters } from "../types/job";
import { detectDuplicateRisk } from "./duplicateService";
import { calculateAiFitScore, calculateTransparencyScore } from "./scoringService";

export function getRedFlags(job: Partial<JobRole>) {
  const flags: string[] = [];
  if (!job.company || job.company === "Confidential") flags.push("No client listed");
  if (!job.hourlyRateMin || !job.hourlyRateMax) flags.push("No rate listed");
  if (!job.description || job.description.length < 120) flags.push("Vague job description");
  if (!job.contractLength) flags.push("Contract length missing");
  if (job.vendor && (!job.company || job.company === "Confidential")) flags.push("Vendor-only posting");
  if ((job.duplicateRiskScore ?? 0) >= 70) flags.push("Duplicate risk is high");
  if (!job.sourceUrl) flags.push("Source URL missing");
  if (!job.contractType) flags.push("Contract type unclear");
  return flags;
}

function hydrateJobs(): JobRole[] {
  const withDuplicateScores = baseMockJobs.map((job) => ({
    ...job,
    duplicateRiskScore: detectDuplicateRisk(job, baseMockJobs),
  }));

  return withDuplicateScores.map((job) => {
    const transparencyScore = calculateTransparencyScore(job);
    const aiFitScore = calculateAiFitScore(job);
    const completeJob = { ...job, transparencyScore, aiFitScore, redFlags: [] };
    return { ...completeJob, redFlags: getRedFlags(completeJob) };
  });
}

const jobs = hydrateJobs();

export function getAllRoles() {
  return jobs;
}

export function getRoleById(id: string) {
  return jobs.find((job) => job.id === id);
}

export function filterRoles(filters: RoleFilters) {
  return jobs.filter((job) => {
    const query = filters.search?.trim().toLowerCase();
    const matchesSearch = !query || [job.title, job.company, job.vendor, job.location, ...job.techStack].some((value) => value.toLowerCase().includes(query));
    const matchesRemote = !filters.remoteType || filters.remoteType === "All" || job.remoteType === filters.remoteType;
    const matchesRate = !filters.minRate || job.hourlyRateMax >= filters.minRate;
    const matchesTech = !filters.techStack || filters.techStack === "All" || job.techStack.includes(filters.techStack);
    const matchesState = !filters.state || filters.state === "All" || job.state === filters.state;
    const matchesSource = !filters.source || filters.source === "All" || job.source === filters.source;
    const matchesContract = !filters.contractType || filters.contractType === "All" || job.contractType === filters.contractType;
    return matchesSearch && matchesRemote && matchesRate && matchesTech && matchesState && matchesSource && matchesContract;
  });
}
