import { IngestionAdapter } from "./baseAdapter";

export const csvUploadAdapter: IngestionAdapter = {
  id: "csv-upload",
  name: "CSV upload",
  sourceType: "manual_upload",
  compliantUse: "Accept recruiter, partner, or internal CSVs uploaded by authorized users.",
  fetchRoles: async () => [],
};
