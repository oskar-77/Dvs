from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from python_backend.config.database import db

class Zone(db.Model):
    __tablename__ = 'zones'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=50)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    zone_stats = relationship('ZoneStats', back_populates='zone')
    tracking_events = relationship('TrackingEvent', back_populates='zone')

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tracking_id: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    gender: Mapped[str] = mapped_column(Text, nullable=True)
    age_range: Mapped[str] = mapped_column(Text, nullable=True)
    first_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    total_visits: Mapped[int] = mapped_column(Integer, default=1)
    is_staff: Mapped[bool] = mapped_column(Boolean, default=False)
    
    visits = relationship('Visit', back_populates='customer')
    tracking_events = relationship('TrackingEvent', back_populates='customer')

class Visit(db.Model):
    __tablename__ = 'visits'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey('customers.id'), nullable=False)
    entry_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    exit_time: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    total_dwell_time: Mapped[int] = mapped_column(Integer, nullable=True)
    
    customer = relationship('Customer', back_populates='visits')

class TrackingEvent(db.Model):
    __tablename__ = 'tracking_events'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey('customers.id'), nullable=False)
    zone_id: Mapped[int] = mapped_column(Integer, ForeignKey('zones.id'), nullable=True)
    action: Mapped[str] = mapped_column(Text, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    confidence: Mapped[float] = mapped_column(Numeric(5, 2), nullable=True)
    event_metadata: Mapped[str] = mapped_column('metadata', Text, nullable=True)
    
    customer = relationship('Customer', back_populates='tracking_events')
    zone = relationship('Zone', back_populates='tracking_events')

class Alert(db.Model):
    __tablename__ = 'alerts'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, default='active')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    resolved_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

class ZoneStats(db.Model):
    __tablename__ = 'zone_stats'
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    zone_id: Mapped[int] = mapped_column(Integer, ForeignKey('zones.id'), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    hour: Mapped[int] = mapped_column(Integer, nullable=True)
    visitor_count: Mapped[int] = mapped_column(Integer, default=0)
    avg_dwell_time: Mapped[int] = mapped_column(Integer, default=0)
    
    zone = relationship('Zone', back_populates='zone_stats')
