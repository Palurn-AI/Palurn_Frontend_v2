import type { HttpClient } from "../client.ts";
import type { ProjectsResponse } from "../types.ts";

export function createProjectsService(client: HttpClient) {
  return {
    getProjects() {
      return client.get<ProjectsResponse>("projects");
    },
  };
}
