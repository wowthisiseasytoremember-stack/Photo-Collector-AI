import { pgTable, serial, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  albumUrl: text("album_url").notNull(),
  imageUrl: text("image_url").notNull(),
  itemName: text("item_name"),
  category: text("category"),
  conditionNotes: text("condition_notes"),
  estimatedYear: text("estimated_year"),
  keyFeatures: jsonb("key_features").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export const processAlbumSchema = z.object({
  albumUrl: z.string().url("Please enter a valid URL"),
});

export type ProcessAlbumRequest = z.infer<typeof processAlbumSchema>;
