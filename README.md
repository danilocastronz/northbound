# Northbound

Northbound is the companion codebase for *Claude Code Demystified: Your
First 30 Days With Claude Code*, by Dan Castro. It is a small, deliberately
imperfect internal tool for a fictional logistics company, tracking
shipment status across three carriers.

It is not a clean tutorial repo on purpose. Real code looks like this,
not like a fresh scaffold, and the book's Part 2 onward is built around
working with it as it actually is.

## Stack

- Node.js + TypeScript
- Express
- PostgreSQL (via `pg`), with an in-memory fallback for local dev and
  tests so you do not need Postgres running just to follow along
- Jest

## Getting started

```bash
npm install
npm test          # runs the existing test suite
npm run typecheck
npm run dev        # starts the API on http://localhost:3000
```

No database setup is required to run the app or the tests as they
stand. If you want the real Postgres connection wired up (relevant
from chapter 12 onward, when the book connects an MCP server to it):

```bash
cp .env.example .env
docker compose up -d
```

## Layout

```
src/
  carriers/
    anchor.ts       the cleanest of the three integrations
    harborline.ts    correct logic, inconsistent naming
    trailhead.ts      the newest, and the one with the bug from chapter 5
    shared.ts         status logic all three carriers call into
    __tests__/         the existing (incomplete) test suite
  server.ts           a small Express API in front of it all
  shipmentStore.ts     in-memory store standing in for Postgres locally
config/
  legacy.settings.json  the file nobody on the team fully understands
```

## Which branch should I be on?

This repo has one branch per chapter of the book, `chapter-05`,
`chapter-09`, and so on, each one a checkpoint of what the codebase
looks like by the end of that chapter. If you get stuck on something
hands-on, checking out the relevant chapter branch shows you a working
version to compare against.

`main` is the starting point, the state the book assumes you begin
from in Part 2. It intentionally has the Trailhead Cargo bug still in
it, no CLAUDE.md yet, and no skills, subagents, plugins, or MCP
configuration. Those get added chapter by chapter, on purpose, so
that following the book against this repo actually builds the same
things the book describes, rather than finding them already done for
you.

| Branch | State by the end of that chapter |
|---|---|
| `main` | Starting point: bug present, no CLAUDE.md, no skills/agents/plugins/MCP |
| `chapter-01` .. `chapter-04` | Same as `main` (these chapters don't touch the repo) |
| `chapter-05` | Trailhead Cargo delivery-timing bug fixed, regression tests added |
| `chapter-06` | CLAUDE.md added |
| `chapter-07` | CONTRIBUTING.md added |
| `chapter-08` | docs/troubleshooting.md added |
| `chapter-09` | add-carrier-integration skill added |
| `chapter-10` | northbound-toolkit plugin added, wrapping that skill |
| `chapter-11` | northbound-reviewer subagent added |
| `chapter-12` | Postgres MCP connection added (.mcp.json) |
| `chapter-13` | tools/northbound-assistant/, step1_first_request.py |
| `chapter-14` | step2_structured_prompt.py |
| `chapter-15` | step3_tool_use.py |
| `chapter-16` | assistant.py, the finished capstone CLI tool |
| `chapter-17` | Same as `chapter-16` (closing chapter, no repo changes) |

The `v1-book` tag marks the state matching this edition of the book.
