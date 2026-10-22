import type { HttpClient } from "../client.ts";
import type { MeetingsResponse } from "../types.ts";

export function createMeetingsService(client: HttpClient) {
  return {
    getMeetings() {
      return client.get<MeetingsResponse>("meetings");
    },
  };
}
