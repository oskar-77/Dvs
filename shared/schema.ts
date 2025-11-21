import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  capacity: integer("capacity").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  trackingId: varchar("tracking_id", { length: 50 }).notNull().unique(),
  gender: text("gender"),
  ageRange: text("age_range"),
  firstSeen: timestamp("first_seen").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
  totalVisits: integer("total_visits").default(1),
  isStaff: boolean("is_staff").default(false),
});

export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  entryTime: timestamp("entry_time").defaultNow(),
  exitTime: timestamp("exit_time"),
  totalDwellTime: integer("total_dwell_time"),
});

export const trackingEvents = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  zoneId: integer("zone_id").references(() => zones.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  metadata: text("metadata"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  location: text("location"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const zoneStats = pgTable("zone_stats", {
  id: serial("id").primaryKey(),
  zoneId: integer("zone_id").notNull().references(() => zones.id),
  date: timestamp("date").defaultNow(),
  hour: integer("hour"),
  visitorCount: integer("visitor_count").default(0),
  avgDwellTime: integer("avg_dwell_time").default(0),
});

// Zod Schemas
export const insertZoneSchema = createInsertSchema(zones).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, firstSeen: true, lastSeen: true });
export const insertVisitSchema = createInsertSchema(visits).omit({ id: true, entryTime: true });
export const insertTrackingEventSchema = createInsertSchema(trackingEvents).omit({ id: true, timestamp: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertZoneStatsSchema = createInsertSchema(zoneStats).omit({ id: true });

// Types
export type Zone = typeof zones.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;

export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type ZoneStats = typeof zoneStats.$inferSelect;
export type InsertZoneStats = z.infer<typeof insertZoneStatsSchema>;
