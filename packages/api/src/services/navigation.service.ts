import type { HttpClient } from "../client.ts";
import type { NavigationResponse } from "../types.ts";

export function createNavigationService(client: HttpClient) {
  return {
    getNavigation() {
      return client.get<NavigationResponse>("navigation");
    },
  };
}
