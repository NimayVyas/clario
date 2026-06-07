export interface ComplianceDecision {
  allowed: boolean;
  reason: string;
}

export function validatePublicSource(url: string): ComplianceDecision {
  if (!/^https?:\/\//.test(url) && !url.startsWith("manual://")) return { allowed: false, reason: "Source must be a public URL or approved manual import." };
  if (/linkedin\.com|captcha|login|signin|paywall/i.test(url)) return { allowed: false, reason: "Restricted, login-gated, or prohibited source." };
  return { allowed: true, reason: "Allowed pending robots.txt, terms, and rate-limit checks." };
}

export const crawlerRules = [
  "Check robots.txt before generic crawling.",
  "Respect website terms and rate limits.",
  "Use official APIs/RSS/public boards where possible.",
  "Never bypass login walls, CAPTCHAs, paywalls, or private APIs.",
  "Extract visible public job/business information only.",
];
