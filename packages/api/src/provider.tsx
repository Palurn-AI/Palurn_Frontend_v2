import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { ApiContext } from "./context.ts";
import type { PalurnApi } from "./create-api.ts";
import { useSession } from "./hooks.ts";
import { createQueryClient } from "./query-client.ts";

function SessionBridge() {
  useSession();
  return null;
}

export function AppProviders({
  api,
  children,
}: {
  api: PalurnApi;
  children: ReactNode;
}) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ApiContext.Provider value={api}>
      <QueryClientProvider client={queryClient}>
        <SessionBridge />
        {children}
      </QueryClientProvider>
    </ApiContext.Provider>
  );
}
