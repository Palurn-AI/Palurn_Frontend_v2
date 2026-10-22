import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useApi } from "./context.ts";
import { queryKeys } from "./query-client.ts";
import { useSessionStore } from "./stores/session-store.ts";

export function useNavigation() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.navigation,
    queryFn: () => api.navigation.getNavigation(),
  });
}

export function useDashboard() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: () => api.dashboard.getDashboard(),
  });
}

export function useUsers() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => api.users.getUsers(),
  });
}

export function useOrders() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: () => api.orders.getOrders(),
  });
}

export function useMeetings() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.meetings,
    queryFn: () => api.meetings.getMeetings(),
  });
}

export function useTasks() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => api.tasks.getTasks(),
  });
}

export function useProjects() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => api.projects.getProjects(),
  });
}

export function useIntegrations() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.integrations,
    queryFn: () => api.integrations.getIntegrations(),
  });
}

export function useReport() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.report,
    queryFn: () => api.report.getReport(),
  });
}

export function useSettings() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => api.settings.getSettings(),
  });
}

export function useAccount() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.account,
    queryFn: () => api.account.getAccount(),
  });
}

export function useSession() {
  const api = useApi();

  return useQuery({
    queryKey: queryKeys.session,
    queryFn: () => api.auth.getSession(),
  });
}

export function useIdleSession() {
  const token = useSessionStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const mark = () => useSessionStore.getState().touchActivity();
    mark();
    const events = ["pointerdown", "keydown"] as const;
    for (const name of events) {
      window.addEventListener(name, mark, { passive: true });
    }
    const timer = window.setInterval(() => useSessionStore.getState().expireIfIdle(), 30_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        useSessionStore.getState().expireIfIdle();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      for (const name of events) {
        window.removeEventListener(name, mark);
      }
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [token]);
}

export function useLogin() {
  const api = useApi();
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: { email: string; password: string }) => api.auth.login(input),
    onSuccess: (session) => {
      if (session.token) {
        setSession({ token: session.token, name: session.name });
      }
    },
  });
}

export function useLogout() {
  const api = useApi();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => api.auth.logout(),
    onSuccess: (result) => {
      clearSession();
      if (result.persisted) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.session });
        return;
      }

      queryClient.setQueryData(queryKeys.session, (current) =>
        current ? { ...current, token: null } : current,
      );
    },
  });
}
