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

  // Notice what is missing here: nothing in this file tests what
  // happens on "out_for_final_delivery" specifically. That gap is
  // the whole story of chapter 5.
});
