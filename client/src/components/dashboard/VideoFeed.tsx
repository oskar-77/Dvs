import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ScanFace, Maximize, MoreHorizontal, User } from "lucide-react";
import cctvImage from "@assets/generated_images/cctv_footage_of_retail_store.png";

interface BoundingBox {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "Person" | "Staff";
  confidence: number;
  gender: "M" | "F";
  age: number;
}

export function VideoFeed() {
  const [boxes, setBoxes] = useState<BoundingBox[]>([
    { id: 1, x: 20, y: 30, w: 10, h: 20, type: "Person", confidence: 98, gender: "F", age: 24 },
    { id: 2, x: 45, y: 40, w: 12, h: 25, type: "Person", confidence: 95, gender: "M", age: 32 },
    { id: 3, x: 70, y: 25, w: 9, h: 18, type: "Staff", confidence: 99, gender: "M", age: 28 },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBoxes(prev => prev.map(box => ({
        ...box,
        x: Math.max(5, Math.min(90, box.x + (Math.random() - 0.5) * 2)),
        y: Math.max(10, Math.min(80, box.y + (Math.random() - 0.5) * 2)),
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_theme('colors.primary')/20] group">
      {/* Video Feed Image */}
      <img 
        src={cctvImage} 
        alt="Live Feed" 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
      />
      
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
      <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none z-10"></div>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur border border-red-500/50 rounded text-xs text-red-500 font-mono font-bold">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          LIVE REC
        </div>
        <div className="px-2 py-1 bg-black/60 backdrop-blur border border-primary/30 rounded text-xs text-primary font-mono">
          CAM-01 [MAIN_ENTRANCE]
        </div>
      </div>

      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button className="p-1.5 bg-black/60 backdrop-blur border border-primary/30 rounded text-primary hover:bg-primary/20 transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Bounding Boxes */}
      {boxes.map(box => (
        <motion.div
          key={box.id}
          className="absolute z-20 border border-primary/80 shadow-[0_0_10px_theme('colors.primary')/50]"
          initial={false}
          animate={{ 
            left: `${box.x}%`, 
            top: `${box.y}%`,
            width: `${box.w}%`,
            height: `${box.h}%`
          }}
          transition={{ duration: 1, ease: "linear" }}
        >
          {/* Corner Markers */}
          <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-primary"></div>

          {/* Info Label */}
          <div className="absolute -top-6 left-0 bg-black/70 backdrop-blur border border-primary/30 px-1.5 py-0.5 flex flex-col min-w-[80px]">
            <div className="flex items-center justify-between gap-2 text-[10px] text-primary font-mono">
              <span className="font-bold">ID:{box.id}</span>
              <span>{box.confidence}%</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-white/80 font-sans">
              <User className="w-2 h-2" />
              <span>{box.gender} / {box.age}yo</span>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/80 backdrop-blur border-t border-primary/20 flex items-center justify-between px-4 z-20">
         <div className="text-xs text-muted-foreground font-mono">
            FPS: 24.0 | BITRATE: 4096 KBPS | AI: ACTIVE
         </div>
         <div className="flex gap-4 text-xs text-primary font-mono">
            <span>PERSON: {boxes.filter(b => b.type === 'Person').length}</span>
            <span>STAFF: {boxes.filter(b => b.type === 'Staff').length}</span>
         </div>
      </div>
    </div>
  );
}
