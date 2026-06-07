import { JobRole } from "../types/job";
import { formatRateRange } from "../lib/utils";

function csvEscape(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportRolesToCsv(jobs: JobRole[]) {
  const headers = [
    "Title",
    "Client",
    "Vendor",
    "Location",
    "Remote Type",
    "Contract Type",
    "Contract Length",
    "Rate",
    "Tech Stack",
    "Posted Date",
    "Source",
    "Transparency Score",
    "AI Fit Score",
    "Duplicate Risk",
    "Status",
  ];

  const rows = jobs.map((job) => [
    job.title,
    job.company,
    job.vendor,
    job.location,
    job.remoteType,
    job.contractType,
    job.contractLength,
    formatRateRange(job.hourlyRateMin, job.hourlyRateMax),
    job.techStack.join("; "),
    job.postedDate,
    job.source,
    job.transparencyScore,
    job.aiFitScore,
    job.duplicateRiskScore,
    job.status,
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clario-roles-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
