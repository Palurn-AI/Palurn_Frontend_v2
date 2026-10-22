import { createContext, useContext } from "react";

import type { PalurnApi } from "./create-api.ts";

export const ApiContext = createContext<PalurnApi | null>(null);

export function useApi() {
  const api = useContext(ApiContext);
  if (!api) {
    throw new Error("useApi must be used within AppProviders");
  }
  return api;
}
