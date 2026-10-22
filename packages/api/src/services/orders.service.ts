import type { HttpClient } from "../client.ts";
import type { OrdersResponse } from "../types.ts";

export function createOrdersService(client: HttpClient) {
  return {
    getOrders() {
      return client.get<OrdersResponse>("orders");
    },
  };
}
