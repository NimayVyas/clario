import { IngestionAdapter } from "./baseAdapter";

export const indeedStyleAdapter: IngestionAdapter = {
  id: "indeed-style",
  name: "Indeed-style feed",
  sourceType: "approved_feed",
  compliantUse: "Connect through approved feed or API terms only.",
  fetchRoles: async () => [],
};
