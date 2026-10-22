import type { HttpClient } from "../client.ts";
import type { ReportResponse } from "../types.ts";

export function createReportService(client: HttpClient) {
  return {
    getReport() {
      return client.get<ReportResponse>("report");
    },
  };
}
