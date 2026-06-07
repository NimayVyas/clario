import { Account, Contact } from "../data/outreachMock";

export function calculateAccountFitScore(account: Account, contactsCount = 0) {
  let score = 0;
  if (/Staffing|Recruiting|Consulting/.test(account.accountType)) score += 25;
  if (account.technicalSpecialties.length > 0) score += 20;
  if (["51-200", "201-500", "501-1000"].includes(account.companySize)) score += 15;
  if (contactsCount > 0) score += 15;
  if (account.likelyPainPoints.length > 0) score += 10;
  if (account.industriesServed.some((industry) => /finance|healthcare|government|cloud|data|ai/i.test(industry))) score += 10;
  if (/University|Bootcamp|Talent/.test(account.accountType)) score += 5;
  return Math.min(100, score);
}

export function calculateContactPriority(contact: Contact, account: Account) {
  if (["Founder", "Owner", "Recruiting Manager", "HR Leader", "Talent Acquisition", "Contingent Workforce"].includes(contact.roleCategory)) return "High";
  if (["Recruiter", "Hiring Manager", "University Career Services"].includes(contact.roleCategory)) return account.priority === "Strategic" ? "High" : "Medium";
  return "Medium";
}
