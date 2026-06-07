import { scoreRole } from "../lib/scoring/roleScoring";

const scored = scoreRole({
  description: "Immediate long-term contract Python AWS PySpark role",
  requiredSkills: ["Python", "AWS", "PySpark"],
  seniority: "Senior",
  employmentType: "CONTRACT",
});

if (scored.roleDifficultyScore < 70) throw new Error("Expected high role difficulty score");
if (scored.partnershipScore < 70) throw new Error("Expected high partnership score");
if (scored.urgencyScore < 70) throw new Error("Expected high urgency score");
