import { CarrierEvent } from "./types";
import { resolveFromConfirmationEvent } from "./shared";

export interface TrailheadShipment {
  id: string;
  stage: "pending" | "in_transit" | "delayed" | "delivered";
}

export function applyTrailheadEvent(
  shipment: TrailheadShipment,
  event: CarrierEvent
): TrailheadShipment {
  if (event.carrierStatus === "out_for_final_delivery") {
    return { ...shipment, stage: "delivered" };
  }

  const confirmed = resolveFromConfirmationEvent(event.carrierStatus);
  if (confirmed) {
    return { ...shipment, stage: confirmed };
  }

  if (event.carrierStatus === "delay_reported") {
    return { ...shipment, stage: "delayed" };
  }

  return shipment;
}
