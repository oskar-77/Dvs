import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAlertSchema, insertCustomerSchema, insertTrackingEventSchema, insertVisitSchema, insertZoneSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Overview Stats
  app.get("/api/stats/overview", async (req, res) => {
    try {
      const stats = await storage.getOverviewStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch overview stats" });
    }
  });

  // Live Tracking Data
  app.get("/api/tracking/live", async (req, res) => {
    try {
      const activeVisits = await storage.getActiveVisits();
      const customersData = [];
      
      for (const visit of activeVisits.slice(0, 10)) {
        const customer = await storage.getCustomer(visit.customerId);
        if (customer) {
          customersData.push({
            id: customer.trackingId,
            gender: customer.gender,
            ageRange: customer.ageRange,
            isStaff: customer.isStaff,
            entryTime: visit.entryTime
          });
        }
      }
      
      res.json(customersData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch live tracking data" });
    }
  });

  // Demographics
  app.get("/api/analytics/demographics", async (req, res) => {
    try {
      const demographics = await storage.getDemographics();
      res.json(demographics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch demographics" });
    }
  });

  // Hourly Traffic
  app.get("/api/analytics/traffic", async (req, res) => {
    try {
      const traffic = await storage.getHourlyTraffic();
      res.json(traffic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch traffic data" });
    }
  });

  // Zones
  app.get("/api/zones", async (req, res) => {
    try {
      const zones = await storage.getZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch zones" });
    }
  });

  app.post("/api/zones", async (req, res) => {
    try {
      const zone = insertZoneSchema.parse(req.body);
      const created = await storage.createZone(zone);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid zone data" });
    }
  });

  // Zone Stats
  app.get("/api/zones/stats", async (req, res) => {
    try {
      const zoneId = req.query.zoneId ? parseInt(req.query.zoneId as string) : undefined;
      const stats = await storage.getZoneStats(zoneId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch zone stats" });
    }
  });

  // Alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const alerts = await storage.getAlerts(status);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const alert = insertAlertSchema.parse(req.body);
      const created = await storage.createAlert(alert);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid alert data" });
    }
  });

  app.patch("/api/alerts/:id/resolve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.resolveAlert(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve alert" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customer = insertCustomerSchema.parse(req.body);
      const created = await storage.createCustomer(customer);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid customer data" });
    }
  });

  // Tracking Events
  app.get("/api/tracking/events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const events = await storage.getRecentEvents(limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tracking events" });
    }
  });

  app.post("/api/tracking/events", async (req, res) => {
    try {
      const event = insertTrackingEventSchema.parse(req.body);
      const created = await storage.createTrackingEvent(event);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid event data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
