import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { logger } from "pino";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (pool) return { pool, db };

  if (!process.env.DATABASE_URL) {
    const msg = "DATABASE_URL is not set. Database queries will fail.";
    console.warn(msg);
    return { pool: null, db: null };
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
  console.info("Database initialized");
  return { pool, db };
}

export function getDatabase() {
  return initializeDatabase();
}

// Lazy initialization on first access
Object.defineProperty(exports, "pool", {
  get: () => {
    const { pool: p } = initializeDatabase();
    if (!p) throw new Error("DATABASE_URL must be set to use database");
    return p;
  },
});

Object.defineProperty(exports, "db", {
  get: () => {
    const { db: d } = initializeDatabase();
    if (!d) throw new Error("DATABASE_URL must be set to use database");
    return d;
  },
});

export * from "./schema";
