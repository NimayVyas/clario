export async function extractGreenhouseJobs(boardToken: string) {
  return {
    endpoint: `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`,
    jobs: [],
    note: "Use public Greenhouse board endpoints where available.",
  };
}
