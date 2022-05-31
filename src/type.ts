import { CancelOrderEvent, FillOrderEvent, PlaceOrderEvent } from "./typechain/Market";

export type Methods = "PlaceOrder" | "FillOrder" | "CancelOrder";
export type EventResult = CancelOrderEvent[] | PlaceOrderEvent[] | FillOrderEvent[];
