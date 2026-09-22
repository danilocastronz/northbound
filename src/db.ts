import { Pool } from "pg";

// A real Postgres pool, used when DATABASE_URL is set (see docker-compose.yml).
// For local development and tests without Postgres running, the routes
// in server.ts fall back to the in-memory store in shipmentStore.ts.
export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;
