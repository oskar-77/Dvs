import json
import time
from flask import request
from flask_sock import Sock
from python_backend.camera import camera_manager
from python_backend.ai_detection.detector import detector

sock = Sock()

def init_websocket(app):
    sock.init_app(app)
    
    @sock.route('/ws/camera/<int:camera_index>')
    def camera_websocket(ws, camera_index):
        try:
            # Check if camera exists, if not send a status message and close
            if not camera_manager.is_camera_active(camera_index):
                ws.send(json.dumps({
                    'type': 'status',
                    'message': f'Camera {camera_index} not available',
                    'cameraIndex': camera_index
                }))
                return
            
            frame_skip = 0
            send_count = 0
            
            while True:
                frame = camera_manager.get_frame(camera_index)
                if frame is None:
                    send_count += 1
                    if send_count > 30:  # Send status every ~3 seconds
                        ws.send(json.dumps({
                            'type': 'status',
                            'message': 'Waiting for frame',
                            'cameraIndex': camera_index
                        }))
                        send_count = 0
                    continue
                
                # Skip frames to reduce processing
                frame_skip = (frame_skip + 1) % 5
                if frame_skip != 0:
                    continue
                    
                detections = detector.detect_people(frame)
                demographics = detector.analyze_demographics(detections)
                
                data = {
                    'type': 'detection',
                    'cameraIndex': camera_index,
                    'detections': detections,
                    'demographics': demographics,
                    'timestamp': time.time()
                }
                
                ws.send(json.dumps(data))
                send_count = 0
        except Exception as e:
            print(f"WebSocket error: {e}")
