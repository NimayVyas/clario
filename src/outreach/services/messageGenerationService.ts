import { Account, Contact } from "../data/outreachMock";

export function generateLinkedInMessage(contact: Contact, account: Account, pitchAngle = contact.bestPitchAngle) {
  return `Hey ${contact.firstName} - I’m building Clario to help teams like ${account.name} with ${pitchAngle.toLowerCase()}. I’d love to learn how your team handles contract technical hiring today. Open to a quick feedback call?`;
}

export function generateEmailMessage(contact: Contact, account: Account, pitchAngle = contact.bestPitchAngle) {
  return `Subject: Quick idea for ${account.name}\n\nHi ${contact.firstName},\n\nI’m building Clario, a B2B AI hiring platform for contract technical talent. Based on your work around ${account.technicalSpecialties.slice(0, 2).join(" and ")}, I thought ${pitchAngle.toLowerCase()} might be relevant.\n\nWould you be open to a short feedback call?\n\nBest,\nClario Team`;
}

export function generateFollowUpMessage(contact: Contact, account: Account) {
  return `Hey ${contact.firstName} - wanted to follow up on Clario. We’re helping teams improve contractor screening, rate alignment, and shortlist quality. Worth a quick look for ${account.name}?`;
}

export function generateMeetingRequest(contact: Contact, account: Account) {
  return `Hi ${contact.firstName}, would you be open to a 15-minute walkthrough of how Clario could support ${account.name}'s contract hiring workflow?`;
}
