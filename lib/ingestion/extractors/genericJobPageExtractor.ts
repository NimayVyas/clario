export async function extractGenericJobPage(url: string) {
  return {
    url,
    visibleText: "",
    jobs: [],
    note: "Use Playwright only after robots/terms/rate-limit checks. Extract visible text only.",
  };
}
