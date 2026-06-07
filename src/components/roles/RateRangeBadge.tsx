import { formatRateRange } from "../../lib/utils";
import { Badge } from "../ui/Badge";

export function RateRangeBadge({ min, max }: { min: number; max: number }) {
  return <Badge tone="green">{formatRateRange(min, max)}</Badge>;
}
