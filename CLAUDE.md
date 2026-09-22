# Northbound

## What this project does

Internal tool tracking shipment status across three carriers: Anchor,
Harborline, and Trailhead Cargo.

## Commands

- Run tests: `npm test`
- Typecheck: `npm run typecheck`
- Run the dev server: `npm run dev`

## Conventions

- Shipment status field naming is NOT consistent across carriers:
  - Anchor uses `status`
  - Harborline uses `shipmentState`
  - Trailhead Cargo uses `stage`
  - New carrier integrations should follow Anchor's pattern (`status`),
    not the other two. See the add-carrier-integration skill.
- A shipment should only ever be marked `delivered` after a carrier's
  confirmation event (`confirmed_delivery` or `pod_received`), never
  from an "out for delivery" style signal alone. See shared.ts.

## Things to know

- config/legacy.settings.json is old and poorly understood by the
  current team. Ask before changing it.
- The existing test suite is incomplete. Absence of a test for a
  given case does not mean that case is handled correctly.

## Never touch

- Do not modify config/legacy.settings.json without asking first.
- Do not commit directly to main.

## MCP

A Postgres MCP server is configured in .mcp.json, scoped to this
project. Once connected (see README.md), you can ask Claude to check
the actual shipments table directly instead of guessing at its shape.
Treat it like any other tool: review before trusting a write, and
never point it at anything but a local or staging database.
