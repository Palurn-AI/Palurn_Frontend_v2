import { createHttpClient, type ApiClientOptions } from "./client.ts";
import { useSessionStore } from "./stores/session-store.ts";
import { createAccountService } from "./services/account.service.ts";
import { createAuthService } from "./services/auth.service.ts";
import { createDashboardService } from "./services/dashboard.service.ts";
import { createIntegrationsService } from "./services/integrations.service.ts";
import { createMeetingsService } from "./services/meetings.service.ts";
import { createNavigationService } from "./services/navigation.service.ts";
import { createOrdersService } from "./services/orders.service.ts";
import { createProjectsService } from "./services/projects.service.ts";
import { createReportService } from "./services/report.service.ts";
import { createSettingsService } from "./services/settings.service.ts";
import { createTasksService } from "./services/tasks.service.ts";
import { createUsersService } from "./services/users.service.ts";

export function createPalurnApi(options: ApiClientOptions) {
  const client = createHttpClient({
    ...options,
    getToken: options.getToken ?? (() => useSessionStore.getState().token),
  });

  return {
    mode: client.mode,
    dashboard: createDashboardService(client),
    users: createUsersService(client),
    orders: createOrdersService(client),
    meetings: createMeetingsService(client),
    tasks: createTasksService(client),
    projects: createProjectsService(client),
    integrations: createIntegrationsService(client),
    report: createReportService(client),
    settings: createSettingsService(client),
    account: createAccountService(client),
    navigation: createNavigationService(client),
    auth: createAuthService(client),
  };
}

export type PalurnApi = ReturnType<typeof createPalurnApi>;
