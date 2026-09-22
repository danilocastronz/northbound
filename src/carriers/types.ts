export type InternalStatus = "pending" | "in_transit" | "delayed" | "delivered";

export interface CarrierEvent {
  shipmentId: string;
  carrierStatus: string;
  timestamp: string;
}
