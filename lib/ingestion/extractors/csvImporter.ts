export interface CsvRoleRow {
  title: string;
  companyName: string;
  jobUrl: string;
  location?: string;
  employmentType?: string;
  description: string;
  postedDate?: string;
  sourceName: string;
}

export function importCsvRows(rows: CsvRoleRow[]) {
  return rows.map((row) => ({
    ...row,
    sourceType: "MANUAL_UPLOAD",
    discoveredAt: new Date().toISOString(),
  }));
}
