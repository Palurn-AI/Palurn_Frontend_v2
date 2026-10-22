import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryKeys = {
  dashboard: ["dashboard"],
  users: ["users"],
  orders: ["orders"],
  meetings: ["meetings"],
  tasks: ["tasks"],
  projects: ["projects"],
  integrations: ["integrations"],
  report: ["report"],
  settings: ["settings"],
  account: ["account"],
  navigation: ["navigation"],
  session: ["session"],
} as const;
