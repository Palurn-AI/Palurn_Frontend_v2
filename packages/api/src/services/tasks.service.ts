import type { HttpClient } from "../client.ts";
import type { TasksResponse } from "../types.ts";

export function createTasksService(client: HttpClient) {
  return {
    getTasks() {
      return client.get<TasksResponse>("tasks");
    },
  };
}
