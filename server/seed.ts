import { storage } from "./storage";

const zones = [
  { name: "Main Entrance", type: "entrance", capacity: 100 },
  { name: "Apparel Section", type: "shopping", capacity: 40 },
  { name: "Electronics", type: "shopping", capacity: 35 },
  { name: "Home Goods", type: "shopping", capacity: 30 },
  { name: "Checkout", type: "checkout", capacity: 20 },
];

const genders = ["Male", "Female"];
const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55+"];
const actions = ["Walking", "Browsing", "Standing"];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedDatabase() {
  console.log("🌱 Starting database seed...");

  // Create zones
  console.log("Creating zones...");
  const createdZones = [];
  for (const zone of zones) {
    const created = await storage.createZone(zone);
    createdZones.push(created);
  }
  console.log(`✓ Created ${createdZones.length} zones`);

  // Create customers and visits
  console.log("Creating customers and visits...");
  const customerCount = 50;
  const createdCustomers = [];

  for (let i = 0; i < customerCount; i++) {
    const customer = await storage.createCustomer({
      trackingId: `TRACK-${Date.now()}-${i}`,
      gender: randomElement(genders),
      ageRange: randomElement(ageRanges),
      totalVisits: randomInt(1, 5),
      isStaff: Math.random() < 0.1,
    });
    createdCustomers.push(customer);

    // Create visit for this customer
    const isActive = Math.random() < 0.3; // 30% chance of active visit
    const entryTime = new Date(Date.now() - randomInt(1000, 7200000)); // Last 2 hours
    
    const visit = await storage.createVisit({
      customerId: customer.id,
      exitTime: isActive ? null : new Date(entryTime.getTime() + randomInt(300000, 3600000)),
      totalDwellTime: isActive ? null : randomInt(300, 3600),
    });

    // Create tracking events for this customer
    for (let j = 0; j < randomInt(3, 8); j++) {
      await storage.createTrackingEvent({
        customerId: customer.id,
        zoneId: randomElement(createdZones).id,
        action: randomElement(actions),
        confidence: (Math.random() * 10 + 90).toFixed(2),
        metadata: JSON.stringify({ x: randomInt(10, 90), y: randomInt(10, 80) }),
      });
    }
  }
  console.log(`✓ Created ${createdCustomers.length} customers with visits and events`);

  // Create some alerts
  console.log("Creating alerts...");
  const alertsData = [
    {
      type: "critical",
      title: "Crowd Density Limit Exceeded",
      message: "Zone 'Apparel' has exceeded maximum capacity (45/40 people).",
      location: "Zone A - Apparel",
      status: "active",
    },
    {
      type: "warning",
      title: "Long Queue Detected",
      message: "Checkout line waiting time > 5 minutes.",
      location: "Zone C - Checkout",
      status: "active",
    },
    {
      type: "info",
      title: "Staff Entered Restricted Area",
      message: "Staff ID #442 detected in Server Room.",
      location: "Back Office",
      status: "resolved",
    },
  ];

  for (const alert of alertsData) {
    await storage.createAlert(alert);
  }
  console.log(`✓ Created ${alertsData.length} alerts`);

  // Create zone stats
  console.log("Creating zone statistics...");
  const today = new Date();
  for (const zone of createdZones) {
    for (let hour = 9; hour <= 18; hour++) {
      await storage.createZoneStats({
        zoneId: zone.id,
        date: today,
        hour,
        visitorCount: randomInt(10, 80),
        avgDwellTime: randomInt(180, 1200),
      });
    }
  }
  console.log("✓ Created zone statistics");

  console.log("✅ Database seeding complete!");
}

export { seedDatabase };

// Run seed
seedDatabase()
  .then(() => {
    console.log("Seed completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
