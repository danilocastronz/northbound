import { InternalStatus } from "./types";

// Only these carrier event types should ever resolve a shipment to
// "delivered". A carrier's own "final delivery" or "out for delivery"
// signal is not sufficient on its own — Northbound waits for a
// separate confirmation event before marking something delivered.
// See config/legacy.settings.json for why this list is not longer.
const DELIVERY_CONFIRMATION_EVENTS = new Set([
  "confirmed_delivery",
  "pod_received",
]);

export function resolveFromConfirmationEvent(
  eventType: string
): InternalStatus | null {
  if (DELIVERY_CONFIRMATION_EVENTS.has(eventType)) {
    return "delivered";
  }
  return null;
}
