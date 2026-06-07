import { IngestionAdapter } from "./baseAdapter";

export const linkedinStyleAdapter: IngestionAdapter = {
  id: "linkedin-style",
  name: "LinkedIn-style feed",
  sourceType: "approved_feed",
  compliantUse: "Connect through approved feed or API terms only.",
  fetchRoles: async () => [],
};
