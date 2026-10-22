import type { HttpClient } from "../client.ts";
import type { UsersResponse } from "../types.ts";

export function createUsersService(client: HttpClient) {
  return {
    getUsers() {
      return client.get<UsersResponse>("users");
    },
  };
}
