import { IngestionAdapter } from "./baseAdapter";

export const companyCareerPageAdapter: IngestionAdapter = {
  id: "company-careers",
  name: "Company career pages",
  sourceType: "permitted_public_page",
  compliantUse: "Connect only where collection is permitted by the site and applicable terms.",
  fetchRoles: async () => [],
};
