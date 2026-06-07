import { IngestionAdapter } from "./baseAdapter";

export const diceStyleAdapter: IngestionAdapter = {
  id: "dice-style",
  name: "Dice-style feed",
  sourceType: "approved_feed",
  compliantUse: "Use permitted feeds, APIs, or partner exports.",
  fetchRoles: async () => [],
};
