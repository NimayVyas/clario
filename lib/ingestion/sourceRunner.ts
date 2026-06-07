import { validatePublicSource } from "./compliance";

export interface SourceInput {
  id: string;
  name: string;
  url: string;
  type: string;
}

export async function runSource(source: SourceInput) {
  const decision = validatePublicSource(source.url);
  if (!decision.allowed) throw new Error(decision.reason);
  return {
    sourceId: source.id,
    rolesFound: 0,
    rolesCreated: 0,
    rolesUpdated: 0,
    status: "SUCCESS",
    note: "Mock runner. Plug Greenhouse, Lever, RSS, CSV, or compliant Playwright extractor here.",
  };
}
