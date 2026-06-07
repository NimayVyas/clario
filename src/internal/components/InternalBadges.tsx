import { Priority, TaskStatus } from "../data/intelligenceSeed";
import { Badge } from "../../components/ui/Badge";

export function ScoreBadge({ score }: { score: number }) {
  const tone = score >= 85 ? "green" : score >= 70 ? "blue" : score >= 55 ? "amber" : "slate";
  return <Badge tone={tone}>{score}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === "URGENT" ? "red" : priority === "HIGH" ? "amber" : priority === "MEDIUM" ? "blue" : "slate";
  return <Badge tone={tone}>{priority}</Badge>;
}

export function StatusBadge({ status }: { status: string | TaskStatus }) {
  const tone = /PARTNERED|SUCCESS|DONE|CLIENT|QUEUED/.test(status) ? "green" : /CONTACTED|IN_PROGRESS|RESPONDED/.test(status) ? "blue" : /URGENT|FAILED|REJECTED|NOT/.test(status) ? "red" : "slate";
  return <Badge tone={tone}>{status.replaceAll("_", " ")}</Badge>;
}
