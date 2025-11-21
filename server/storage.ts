import { db } from "../db";
import { 
  customers, zones, visits, trackingEvents, alerts, zoneStats,
  type Customer, type InsertCustomer,
  type Zone, type InsertZone,
  type Visit, type InsertVisit,
  type TrackingEvent, type InsertTrackingEvent,
  type Alert, type InsertAlert,
  type ZoneStats, type InsertZoneStats
} from "@shared/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByTrackingId(trackingId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomerLastSeen(id: number): Promise<void>;
  
  // Zones
  getZones(): Promise<Zone[]>;
  getZone(id: number): Promise<Zone | undefined>;
  createZone(zone: InsertZone): Promise<Zone>;
  
  // Visits
  getActiveVisits(): Promise<Visit[]>;
  getVisitsByCustomer(customerId: number): Promise<Visit[]>;
  createVisit(visit: InsertVisit): Promise<Visit>;
  endVisit(id: number, exitTime: Date, dwellTime: number): Promise<void>;
  
  // Tracking Events
  getRecentEvents(limit?: number): Promise<TrackingEvent[]>;
  createTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
  
  // Alerts
  getAlerts(status?: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<void>;
  
  // Zone Stats
  getZoneStats(zoneId?: number, date?: Date): Promise<ZoneStats[]>;
  createZoneStats(stats: InsertZoneStats): Promise<ZoneStats>;
  
  // Analytics
  getOverviewStats(): Promise<{
    totalVisitors: number;
    currentOccupancy: number;
    avgDwellTime: number;
    totalVisitsToday: number;
  }>;
  getDemographics(): Promise<{
    ageDistribution: { name: string; value: number }[];
    genderDistribution: { name: string; value: number }[];
  }>;
  getHourlyTraffic(): Promise<{ time: string; visitors: number; entry: number; exit: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // Customers
  async getCustomers(): Promise<Customer[]> {
    return db.select().from(customers).orderBy(desc(customers.lastSeen));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async getCustomerByTrackingId(trackingId: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.trackingId, trackingId));
    return result[0];
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomerLastSeen(id: number): Promise<void> {
    await db.update(customers)
      .set({ lastSeen: new Date() })
      .where(eq(customers.id, id));
  }

  // Zones
  async getZones(): Promise<Zone[]> {
    return db.select().from(zones);
  }

  async getZone(id: number): Promise<Zone | undefined> {
    const result = await db.select().from(zones).where(eq(zones.id, id));
    return result[0];
  }

  async createZone(zone: InsertZone): Promise<Zone> {
    const result = await db.insert(zones).values(zone).returning();
    return result[0];
  }

  // Visits
  async getActiveVisits(): Promise<Visit[]> {
    return db.select().from(visits).where(sql`${visits.exitTime} IS NULL`);
  }

  async getVisitsByCustomer(customerId: number): Promise<Visit[]> {
    return db.select().from(visits).where(eq(visits.customerId, customerId));
  }

  async createVisit(visit: InsertVisit): Promise<Visit> {
    const result = await db.insert(visits).values(visit).returning();
    return result[0];
  }

  async endVisit(id: number, exitTime: Date, dwellTime: number): Promise<void> {
    await db.update(visits)
      .set({ exitTime, totalDwellTime: dwellTime })
      .where(eq(visits.id, id));
  }

  // Tracking Events
  async getRecentEvents(limit: number = 100): Promise<TrackingEvent[]> {
    return db.select().from(trackingEvents)
      .orderBy(desc(trackingEvents.timestamp))
      .limit(limit);
  }

  async createTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent> {
    const result = await db.insert(trackingEvents).values(event).returning();
    return result[0];
  }

  // Alerts
  async getAlerts(status?: string): Promise<Alert[]> {
    if (status) {
      return db.select().from(alerts)
        .where(eq(alerts.status, status))
        .orderBy(desc(alerts.createdAt));
    }
    return db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async resolveAlert(id: number): Promise<void> {
    await db.update(alerts)
      .set({ status: 'resolved', resolvedAt: new Date() })
      .where(eq(alerts.id, id));
  }

  // Zone Stats
  async getZoneStats(zoneId?: number, date?: Date): Promise<ZoneStats[]> {
    let query = db.select().from(zoneStats);
    
    if (zoneId) {
      query = query.where(eq(zoneStats.zoneId, zoneId)) as any;
    }
    
    return query;
  }

  async createZoneStats(stats: InsertZoneStats): Promise<ZoneStats> {
    const result = await db.insert(zoneStats).values(stats).returning();
    return result[0];
  }

  // Analytics
  async getOverviewStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalVisitorsResult] = await db.select({ 
      count: sql<number>`count(distinct ${customers.id})` 
    }).from(customers);

    const activeVisits = await this.getActiveVisits();
    
    const [avgDwellResult] = await db.select({
      avg: sql<number>`avg(${visits.totalDwellTime})`
    }).from(visits).where(sql`${visits.totalDwellTime} IS NOT NULL`);

    const [todayVisitsResult] = await db.select({
      count: sql<number>`count(*)`
    }).from(visits).where(gte(visits.entryTime, today));

    return {
      totalVisitors: Number(totalVisitorsResult?.count || 0),
      currentOccupancy: activeVisits.length,
      avgDwellTime: Math.round(Number(avgDwellResult?.avg || 0)),
      totalVisitsToday: Number(todayVisitsResult?.count || 0)
    };
  }

  async getDemographics() {
    const ageDistResult = await db.select({
      ageRange: customers.ageRange,
      count: sql<number>`count(*)`
    })
    .from(customers)
    .groupBy(customers.ageRange);

    const genderDistResult = await db.select({
      gender: customers.gender,
      count: sql<number>`count(*)`
    })
    .from(customers)
    .groupBy(customers.gender);

    const ageDistribution = ageDistResult.map(r => ({
      name: r.ageRange || 'Unknown',
      value: Number(r.count)
    }));

    const genderDistribution = genderDistResult.map(r => ({
      name: r.gender || 'Unknown',
      value: Number(r.count)
    }));

    return { ageDistribution, genderDistribution };
  }

  async getHourlyTraffic() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await db.select({
      hour: sql<number>`EXTRACT(HOUR FROM ${visits.entryTime})`,
      count: sql<number>`count(*)`
    })
    .from(visits)
    .where(gte(visits.entryTime, today))
    .groupBy(sql`EXTRACT(HOUR FROM ${visits.entryTime})`);

    const hourlyData: { time: string; visitors: number; entry: number; exit: number }[] = [];
    
    for (let i = 9; i <= 18; i++) {
      const found = result.find(r => Number(r.hour) === i);
      hourlyData.push({
        time: `${i.toString().padStart(2, '0')}:00`,
        visitors: found ? Number(found.count) : 0,
        entry: found ? Number(found.count) : 0,
        exit: Math.floor((found ? Number(found.count) : 0) * 0.8)
      });
    }

    return hourlyData;
  }
}

export const storage = new DatabaseStorage();
