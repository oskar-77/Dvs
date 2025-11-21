import { useEffect, useState, useRef } from "react";
import { Maximize, User, WifiOff } from "lucide-react";

interface Detection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: number;
  gender?: string;
  age_range?: string;
  is_staff?: boolean;
}

interface VideoFeedProps {
  cameraIndex?: number;
}

export function VideoFeed({ cameraIndex = 0 }: VideoFeedProps) {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [wsConnected, setWsConnected] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const streamUrl = `/api/cameras/${cameraIndex}/stream`;

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/camera/${cameraIndex}`;
    
    let ws: WebSocket | null = null;
    
    try {
      ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setWsConnected(true);
        setCameraActive(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'detection') {
            setDetections(data.detections || []);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };
      
      ws.onclose = () => {
        setWsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setWsConnected(false);
    }
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [cameraIndex]);

  const handleImageError = () => {
    setCameraActive(false);
    
    setTimeout(() => {
      if (imgRef.current) {
        imgRef.current.src = streamUrl + '?t=' + Date.now();
        setCameraActive(true);
      }
    }, 5000);
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_theme('colors.primary')/20] group">
      {cameraActive ? (
        <>
          <img 
            ref={imgRef}
            src={streamUrl} 
            alt="Live Camera Feed" 
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
          
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <WifiOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Camera not available</p>
            <p className="text-sm text-muted-foreground mt-2">Please add a camera in Settings</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur border rounded text-xs font-mono font-bold ${wsConnected ? 'border-red-500/50 text-red-500' : 'border-gray-500/50 text-gray-500'}`}>
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`}></div>
          {wsConnected ? 'LIVE ANALYTICS' : 'OFFLINE'}
        </div>
        <div className="px-2 py-1 bg-black/60 backdrop-blur border border-primary/30 rounded text-xs text-primary font-mono">
          CAM-{cameraIndex.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button className="p-1.5 bg-black/60 backdrop-blur border border-primary/30 rounded text-primary hover:bg-primary/20 transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/90 backdrop-blur border-t border-primary/20 flex items-center justify-between px-4 z-20">
         <div className="flex gap-4 text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-wider">
            <span className="text-primary">Processing: YOLOv8 + Age/Gender Detection</span>
            <span>Detections: {detections.length}</span>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span className="text-white">Customer</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-white">Staff</span>
            </div>
         </div>
      </div>
    </div>
  );
}
