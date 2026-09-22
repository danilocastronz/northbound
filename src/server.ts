import express from "express";
import {
  anchorShipments,
  harborlineShipments,
  trailheadShipments,
} from "./shipmentStore";
import { applyAnchorEvent } from "./carriers/anchor";
import { applyHarborlineEvent } from "./carriers/harborline";
import { applyTrailheadEvent } from "./carriers/trailhead";
import { CarrierEvent } from "./carriers/types";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/shipments/:id", (req, res) => {
  const { id } = req.params;
  const shipment =
    anchorShipments.get(id) ??
    harborlineShipments.get(id) ??
    trailheadShipments.get(id);

  if (!shipment) {
    res.status(404).json({ error: `No shipment found with ID ${id}` });
    return;
  }
  res.json(shipment);
});

// Webhook-style endpoint each carrier integration calls when a
// shipment event comes in from that carrier.
app.post("/carriers/:carrier/events", (req, res) => {
  const { carrier } = req.params;
  const event = req.body as CarrierEvent;

  if (carrier === "anchor") {
    const current = anchorShipments.get(event.shipmentId);
    if (!current) {
      res.status(404).json({ error: "Unknown shipment" });
      return;
    }
    const updated = applyAnchorEvent(current, event);
    anchorShipments.set(event.shipmentId, updated);
    res.json(updated);
    return;
  }

  if (carrier === "harborline") {
    const current = harborlineShipments.get(event.shipmentId);
    if (!current) {
      res.status(404).json({ error: "Unknown shipment" });
      return;
    }
    const updated = applyHarborlineEvent(current, event);
    harborlineShipments.set(event.shipmentId, updated);
    res.json(updated);
    return;
  }

  if (carrier === "trailhead") {
    const current = trailheadShipments.get(event.shipmentId);
    if (!current) {
      res.status(404).json({ error: "Unknown shipment" });
      return;
    }
    const updated = applyTrailheadEvent(current, event);
    trailheadShipments.set(event.shipmentId, updated);
    res.json(updated);
    return;
  }

  res.status(404).json({ error: `Unknown carrier: ${carrier}` });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Northbound listening on port ${PORT}`);
  });
}

export default app;
