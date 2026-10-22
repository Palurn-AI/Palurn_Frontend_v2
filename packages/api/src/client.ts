import axios from "axios";

const mockPageDelayMs = 900;

import { ApiError, toApiError } from "./errors.ts";
import { resources, type ResourceName } from "./resources.ts";

export type ApiMode = "mock" | "real";

export type ApiClientOptions = {
  mode: ApiMode;
  baseURL?: string;
  timeout?: number;
  getToken?: () => string | null;
};

export function createHttpClient(options: ApiClientOptions) {
  const mode = options.mode;
  const instance = axios.create({
    baseURL: mode === "real" ? (options.baseURL ?? "") : "",
    timeout: options.timeout ?? 10_000,
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = options.getToken?.();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toApiError(error)),
  );

  function path(resource: ResourceName) {
    return resources[resource][mode];
  }

  async function get<T>(resource: ResourceName): Promise<T> {
    const response = await instance.get<T>(path(resource));
    if (mode === "mock" && resource !== "navigation" && resource !== "session") {
      await new Promise((resolve) => setTimeout(resolve, mockPageDelayMs));
    }
    return response.data;
  }

  async function post<T>(resource: ResourceName, data?: unknown): Promise<T> {
    if (mode === "mock") {
      throw new ApiError(
        "Mock JSON files are read-only. This request was not sent.",
        405,
      );
    }

    const response = await instance.post<T>(path(resource), data);
    return response.data;
  }

  return {
    mode,
    get,
    post,
  };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
