import { transparencyLabel } from "../../services/scoringService";
import { Badge } from "../ui/Badge";

export function TransparencyBadge({ score }: { score: number }) {
  const tone = score >= 80 ? "green" : score >= 60 ? "amber" : "red";
  return <Badge tone={tone}>{transparencyLabel(score)}</Badge>;
}
