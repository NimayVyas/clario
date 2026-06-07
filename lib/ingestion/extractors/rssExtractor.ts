export async function extractRssJobs(url: string) {
  return {
    url,
    jobs: [],
    note: "Parse RSS feed items into normalized job role inputs.",
  };
}
