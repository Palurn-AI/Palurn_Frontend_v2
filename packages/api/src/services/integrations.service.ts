import type { HttpClient } from "../client.ts";
import type { IntegrationsResponse } from "../types.ts";

export function createIntegrationsService(client: HttpClient) {
  return {
    getIntegrations() {
      return client.get<IntegrationsResponse>("integrations");
    },
  };
}
