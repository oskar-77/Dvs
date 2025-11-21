from flask import Blueprint, jsonify, request
from sqlalchemy import func
from datetime import datetime, timedelta
from python_backend.models.models import Zone, Customer, Visit, TrackingEvent, Alert, ZoneStats
from python_backend.config.database import db
from python_backend.ai_detection.detector import detector
import numpy as np
import cv2

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/stats/overview', methods=['GET'])
def get_overview_stats():
    try:
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        
        total_visitors = db.session.query(func.count(Visit.id)).filter(
            Visit.entry_time >= today_start
        ).scalar() or 0
        
        current_occupancy = db.session.query(func.count(Visit.id)).filter(
            Visit.entry_time >= today_start,
            Visit.exit_time.is_(None)
        ).scalar() or 0
        
        avg_dwell = db.session.query(func.avg(Visit.total_dwell_time)).filter(
            Visit.entry_time >= today_start,
            Visit.total_dwell_time.isnot(None)
        ).scalar() or 0
        
        zone_engagement = db.session.query(func.avg(ZoneStats.visitor_count)).filter(
            ZoneStats.date >= today_start
        ).scalar() or 0
        
        return jsonify({
            'total_visitors': int(total_visitors),
            'current_occupancy': int(current_occupancy),
            'avg_dwell_time': int(avg_dwell),
            'zone_engagement': round(float(zone_engagement), 1)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/tracking/live', methods=['GET'])
def get_live_tracking():
    try:
        active_visits = db.session.query(Visit).filter(
            Visit.exit_time.is_(None)
        ).limit(10).all()
        
        customers_data = []
        for visit in active_visits:
            customer = db.session.query(Customer).filter_by(id=visit.customer_id).first()
            if customer:
                customers_data.append({
                    'id': customer.tracking_id,
                    'gender': customer.gender,
                    'ageRange': customer.age_range,
                    'isStaff': customer.is_staff,
                    'entryTime': visit.entry_time.isoformat() if visit.entry_time else None
                })
        
        return jsonify(customers_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analytics/demographics', methods=['GET'])
def get_demographics():
    try:
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        
        visits_today = db.session.query(Visit).filter(
            Visit.entry_time >= today_start
        ).all()
        
        customer_ids = [v.customer_id for v in visits_today]
        customers = db.session.query(Customer).filter(
            Customer.id.in_(customer_ids)
        ).all() if customer_ids else []
        
        demographics = {
            'male': sum(1 for c in customers if c.gender == 'Male'),
            'female': sum(1 for c in customers if c.gender == 'Female'),
            'age_distribution': {
                '0-12': 0, '13-19': 0, '20-35': 0,
                '36-50': 0, '51-70': 0, '70+': 0
            }
        }
        
        for customer in customers:
            if customer.age_range in demographics['age_distribution']:
                demographics['age_distribution'][customer.age_range] += 1
        
        return jsonify(demographics)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analytics/traffic', methods=['GET'])
def get_traffic():
    try:
        today = datetime.utcnow().date()
        today_start = datetime.combine(today, datetime.min.time())
        
        traffic_data = []
        for hour in range(24):
            hour_start = today_start + timedelta(hours=hour)
            hour_end = hour_start + timedelta(hours=1)
            
            count = db.session.query(func.count(Visit.id)).filter(
                Visit.entry_time >= hour_start,
                Visit.entry_time < hour_end
            ).scalar() or 0
            
            traffic_data.append({
                'hour': f'{hour:02d}:00',
                'visitors': int(count)
            })
        
        return jsonify(traffic_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/zones', methods=['GET', 'POST'])
def handle_zones():
    try:
        if request.method == 'GET':
            zones = db.session.query(Zone).all()
            return jsonify([{
                'id': z.id,
                'name': z.name,
                'type': z.type,
                'capacity': z.capacity,
                'createdAt': z.created_at.isoformat() if z.created_at else None
            } for z in zones])
        
        elif request.method == 'POST':
            data = request.get_json()
            zone = Zone(
                name=data.get('name'),
                type=data.get('type'),
                capacity=data.get('capacity', 50)
            )
            db.session.add(zone)
            db.session.commit()
            
            return jsonify({
                'id': zone.id,
                'name': zone.name,
                'type': zone.type,
                'capacity': zone.capacity
            }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/zones/stats', methods=['GET'])
def get_zone_stats():
    try:
        zone_id = request.args.get('zoneId', type=int)
        
        query = db.session.query(ZoneStats)
        if zone_id:
            query = query.filter_by(zone_id=zone_id)
        
        stats = query.all()
        
        return jsonify([{
            'zoneId': s.zone_id,
            'date': s.date.isoformat() if s.date else None,
            'hour': s.hour,
            'visitorCount': s.visitor_count,
            'avgDwellTime': s.avg_dwell_time
        } for s in stats])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/alerts', methods=['GET', 'POST'])
def handle_alerts():
    try:
        if request.method == 'GET':
            status = request.args.get('status')
            
            query = db.session.query(Alert)
            if status:
                query = query.filter_by(status=status)
            
            alerts = query.order_by(Alert.created_at.desc()).all()
            
            return jsonify([{
                'id': a.id,
                'type': a.type,
                'title': a.title,
                'message': a.message,
                'location': a.location,
                'status': a.status,
                'createdAt': a.created_at.isoformat() if a.created_at else None,
                'resolvedAt': a.resolved_at.isoformat() if a.resolved_at else None
            } for a in alerts])
        
        elif request.method == 'POST':
            data = request.get_json()
            alert = Alert(
                type=data.get('type'),
                title=data.get('title'),
                message=data.get('message'),
                location=data.get('location'),
                status=data.get('status', 'active')
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'id': alert.id, 'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/alerts/<int:id>/resolve', methods=['PATCH'])
def resolve_alert(id):
    try:
        alert = db.session.query(Alert).filter_by(id=id).first()
        if not alert:
            return jsonify({'error': 'Alert not found'}), 404
        
        alert.status = 'resolved'
        alert.resolved_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/customers', methods=['GET', 'POST'])
def handle_customers():
    try:
        if request.method == 'GET':
            customers = db.session.query(Customer).all()
            return jsonify([{
                'id': c.id,
                'trackingId': c.tracking_id,
                'gender': c.gender,
                'ageRange': c.age_range,
                'firstSeen': c.first_seen.isoformat() if c.first_seen else None,
                'lastSeen': c.last_seen.isoformat() if c.last_seen else None,
                'totalVisits': c.total_visits,
                'isStaff': c.is_staff
            } for c in customers])
        
        elif request.method == 'POST':
            data = request.get_json()
            customer = Customer(
                tracking_id=data.get('trackingId'),
                gender=data.get('gender'),
                age_range=data.get('ageRange'),
                is_staff=data.get('isStaff', False)
            )
            db.session.add(customer)
            db.session.commit()
            
            return jsonify({'id': customer.id, 'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/tracking/events', methods=['GET', 'POST'])
def handle_tracking_events():
    try:
        if request.method == 'GET':
            limit = request.args.get('limit', type=int, default=100)
            events = db.session.query(TrackingEvent).order_by(
                TrackingEvent.timestamp.desc()
            ).limit(limit).all()
            
            return jsonify([{
                'id': e.id,
                'customerId': e.customer_id,
                'zoneId': e.zone_id,
                'action': e.action,
                'timestamp': e.timestamp.isoformat() if e.timestamp else None,
                'confidence': float(e.confidence) if e.confidence else None,
                'metadata': e.event_metadata
            } for e in events])
        
        elif request.method == 'POST':
            data = request.get_json()
            event = TrackingEvent(
                customer_id=data.get('customerId'),
                zone_id=data.get('zoneId'),
                action=data.get('action'),
                confidence=data.get('confidence'),
                event_metadata=data.get('metadata')
            )
            db.session.add(event)
            db.session.commit()
            
            return jsonify({'id': event.id, 'success': True}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api_bp.route('/ai/detect', methods=['POST'])
def ai_detect():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        detections = detector.detect_people(frame)
        demographics = detector.analyze_demographics(detections)
        
        return jsonify({
            'detections': detections,
            'demographics': demographics,
            'count': len(detections)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
