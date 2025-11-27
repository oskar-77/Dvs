import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import random
from python_backend.app import create_app
from python_backend.models.models import Zone, Customer, Visit, Alert, ZoneStats, TrackingEvent, Camera
from python_backend.config.database import db

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("Clearing existing data...")
        TrackingEvent.query.delete()
        ZoneStats.query.delete()
        Visit.query.delete()
        Alert.query.delete()
        Customer.query.delete()
        Zone.query.delete()
        Camera.query.delete()
        db.session.commit()
        
        print("Creating zones...")
        zones_data = [
            {'name': 'Entrance', 'type': 'entrance', 'capacity': 20},
            {'name': 'Apparel Section', 'type': 'shopping', 'capacity': 50},
            {'name': 'Electronics', 'type': 'shopping', 'capacity': 40},
            {'name': 'Checkout Area', 'type': 'checkout', 'capacity': 30},
            {'name': 'Food Court', 'type': 'dining', 'capacity': 60}
        ]
        
        zones = []
        for zone_data in zones_data:
            zone = Zone(**zone_data)
            zones.append(zone)
            db.session.add(zone)
        
        db.session.commit()
        print(f"Created {len(zones)} zones")
        
        print("Creating customers...")
        genders = ['Male', 'Female']
        age_ranges = ['0-12', '13-19', '20-35', '36-50', '51-70', '70+']
        
        customers = []
        for i in range(50):
            customer = Customer(
                tracking_id=f'CUST_{i:04d}',
                gender=random.choice(genders),
                age_range=random.choice(age_ranges),
                first_seen=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
                last_seen=datetime.utcnow() - timedelta(hours=random.randint(0, 24)),
                total_visits=random.randint(1, 10),
                is_staff=i < 5
            )
            customers.append(customer)
            db.session.add(customer)
        
        db.session.commit()
        print(f"Created {len(customers)} customers")
        
        print("Creating visits...")
        visits = []
        for i in range(100):
            customer = random.choice(customers)
            entry_time = datetime.utcnow() - timedelta(hours=random.randint(0, 48))
            
            visit = Visit(
                customer_id=customer.id,
                entry_time=entry_time,
                exit_time=entry_time + timedelta(minutes=random.randint(10, 120)) if random.random() > 0.3 else None,
                total_dwell_time=random.randint(600, 7200) if random.random() > 0.3 else None
            )
            visits.append(visit)
            db.session.add(visit)
        
        db.session.commit()
        print(f"Created {len(visits)} visits")
        
        print("Creating alerts...")
        alert_types = [
            ('critical', 'Crowd Density Limit Exceeded', 'Zone has exceeded maximum capacity (45/40 people).'),
            ('critical', 'Blacklisted Person Identified', 'Match found in database with 92% confidence.'),
            ('warning', 'Long Queue Detected', 'Checkout line waiting time > 5 minutes.'),
            ('warning', 'Loitering Detected', 'Person detected dwelling > 20 mins without interaction.'),
            ('info', 'Staff Entered Restricted Area', 'Staff member detected in Server Room.'),
            ('info', 'Camera Feed Restored', 'Connection to camera #2 re-established.')
        ]
        
        alerts = []
        for i in range(10):
            alert_type, title, message = random.choice(alert_types)
            alert = Alert(
                type=alert_type,
                title=title,
                message=message,
                location=random.choice([z.name for z in zones]),
                status='active' if random.random() > 0.5 else 'resolved',
                created_at=datetime.utcnow() - timedelta(hours=random.randint(0, 24))
            )
            alerts.append(alert)
            db.session.add(alert)
        
        db.session.commit()
        print(f"Created {len(alerts)} alerts")
        
        print("Creating camera...")
        camera = Camera(
            name="Main Entrance Camera",
            camera_index=0,
            location="Main Entrance",
            status="active"
        )
        db.session.add(camera)
        db.session.commit()
        
        from python_backend.camera import camera_manager
        try:
            camera_manager.add_camera(0)
            print("Created and activated camera")
        except Exception as e:
            print(f"Camera created in DB but couldn't activate (normal if no physical camera): {e}")
        
        print("Creating zone stats...")
        for zone in zones:
            for day in range(7):
                for hour in range(24):
                    if random.random() > 0.3:
                        stat = ZoneStats(
                            zone_id=zone.id,
                            date=datetime.utcnow() - timedelta(days=day, hours=hour),
                            hour=hour,
                            visitor_count=random.randint(0, zone.capacity),
                            avg_dwell_time=random.randint(300, 3600)
                        )
                        db.session.add(stat)
        
        db.session.commit()
        print("Database seeding completed!")

if __name__ == '__main__':
    seed_database()
