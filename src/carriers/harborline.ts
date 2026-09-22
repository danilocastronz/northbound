import { CarrierEvent } from "./types";
import { resolveFromConfirmationEvent } from "./shared";

export interface HarborlineShipment {
  id: string;
  shipmentState: "pending" | "in_transit" | "delayed" | "delivered";
}

export function applyHarborlineEvent(
  shipment: HarborlineShipment,
  event: CarrierEvent
): HarborlineShipment {
  if (event.carrierStatus === "en_route") {
    return { ...shipment, shipmentState: "in_transit" };
  }

  const confirmed = resolveFromConfirmationEvent(event.carrierStatus);
  if (confirmed) {
    return { ...shipment, shipmentState: confirmed };
  }

  if (event.carrierStatus === "delay_reported") {
    return { ...shipment, shipmentState: "delayed" };
  }

  return shipment;
}
