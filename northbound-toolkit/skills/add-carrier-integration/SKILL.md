---
name: add-carrier-integration
description: Scaffolds a new carrier integration module for Northbound,
  following the project's conventions. Use when the user asks to add
  support for a new shipping carrier, or add a new carrier integration.
---

# Add a Carrier Integration

Northbound has three existing carrier integrations in src/carriers/,
and they are not fully consistent with each other. New integrations
should follow the cleanest of the three, anchor.ts, not the other two.

When adding a new carrier:

1. Create a new file in src/carriers/, named after the carrier in
   lowercase, matching the pattern in anchor.ts.
2. Use `status` as the field name for shipment state, matching
   anchor.ts. Do not use `shipmentState` or `stage`, those exist in
   the other two modules for historical reasons only and should not
   be copied into new code.
3. Register the new module in src/carriers/index.ts.
4. Write tests in the matching file under src/carriers/__tests__/,
   covering at minimum: a normal delivery, a delayed shipment, and
   an out of order status update.
5. Do not modify config/legacy.settings.json unless the carrier
   specifically requires a new entry there. Ask first if you think
   it does.
