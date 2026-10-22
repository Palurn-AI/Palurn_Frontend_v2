import type { HttpClient } from "../client.ts";
import type { DashboardResponse } from "../types.ts";

export function createDashboardService(client: HttpClient) {
  return {
    getDashboard() {
      return client.get<DashboardResponse>("dashboard");
    },
  };
}
