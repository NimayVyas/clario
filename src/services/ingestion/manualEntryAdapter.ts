import { IngestionAdapter } from "./baseAdapter";

export const manualEntryAdapter: IngestionAdapter = {
  id: "manual-entry",
  name: "Manual role entry",
  sourceType: "manual_entry",
  compliantUse: "Store roles entered directly by authorized users.",
  fetchRoles: async () => [],
};
