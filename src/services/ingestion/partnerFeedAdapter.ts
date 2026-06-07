import { IngestionAdapter } from "./baseAdapter";

export const partnerFeedAdapter: IngestionAdapter = {
  id: "partner-feed",
  name: "Partner feed",
  sourceType: "partner_api",
  compliantUse: "Ingest authenticated partner API payloads and approved feed exports.",
  fetchRoles: async () => [],
};
