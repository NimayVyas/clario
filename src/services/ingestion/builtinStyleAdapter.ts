import { IngestionAdapter } from "./baseAdapter";

export const builtinStyleAdapter: IngestionAdapter = {
  id: "builtin-style",
  name: "BuiltIn-style feed",
  sourceType: "approved_feed",
  compliantUse: "Use compliant APIs, RSS, or approved source feeds.",
  fetchRoles: async () => [],
};
