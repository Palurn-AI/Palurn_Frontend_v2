export const resources = {
  dashboard: { mock: "/mock-api/dashboard.json", real: "/dashboard" },
  users: { mock: "/mock-api/users.json", real: "/users" },
  orders: { mock: "/mock-api/orders.json", real: "/orders" },
  meetings: { mock: "/mock-api/meetings.json", real: "/meetings" },
  tasks: { mock: "/mock-api/tasks.json", real: "/tasks" },
  projects: { mock: "/mock-api/projects.json", real: "/projects" },
  integrations: { mock: "/mock-api/integrations.json", real: "/integrations" },
  report: { mock: "/mock-api/report.json", real: "/report" },
  settings: { mock: "/mock-api/settings.json", real: "/settings" },
  account: { mock: "/mock-api/account.json", real: "/account" },
  navigation: { mock: "/mock-api/navigation.json", real: "/navigation" },
  session: { mock: "/mock-api/session.json", real: "/session" },
  login: { mock: "/auth/login", real: "/auth/login" },
  logout: { mock: "/auth/logout", real: "/auth/logout" },
} as const;

export type ResourceName = keyof typeof resources;
