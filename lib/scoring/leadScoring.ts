export function scoreLead(input: { relevantRoles: number; avgRoleDifficulty: number; hasPublicContact: boolean; industryFit: number }) {
  return Math.min(100, input.relevantRoles * 12 + input.avgRoleDifficulty * 0.35 + (input.hasPublicContact ? 18 : 0) + input.industryFit);
}
