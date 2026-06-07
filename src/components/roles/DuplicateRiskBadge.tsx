import { Badge } from "../ui/Badge";

export function DuplicateRiskBadge({ score }: { score: number }) {
  const tone = score >= 70 ? "red" : score >= 40 ? "amber" : "green";
  const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
  return <Badge tone={tone}>{label} risk</Badge>;
}
