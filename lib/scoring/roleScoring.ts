const hardSkillRegex = /python|sql|aws|pyspark|snowflake|databricks|java|react|cybersecurity|ai|ml|aladdin|kubernetes|terraform/i;

export function scoreRole(input: { description: string; requiredSkills: string[]; seniority?: string; employmentType?: string; postedDate?: string }) {
  const roleDifficultyScore = Math.min(100, 30 + input.requiredSkills.filter((skill) => hardSkillRegex.test(skill)).length * 9 + (/senior/i.test(input.seniority ?? "") ? 18 : 6));
  const urgencyScore = Math.min(100, 35 + (/immediate|urgent|asap|backfill|long-term contract/i.test(input.description) ? 35 : 0) + (/contract/i.test(input.employmentType ?? "") ? 12 : 0));
  const partnershipScore = Math.min(100, 25 + (/contract/i.test(input.employmentType ?? "") ? 25 : 0) + (input.requiredSkills.some((skill) => hardSkillRegex.test(skill)) ? 22 : 0));
  return { roleDifficultyScore, urgencyScore, partnershipScore };
}
