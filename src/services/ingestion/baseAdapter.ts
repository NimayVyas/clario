export interface IngestionAdapter<T = unknown> {
  id: string;
  name: string;
  sourceType: string;
  compliantUse: string;
  fetchRoles: () => Promise<T[]>;
}

export const compliantSourceNote =
  "Use only APIs, approved feeds, partner integrations, manual uploads, and pages where collection is permitted.";
