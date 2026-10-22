import type { HttpClient } from "../client.ts";
import type { SettingsResponse } from "../types.ts";

export function createSettingsService(client: HttpClient) {
  return {
    getSettings() {
      return client.get<SettingsResponse>("settings");
    },
  };
}
