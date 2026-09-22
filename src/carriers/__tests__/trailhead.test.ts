import { applyTrailheadEvent, TrailheadShipment } from "../trailhead";

describe("Trailhead Cargo carrier", () => {
  function shipment(stage: TrailheadShipment["stage"]): TrailheadShipment {
    return { id: "NB-3", stage };
  }

  it("marks a shipment delayed on a delay event", () => {
    const result = applyTrailheadEvent(shipment("in_transit"), {
      shipmentId: "NB-3",
      carrierStatus: "delay_reported",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.stage).toBe("delayed");
  });

  it("ignores events it does not recognize", () => {
    const result = applyTrailheadEvent(shipment("pending"), {
      shipmentId: "NB-3",
      carrierStatus: "some_unknown_event",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.stage).toBe("pending");
  });

  // Regression test for the chapter 5 bug: "out_for_final_delivery"
  // must NOT resolve to delivered on its own. Northbound waits for a
  // separate confirmation event, exactly like Anchor and Harborline.
  it("does not mark delivered on out_for_final_delivery alone", () => {
    const result = applyTrailheadEvent(shipment("in_transit"), {
      shipmentId: "NB-3",
      carrierStatus: "out_for_final_delivery",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.stage).toBe("in_transit");
    expect(result.stage).not.toBe("delivered");
  });

  it("marks delivered once the confirmation event actually arrives", () => {
    const outForDelivery = shipment("in_transit");
    const delivered = applyTrailheadEvent(outForDelivery, {
      shipmentId: "NB-3",
      carrierStatus: "confirmed_delivery",
      timestamp: "2026-01-01T02:00:00Z",
    });
    expect(delivered.stage).toBe("delivered");
  });

  it("handles the out-of-order case: final delivery signal arriving after confirmation", () => {
    const delivered = shipment("delivered");
    const result = applyTrailheadEvent(delivered, {
      shipmentId: "NB-3",
      carrierStatus: "out_for_final_delivery",
      timestamp: "2026-01-01T03:00:00Z",
    });
    // Should not regress an already-delivered shipment back to in_transit.
    expect(result.stage).toBe("delivered");
  });
});
