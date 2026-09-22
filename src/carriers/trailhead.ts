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
  const confirmed = resolveFromConfirmationEvent(event.carrierStatus);
  if (confirmed) {
    return { ...shipment, stage: confirmed };
  }

  if (event.carrierStatus === "out_for_final_delivery") {
    // Fixed in chapter 5: this used to jump straight to "delivered"
    // here. Now it waits for a confirmation event, the same as
    // Anchor and Harborline. Checked after the confirmation branch
    // above, and only applied if the shipment is not already
    // delivered, so a late or out-of-order "out_for_final_delivery"
    // signal can never regress an already-delivered shipment.
    if (shipment.stage !== "delivered") {
      return { ...shipment, stage: "in_transit" };
    }
    return shipment;
  }

  if (event.carrierStatus === "delay_reported") {
    return { ...shipment, stage: "delayed" };
  }

  return shipment;
}
