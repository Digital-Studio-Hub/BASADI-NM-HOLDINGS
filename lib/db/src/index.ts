import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let pool: pg.Pool | null = null;
let drizzleDb: ReturnType<typeof drizzle> | null = null;

function initializeDatabase() {
  if (pool && drizzleDb) return { pool, db: drizzleDb };

  if (!process.env.DATABASE_URL) {
    const msg = "DATABASE_URL is not set. Database queries will fail.";
    console.warn(msg);
    return { pool: null, db: null };
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  drizzleDb = drizzle(pool, { schema });
  console.info("Database initialized");
  return { pool, db: drizzleDb };
}

export function getDatabase() {
  return initializeDatabase();
}

export const exportedPool = new Proxy({} as pg.Pool, {
  get(_target, prop, receiver) {
    const { pool: p } = initializeDatabase();
    if (!p) throw new Error("DATABASE_URL must be set to use database");

    const value = Reflect.get(p as object, prop, receiver);
    return typeof value === "function" ? value.bind(p) : value;
  },
});

export const db = new Proxy({} as NonNullable<ReturnType<typeof drizzle>>, {
  get(_target, prop, receiver) {
    const { db: d } = initializeDatabase();
    if (!d) throw new Error("DATABASE_URL must be set to use database");

    const value = Reflect.get(d as object, prop, receiver);
    return typeof value === "function" ? value.bind(d) : value;
  },
});

export { exportedPool as pool };

export * from "./schema";
