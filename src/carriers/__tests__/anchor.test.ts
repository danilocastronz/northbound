import { applyAnchorEvent, AnchorShipment } from "../anchor";

describe("Anchor carrier", () => {
  function shipment(status: AnchorShipment["status"]): AnchorShipment {
    return { id: "NB-1", status };
  }

  it("moves to in_transit when out for delivery", () => {
    const result = applyAnchorEvent(shipment("pending"), {
      shipmentId: "NB-1",
      carrierStatus: "out_for_delivery",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.status).toBe("in_transit");
  });

  it("only marks delivered on a confirmation event, not just out for delivery", () => {
    const inTransit = shipment("in_transit");
    const stillNotDelivered = applyAnchorEvent(inTransit, {
      shipmentId: "NB-1",
      carrierStatus: "out_for_delivery",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(stillNotDelivered.status).not.toBe("delivered");

    const delivered = applyAnchorEvent(inTransit, {
      shipmentId: "NB-1",
      carrierStatus: "confirmed_delivery",
      timestamp: "2026-01-01T01:00:00Z",
    });
    expect(delivered.status).toBe("delivered");
  });

  it("marks a shipment delayed on a delay event", () => {
    const result = applyAnchorEvent(shipment("in_transit"), {
      shipmentId: "NB-1",
      carrierStatus: "delay_reported",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.status).toBe("delayed");
  });

  it("ignores events it does not recognize, out of order or otherwise", () => {
    const result = applyAnchorEvent(shipment("delivered"), {
      shipmentId: "NB-1",
      carrierStatus: "some_unknown_event",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.status).toBe("delivered");
  });
});
