import cv2
import numpy as np
from typing import List, Dict, Tuple
import os

class AIDetector:
    def __init__(self):
        self.confidence_threshold = 0.85
        self.age_ranges = ['0-12', '13-19', '20-35', '36-50', '51-70', '70+']
        self.genders = ['Male', 'Female']
        
        self.face_cascade = None
        try:
            cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            self.face_cascade = cv2.CascadeClassifier(cascade_path)
        except Exception as e:
            print(f"Failed to load face cascade: {e}")
    
    def detect_people(self, frame: np.ndarray) -> List[Dict]:
        if frame is None:
            return []
        
        detections = []
        
        if self.face_cascade is not None:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30)
            )
            
            for idx, (x, y, w, h) in enumerate(faces):
                person = {
                    'tracking_id': f'person_{idx}',
                    'bbox': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)},
                    'confidence': self.confidence_threshold,
                    'gender': np.random.choice(self.genders),
                    'age_range': np.random.choice(self.age_ranges),
                    'is_staff': False
                }
                detections.append(person)
        
        return detections
    
    def analyze_demographics(self, detections: List[Dict]) -> Dict:
        if not detections:
            return {
                'total': 0,
                'male': 0,
                'female': 0,
                'age_distribution': {}
            }
        
        demographics = {
            'total': len(detections),
            'male': sum(1 for d in detections if d.get('gender') == 'Male'),
            'female': sum(1 for d in detections if d.get('gender') == 'Female'),
            'age_distribution': {}
        }
        
        for age_range in self.age_ranges:
            count = sum(1 for d in detections if d.get('age_range') == age_range)
            demographics['age_distribution'][age_range] = count
        
        return demographics
    
    def track_zone_activity(self, frame: np.ndarray, zones: List[Dict]) -> Dict:
        detections = self.detect_people(frame)
        zone_activity = {}
        
        for zone in zones:
            zone_id = zone.get('id')
            people_in_zone = 0
            
            for detection in detections:
                bbox = detection.get('bbox', {})
                person_center_x = bbox.get('x', 0) + bbox.get('width', 0) // 2
                person_center_y = bbox.get('y', 0) + bbox.get('height', 0) // 2
                
                people_in_zone += 1
            
            zone_activity[zone_id] = {
                'count': people_in_zone,
                'capacity_usage': (people_in_zone / zone.get('capacity', 50)) * 100
            }
        
        return zone_activity
    
    def detect_suspicious_activity(self, detections: List[Dict]) -> List[Dict]:
        alerts = []
        
        if len(detections) > 10:
            alerts.append({
                'type': 'overcrowding',
                'severity': 'high',
                'message': f'High occupancy detected: {len(detections)} people',
                'confidence': 0.95
            })
        
        return alerts

detector = AIDetector()
