const hardSkillPattern = /\b(Python|SQL|AWS|PySpark|Snowflake|Databricks|Java|React|Cybersecurity|AI|ML|Kubernetes|Terraform|Spark|Node\.js|TypeScript)\b/gi;

function textFromHtml(html = "") {
  return String(html)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueSkills(text = "") {
  return [...new Set([...String(text).matchAll(hardSkillPattern)].map((match) => match[1]))];
}

function inferEmploymentType(text = "") {
  if (/contract[\s-]?to[\s-]?hire|cth/i.test(text)) return "CONTRACT_TO_HIRE";
  if (/contract|w2|c2c|1099/i.test(text)) return "CONTRACT";
  if (/full[\s-]?time/i.test(text)) return "FULL_TIME";
  return "UNKNOWN";
}

function inferRemoteType(text = "") {
  if (/remote/i.test(text)) return "REMOTE";
  if (/hybrid/i.test(text)) return "HYBRID";
  if (/onsite|on-site/i.test(text)) return "ONSITE";
  return "UNKNOWN";
}

function scoreRole(description, skills, employmentType) {
  const roleDifficultyScore = Math.min(100, 35 + skills.length * 8 + (/senior|principal|lead/i.test(description) ? 14 : 0));
  const urgencyScore = Math.min(100, 35 + (/urgent|immediate|asap|backfill|long-term/i.test(description) ? 32 : 0) + (employmentType.includes("CONTRACT") ? 10 : 0));
  const partnershipScore = Math.min(100, 25 + (employmentType.includes("CONTRACT") ? 25 : 0) + skills.length * 6);
  return { roleDifficultyScore, urgencyScore, partnershipScore };
}

function normalizeJob({ title, companyName, jobUrl, location, description, sourceName, sourceType, postedDate }) {
  const plain = textFromHtml(description);
  const skills = uniqueSkills(`${title} ${plain}`);
  const employmentType = inferEmploymentType(`${title} ${plain}`);
  const remoteType = inferRemoteType(`${location} ${plain}`);
  const scores = scoreRole(plain, skills, employmentType);

  return {
    id: `live-${sourceName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    companyName,
    companyWebsite: jobUrl ? new URL(jobUrl).origin : "",
    jobUrl,
    sourceName,
    sourceType,
    location: location || "Unknown",
    remoteType,
    employmentType,
    duration: plain.match(/\b(\d{3,}\s*(?:months|month|weeks|week))\b/i)?.[1] ?? "Not listed",
    payRateMin: undefined,
    payRateMax: undefined,
    billRateEstimate: undefined,
    description: plain ? plain.slice(0, 1800) : "No description returned by public source.",
    requiredSkills: skills.slice(0, 6),
    preferredSkills: [],
    seniority: /senior|principal|lead/i.test(`${title} ${plain}`) ? "Senior" : "Unknown",
    industry: "Unknown",
    postedDate: postedDate || new Date().toISOString().slice(0, 10),
    discoveredAt: new Date().toISOString().slice(0, 10),
    status: "NEW",
    notes: "Fetched from live public connector preview.",
    ...scores,
  };
}

export async function fetchGreenhouseJobs(boardToken) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Greenhouse returned ${response.status}`);
  const data = await response.json();
  return (data.jobs ?? []).slice(0, 50).map((job) => normalizeJob({
    title: job.title,
    companyName: boardToken,
    jobUrl: job.absolute_url,
    location: job.location?.name,
    description: job.content,
    sourceName: `Greenhouse:${boardToken}`,
    sourceType: "COMPANY_CAREER_PAGE",
    postedDate: job.updated_at?.slice?.(0, 10),
  }));
}

export async function fetchLeverJobs(companySlug) {
  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(companySlug)}?mode=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Lever returned ${response.status}`);
  const jobs = await response.json();
  return (Array.isArray(jobs) ? jobs : []).slice(0, 50).map((job) => normalizeJob({
    title: job.text,
    companyName: companySlug,
    jobUrl: job.hostedUrl,
    location: job.categories?.location,
    description: [job.description, job.descriptionPlain, ...(job.lists ?? []).map((list) => `${list.text} ${(list.content ?? "").replace(/\n/g, " ")}`)].join(" "),
    sourceName: `Lever:${companySlug}`,
    sourceType: "COMPANY_CAREER_PAGE",
    postedDate: job.createdAt ? new Date(job.createdAt).toISOString().slice(0, 10) : undefined,
  }));
}

export async function fetchAshbyJobs(boardName) {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(boardName)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ashby returned ${response.status}`);
  const data = await response.json();
  const jobs = data.jobs ?? data.results ?? [];
  return jobs.slice(0, 50).map((job) => normalizeJob({
    title: job.title,
    companyName: boardName,
    jobUrl: job.jobUrl || job.externalLink || `https://jobs.ashbyhq.com/${boardName}/${job.id}`,
    location: job.locationName || job.location?.name,
    description: job.descriptionHtml || job.descriptionPlain || job.description,
    sourceName: `Ashby:${boardName}`,
    sourceType: "COMPANY_CAREER_PAGE",
    postedDate: job.publishedAt?.slice?.(0, 10),
  }));
}

export async function runConnector({ provider, identifier }) {
  if (!identifier || !/^[a-zA-Z0-9_.-]+$/.test(identifier)) throw new Error("Use a valid public board token or company slug.");
  if (provider === "greenh