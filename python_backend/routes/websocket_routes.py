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
            while True:
                frame = camera_manager.get_frame(camera_index)
                if frame is None:
                    time.sleep(0.1)
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
                time.sleep(0.5)
        except Exception as e:
            print(f"WebSocket error: {e}")
