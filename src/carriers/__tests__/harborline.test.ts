import { applyHarborlineEvent, HarborlineShipment } from "../harborline";

describe("Harborline carrier", () => {
  function shipment(
    shipmentState: HarborlineShipment["shipmentState"]
  ): HarborlineShipment {
    return { id: "NB-2", shipmentState };
  }

  it("moves to in_transit when en route", () => {
    const result = applyHarborlineEvent(shipment("pending"), {
      shipmentId: "NB-2",
      carrierStatus: "en_route",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.shipmentState).toBe("in_transit");
  });

  it("only marks delivered on a confirmation event", () => {
    const delivered = applyHarborlineEvent(shipment("in_transit"), {
      shipmentId: "NB-2",
      carrierStatus: "pod_received",
      timestamp: "2026-01-01T01:00:00Z",
    });
    expect(delivered.shipmentState).toBe("delivered");
  });

  it("marks a shipment delayed on a delay event", () => {
    const result = applyHarborlineEvent(shipment("in_transit"), {
      shipmentId: "NB-2",
      carrierStatus: "delay_reported",
      timestamp: "2026-01-01T00:00:00Z",
    });
    expect(result.shipmentState).toBe("delayed");
  });
});
