import { Badge } from "../ui/Badge";

export function SourceBadge({ source }: { source: string }) {
  return <Badge tone="blue">{source}</Badge>;
}
