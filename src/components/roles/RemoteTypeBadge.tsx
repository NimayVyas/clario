import { RemoteType } from "../../types/job";
import { Badge } from "../ui/Badge";

export function RemoteTypeBadge({ type }: { type: RemoteType }) {
  const tone = type === "Remote" ? "green" : type === "Hybrid" ? "blue" : "slate";
  return <Badge tone={tone}>{type}</Badge>;
}
