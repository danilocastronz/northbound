import { AnchorShipment } from "./carriers/anchor";
import { HarborlineShipment } from "./carriers/harborline";
import { TrailheadShipment } from "./carriers/trailhead";

// A small in-memory store standing in for the real database, so the
// app and its tests run without requiring Postgres to be up. See
// db.ts and docker-compose.yml for the real connection.
export const anchorShipments = new Map<string, AnchorShipment>([
  ["NB-10240", { id: "NB-10240", status: "in_transit" }],
]);

export const harborlineShipments = new Map<string, HarborlineShipment>([
  ["NB-10238", { id: "NB-10238", shipmentState: "in_transit" }],
]);

export const trailheadShipments = new Map<string, TrailheadShipment>([
  ["NB-10234", { id: "NB-10234", stage: "in_transit" }],
]);
