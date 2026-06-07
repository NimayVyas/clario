export function extractJobInfo(description: string) {
  return {
    requiredSkills: [...description.matchAll(/\b(Python|SQL|AWS|PySpark|Snowflake|Databricks|Java|React|Kubernetes|AI|ML)\b/gi)].map((m) => m[1]),
    employmentType: /contract-to-hire|cth/i.test(description) ? "CONTRACT_TO_HIRE" : /contract|w2|c2c/i.test(description) ? "CONTRACT" : "UNKNOWN",
    urgencyIndicators: [...description.matchAll(/\b(immediate|urgent|asap|backfill|long-term)\b/gi)].map((m) => m[1]),
    likelyHiringPainPoint: "Hard-to-fill contract tech role with noisy candidate supply.",
  };
}
