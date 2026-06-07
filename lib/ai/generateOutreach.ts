export function generateOutreach(input: { companyName: string; roleCategory: string; leadType: "STAFFING_COMPANY" | "DIRECT_EMPLOYER" }) {
  if (input.leadType === "STAFFING_COMPANY") {
    return {
      callScript: `Hey, this is [Name] from Clario. We help staffing teams source and screen stronger candidates for hard-to-fill ${input.roleCategory} roles while your firm keeps the client relationship.`,
      emailDraft: `Subject: Possible sourcing partnership for contract tech roles\n\nHi [Name],\n\nI noticed ${input.companyName} appears to recruit for ${input.roleCategory} roles. Clario can help create stronger qualified shortlists faster while your firm keeps the client relationship.\n\nOpen to testing us on one hard-to-fill role?`,
      demoNotes: "Show staffing delivery workflow, candidate ranking, and screening notes.",
    };
  }
  return {
    callScript: `Hey, this is [Name] from Clario. We help companies hiring contract ${input.roleCategory} talent reduce weak submissions and get qualified shortlists faster.`,
    emailDraft: `Subject: Faster shortlists for contract tech hiring\n\nHi [Name],\n\nI noticed ${input.companyName} has open roles around ${input.roleCategory}. Clario helps identify and rank qualified contract candidates before submission.\n\nOpen to a quick 10-minute demo?`,
    demoNotes: "Show direct employer role intelligence and transparent shortlist quality.",
  };
}
