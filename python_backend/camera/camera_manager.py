import cv2
import threading
import time
from typing import Dict, Optional
import numpy as np

class CameraManager:
    def __init__(self):
        self.cameras: Dict[int, cv2.VideoCapture] = {}
        self.camera_threads: Dict[int, threading.Thread] = {}
        self.camera_frames: Dict[int, np.ndarray] = {}
        self.camera_locks: Dict[int, threading.Lock] = {}
        self.running: Dict[int, bool] = {}
        
    def add_camera(self, camera_index: int, rtsp_url: Optional[str] = None) -> bool:
        if camera_index in self.cameras:
            return True
            
        try:
            if rtsp_url:
                cap = cv2.VideoCapture(rtsp_url)
            else:
                cap = cv2.VideoCapture(camera_index)
            
            if not cap.isOpened():
                return False
                
            self.cameras[camera_index] = cap
            self.camera_locks[camera_index] = threading.Lock()
            self.running[camera_index] = True
            
            thread = threading.Thread(target=self._capture_frames, args=(camera_index,), daemon=True)
            thread.start()
            self.camera_threads[camera_index] = thread
            
            return True
        except Exception as e:
            print(f"Error adding camera {camera_index}: {e}")
            return False
    
    def _capture_frames(self, camera_index: int):
        cap = self.cameras.get(camera_index)
        if not cap:
            return
            
        while self.running.get(camera_index, False):
            ret, frame = cap.read()
            if ret:
                with self.camera_locks[camera_index]:
                    self.camera_frames[camera_index] = frame.copy()
            else:
                time.sleep(0.1)
    
    def get_frame(self, camera_index: int) -> Optional[np.ndarray]:
        if camera_index not in self.camera_frames:
            return None
            
        with self.camera_locks.get(camera_index, threading.Lock()):
            return self.camera_frames[camera_index].copy()
    
    def remove_camera(self, camera_index: int) -> bool:
        if camera_index not in self.cameras:
            return False
            
        self.running[camera_index] = False
        
        if camera_index in self.camera_threads:
            self.camera_threads[camera_index].join(timeout=2.0)
            del self.camera_threads[camera_index]
        
        if camera_index in self.cameras:
            self.cameras[camera_index].release()
            del self.cameras[camera_index]
        
        if camera_index in self.camera_frames:
            del self.camera_frames[camera_index]
        
        if camera_index in self.camera_locks:
            del self.camera_locks[camera_index]
            
        return True
    
    def get_active_cameras(self) -> list:
        return list(self.cameras.keys())
    
    def is_camera_active(self, camera_index: int) -> bool:
        return camera_index in self.cameras and self.running.get(camera_index, False)

camera_manager = CameraManager()
