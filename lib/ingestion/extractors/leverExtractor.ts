export async function extractLeverJobs(companySlug: string) {
  return {
    endpoint: `https://api.lever.co/v0/postings/${companySlug}`,
    jobs: [],
    note: "Use public Lever postings endpoint where available.",
  };
}
