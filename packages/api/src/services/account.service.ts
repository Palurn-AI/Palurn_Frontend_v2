import type { HttpClient } from "../client.ts";
import type { AccountResponse } from "../types.ts";

export function createAccountService(client: HttpClient) {
  return {
    getAccount() {
      return client.get<AccountResponse>("account");
    },
  };
}
