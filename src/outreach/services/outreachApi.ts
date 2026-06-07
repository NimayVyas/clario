import { Account, Campaign, Contact, MessageTemplate, OutreachTask } from "../data/outreachMock";
import { getStoredToken } from "../../services/authService";

export interface OutreachState {
  accounts: Account[];
  contacts: Contact[];
  campaigns: Campaign[];
  tasks: OutreachTask[];
  messageTemplates: MessageTemplate[];
  outreachEvents: OutreachEvent[];
  pitchAngles: string[];
}

export interface SourcingRun {
  id: string;
  type: string;
  sourceName: string;
  status: string;
  rowsReceived: number;
  accountsCreated: number;
  accountsUpdated: number;
  contactsCreated: number;
  tasksCreated: number;
  notes: string;
  createdAt: string;
}

export interface OutreachEvent {
  id: string;
  accountId: string;
  contactId: string;
  channel: "Email" | "LinkedIn" | "Follow-up";
  subject: string;
  body: string;
  status: string;
  createdAt: string;
  owner: string;
}

export interface GeneratedMessage {
  contact: Contact;
  account: Account;
  channel: "Email" | "LinkedIn" | "Follow-up";
  subject: string;
  body: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Clario API request failed");
  return data;
}

export function fetchOutreachState() {
  return request<OutreachState>("/api/outreach");
}

export function createOutreachAccount(input: Partial<Account>) {
  return request<{ account: Account }>("/api/outreach/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createOutreachContact(input: Partial<Contact> & { accountId: string }) {
  return request<{ contact: Contact }>("/api/outreach/contacts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function generateOutreachDraft(input: { contactId: string; channel: "Email" | "LinkedIn" | "Follow-up"; pitchAngle?: string }) {
  return request<GeneratedMessage>("/api/outreach/messages/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logOutreachSend(input: { contactId: string; channel: "Email" | "LinkedIn" | "Follow-up"; subject?: string; body?: string }) {
  return request<{ mailto: string; event: OutreachEvent; contact: Contact; account: Account }>("/api/outreach/send", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateOutreachTask(id: string, patch: Partial<OutreachTask>) {
  return request<{ task: OutreachTask }>(`/api/outreach/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function importSourcingCsv(input: { csvText: string; sourceName?: string }) {
  return request<{ run: SourcingRun; accounts: Account[]; contacts: Contact[]; tasks: OutreachTask[] }>("/api/sourcing/import-csv", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function createResearchQueue(input: { companies: Array<string | { name: string; website?: string; location?: string }>; sourceName?: string }) {
  return request<{ run: SourcingRun; accounts: Account[]; tasks: OutreachTask[] }>("/api/sourcing/research-queue", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function fetchSourcingRuns() {
  return request<{ runs: SourcingRun[] }>("/api/sourcing/runs");
}
