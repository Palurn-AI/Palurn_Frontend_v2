import type { HttpClient } from "../client.ts";
import { ApiError } from "../errors.ts";
import type { SessionResponse } from "../types.ts";

const companyEmail = "hana.ito@northwind.studio";
const companyPassword = "Palurn123";

export const companyLogin = {
  email: companyEmail,
  password: companyPassword,
} as const;

export function matchesCompanyLogin(email: string, password: string) {
  return email.trim().toLowerCase() === companyEmail && password === companyPassword;
}

export function createAuthService(client: HttpClient) {
  return {
    getSession() {
      return client.get<SessionResponse>("session");
    },
    async login(input: { email: string; password: string }) {
      const email = input.email.trim();
      const password = input.password;

      if (!email || !password) {
        throw new ApiError("Invalid Credentials", 401);
      }

      if (client.mode === "real") {
        return client.post<SessionResponse>("login", { email, password });
      }

      if (!matchesCompanyLogin(email, password)) {
        throw new ApiError("Invalid Credentials", 401);
      }

      const session = await client.get<SessionResponse>("session");
      if (!session.token) {
        throw new ApiError("Invalid Credentials", 401);
      }

      return session;
    },
    /**
     * Mock mode does not call the network. Static JSON cannot record a logout.
     * Real mode posts to the logout endpoint.
     */
    async logout() {
      if (client.mode === "real") {
        await client.post<void>("logout");
        return { persisted: true };
      }

      return { persisted: false };
    },
  };
}
