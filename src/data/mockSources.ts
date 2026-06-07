export interface SourceConnector {
  id: string;
  name: string;
  type: string;
  status: "Connected" | "Pending" | "Disabled";
  lastSyncTime: string;
  rolesImported: number;
  averageTransparencyScore: number;
  sourceQualityScore: number;
}

export const mockSources: SourceConnector[] = [
  { id: "linkedin", name: "LinkedIn-style feed", type: "Approved Feed", status: "Connected", lastSyncTime: "Today, 8:40 AM", rolesImported: 128, averageTransparencyScore: 79, sourceQualityScore: 84 },
  { id: "indeed", name: "Indeed-style feed", type: "Approved Feed", status: "Connected", lastSyncTime: "Today, 8:15 AM", rolesImported: 94, averageTransparencyScore: 74, sourceQualityScore: 78 },
  { id: "dice", name: "Dice-style feed", type: "Approved Feed", status: "Connected", lastSyncTime: "Today, 7:55 AM", rolesImported: 117, averageTransparencyScore: 76, sourceQualityScore: 81 },
  { id: "builtin", name: "BuiltIn-style feed", type: "Approved Feed", status: "Pending", lastSyncTime: "Yesterday, 5:20 PM", rolesImported: 42, averageTransparencyScore: 82, sourceQualityScore: 87 },
  { id: "career", name: "Company career pages", type: "Permitted Public Pages", status: "Connected", lastSyncTime: "Today, 6:50 AM", rolesImported: 73, averageTransparencyScore: 88, sourceQualityScore: 91 },
  { id: "csv", name: "CSV upload", type: "Manual Upload", status: "Connected", lastSyncTime: "Today, 9:05 AM", rolesImported: 36, averageTransparencyScore: 72, sourceQualityScore: 75 },
  { id: "manual", name: "Manual role entry", type: "Internal Entry", status: "Connected", lastSyncTime: "Today, 9:30 AM", rolesImported: 18, averageTransparencyScore: 83, sourceQualityScore: 86 },
  { id: "partner", name: "Partner feed", type: "Partner API", status: "Connected", lastSyncTime: "Today, 8:05 AM", rolesImported: 156, averageTransparencyScore: 85, sourceQualityScore: 90 },
];
