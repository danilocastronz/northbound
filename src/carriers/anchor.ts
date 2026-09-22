import { CarrierEvent } from "./types";
import { resolveFromConfirmationEvent } from "./shared";

export interface AnchorShipment {
  id: string;
  status: "pending" | "in_transit" | "delayed" | "delivered";
}

export function applyAnchorEvent(
  shipment: AnchorShipment,
  event: CarrierEvent
): AnchorShipment {
  if (event.carrierStatus === "out_for_delivery") {
    return { ...shipment, status: "in_transit" };
  }

  const confirmed = resolveFromConfirmationEvent(event.carrierStatus);
  if (confirmed) {
    return { ...shipment, status: confirmed };
  }

  if (event.carrierStatus === "delay_reported") {
    return { ...shipment, status: "delayed" };
  }

  return shipment;
}
