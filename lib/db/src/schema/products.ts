import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull().default([]),
  category: text("category").notNull(),
  categoryName: text("category_name").notNull(),
  originalPrice: numeric("original_price", { mode: "number" }).notNull(),
  salePrice: numeric("sale_price", { mode: "number" }).notNull(),
  images: text("images").array().notNull().default([]),
  sizes: text("sizes").array().notNull().default([]),
  colors: text("colors").array().notNull().default([]),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  isBestSeller: boolean("is_best_seller").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  rating: numeric("rating", { mode: "number" }).notNull().default(5),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({
  createdAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
