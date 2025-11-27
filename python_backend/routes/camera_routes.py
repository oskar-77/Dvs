from flask import Blueprint, jsonify, request, Response
import cv2
import numpy as np
from python_backend.models.models import Camera
from python_backend.config.database import db
from python_backend.camera import camera_manager
from python_backend.ai_detection.detector import detector

camera_bp = Blueprint('camera', __name__, url_prefix='/api/cameras')

@camera_bp.route('', methods=['GET'])
def list_cameras():
    try:
        cameras = db.session.query(Camera).all()
        active_cameras = camera_manager.get_active_cameras()
        
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'cameraIndex': c.camera_index,
            'location': c.location,
            'status': c.status,
            'isActive': c.camera_index in active_cameras,
            'rtspUrl': c.rtsp_url,
            'createdAt': c.created_at.isoformat() if c.created_at else None
        } for c in cameras])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@camera_bp.route('', methods=['POST'])
def add_camera():
    try:
        data = request.get_json()
        name = data.get('name')
        camera_index = data.get('cameraIndex')
        location = data.get('location')
        rtsp_url = data.get('rtspUrl')
        
        if camera_index is None:
            return jsonify({'error': 'رقم الكاميرا مطلوب'}), 400
        
        if not name:
            return jsonify({'error': 'اسم الكاميرا مطلوب'}), 400
        
        existing = db.session.query(Camera).filter_by(camera_index=camera_index).first()
        if existing:
            return jsonify({'error': 'يوجد كاميرا بنفس الرقم مسبقاً'}), 400
        
        camera = Camera(
            name=name,
            camera_index=camera_index,
            location=location,
            rtsp_url=rtsp_url,
            status='active'
        )
        
        db.session.add(camera)
        db.session.commit()
        
        camera_manager.add_camera(camera_index, rtsp_url)
        
        return jsonify({
            'id': camera.id,
            'name': camera.name,
            'cameraIndex': camera.camera_index,
            'location': camera.location,
            'status': camera.status,
            'rtspUrl': camera.rtsp_url
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@camera_bp.route('/<int:camera_id>', methods=['DELETE'])
def delete_camera(camera_id):
    try:
        camera = db.session.query(Camera).filter_by(id=camera_id).first()
        if not camera:
            return jsonify({'error': 'Camera not found'}), 404
        
        camera_manager.remove_camera(camera.camera_index)
        db.session.delete(camera)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Camera deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@camera_bp.route('/<int:camera_id>', methods=['PUT'])
def update_camera(camera_id):
    try:
        camera = db.session.query(Camera).filter_by(id=camera_id).first()
        if not camera:
            return jsonify({'error': 'Camera not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            camera.name = data['name']
        if 'location' in data:
            camera.location = data['location']
        if 'status' in data:
            camera.status = data['status']
            if data['status'] == 'inactive':
                camera_manager.remove_camera(camera.camera_index)
            elif data['status'] == 'active':
                camera_manager.add_camera(camera.camera_index, camera.rtsp_url)
        if 'rtspUrl' in data:
            old_rtsp = camera.rtsp_url
            camera.rtsp_url = data['rtspUrl']
            if old_rtsp != data['rtspUrl']:
                camera_manager.remove_camera(camera.camera_index)
                if camera.status == 'active':
                    success = camera_manager.add_camera(camera.camera_index, data['rtspUrl'])
                    if not success:
                        return jsonify({'error': 'Failed to connect to new camera URL'}), 500
        
        db.session.commit()
        
        return jsonify({
            'id': camera.id,
            'name': camera.name,
            'cameraIndex': camera.camera_index,
            'location': camera.location,
            'status': camera.status,
            'rtspUrl': camera.rtsp_url,
            'message': 'Camera updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@camera_bp.route('/<int:camera_id>/test', methods=['POST'])
def test_camera_connection(camera_id):
    try:
        camera = db.session.query(Camera).filter_by(id=camera_id).first()
        if not camera:
            return jsonify({'error': 'Camera not found'}), 404
        
        is_connected = camera_manager.test_connection(camera.camera_index, camera.rtsp_url)
        
        return jsonify({
            'connected': is_connected,
            'message': 'Camera is connected' if is_connected else 'Camera connection failed'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@camera_bp.route('/<int:camera_index>/stream', methods=['GET'])
def stream_camera(camera_index):
    def generate():
        while True:
            frame = camera_manager.get_frame(camera_index)
            if frame is None:
                break
            
            detections = detector.detect_people(frame)
            
            for det in detections:
                x1, y1, x2, y2 = int(det['x1']), int(det['y1']), int(det['x2']), int(det['y2'])
                
                color = (0, 255, 255)
                if det.get('is_staff'):
                    color = (255, 0, 255)
                
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                label = f"{det.get('gender', 'Unknown')} {det.get('age_range', '')}"
                cv2.putText(frame, label, (x1, y1 - 10), 
                          cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    
    if not camera_manager.is_camera_active(camera_index):
        return jsonify({'error': 'Camera not active'}), 404
    
    return Response(generate(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@camera_bp.route('/<int:camera_index>/snapshot', methods=['GET'])
def get_snapshot(camera_index):
    try:
        frame = camera_manager.get_frame(camera_index)
        if frame is None:
            return jsonify({'error': 'No frame available'}), 404
        
        detections = detector.detect_people(frame)
        demographics = detector.analyze_demographics(detections)
        
        for det in detections:
            x1, y1, x2, y2 = int(det['x1']), int(det['y1']), int(det['x2']), int(det['y2'])
            color = (0, 255, 255) if not det.get('is_staff') else (255, 0, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
        
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            return jsonify({'error': 'Failed to encode frame'}), 500
        
        return Response(buffer.tobytes(), mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@camera_bp.route('/<int:camera_index>/detect', methods=['GET'])
def detect_on_camera(camera_index):
    try:
        frame = camera_manager.get_frame(camera_index)
        if frame is None:
            return jsonify({'error': 'No frame available'}), 404
        
        detections = detector.detect_people(frame)
        demographics = detector.analyze_demographics(detections)
        
        return jsonify({
            'detections': detections,
            'demographics': demographics,
            'count': len(detections)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
