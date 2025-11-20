import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize, User, Target, Info } from "lucide-react";
import cctvImage from "@assets/generated_images/cctv_footage_of_retail_store.png";

interface BoundingBox {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: "Person" | "Staff";
  confidence: number;
  gender: "Male" | "Female";
  age: string;
  action: "Walking" | "Browsing" | "Standing";
  color: string;
  history: {x: number, y: number}[];
}

export function VideoFeed() {
  const [boxes, setBoxes] = useState<BoundingBox[]>([
    { id: 4821, x: 20, y: 30, w: 10, h: 25, type: "Person", confidence: 98, gender: "Female", age: "24-28", action: "Browsing", color: "hsl(180, 100%, 50%)", history: [] },
    { id: 4822, x: 45, y: 40, w: 12, h: 28, type: "Person", confidence: 95, gender: "Male", age: "30-35", action: "Walking", color: "hsl(217, 91%, 60%)", history: [] },
    { id: 4823, x: 70, y: 25, w: 9, h: 22, type: "Staff", confidence: 99, gender: "Male", age: "25-30", action: "Standing", color: "hsl(280, 100%, 70%)", history: [] },
  ]);

  // Simulate movement and tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setBoxes(prev => prev.map(box => {
        const moveX = (Math.random() - 0.5) * 2.5;
        const moveY = (Math.random() - 0.5) * 1.5;
        
        const newX = Math.max(5, Math.min(90, box.x + moveX));
        const newY = Math.max(10, Math.min(75, box.y + moveY));
        
        // Update movement history (limit to last 10 points for trail)
        const newHistory = [...box.history, { x: box.x + box.w/2, y: box.y + box.h }];
        if (newHistory.length > 15) newHistory.shift();

        return {
          ...box,
          x: newX,
          y: newY,
          history: newHistory,
          action: Math.abs(moveX) > 0.5 ? "Walking" : "Browsing"
        };
      }));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-primary/30 shadow-[0_0_20px_theme('colors.primary')/20] group">
      {/* Video Feed Image */}
      <img 
        src={cctvImage} 
        alt="Live Feed" 
        className="w-full h-full object-cover opacity-75 group-hover:opacity-85 transition-opacity duration-500"
      />
      
      {/* Scanlines & CRT Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10"></div>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur border border-red-500/50 rounded text-xs text-red-500 font-mono font-bold">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
          LIVE ANALYTICS
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

      {/* Bounding Boxes & Tracking */}
      {boxes.map(box => (
        <div key={box.id}>
           {/* Tracking Trail */}
           <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
              <polyline 
                points={box.history.map(p => `${p.x}%,${p.y}%`).join(" ")}
                fill="none"
                stroke={box.color}
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeDasharray="4,4"
              />
           </svg>

          <motion.div
            className="absolute z-20"
            initial={false}
            animate={{ 
              left: `${box.x}%`, 
              top: `${box.y}%`,
              width: `${box.w}%`,
              height: `${box.h}%`
            }}
            transition={{ duration: 0.8, ease: "linear" }}
          >
            {/* Animated Box Corners */}
            <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: box.color }}></div>
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: box.color }}></div>
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: box.color }}></div>
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: box.color }}></div>
                
                {/* Center Target Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50">
                   <Target className="w-4 h-4 animate-pulse" style={{ color: box.color }} />
                </div>
            </div>

            {/* Detailed Info Panel */}
            <div className="absolute -top-14 -left-4 bg-black/80 backdrop-blur border border-primary/30 px-2 py-1.5 rounded shadow-xl min-w-[140px]">
              <div className="flex items-center justify-between gap-3 text-[10px] font-mono border-b border-white/10 pb-1 mb-1">
                <span className="font-bold text-white">ID: #{box.id}</span>
                <span className="text-green-400">{box.confidence}%</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-white/70 font-sans">
                <div className="flex items-center gap-1">
                   <User className="w-2.5 h-2.5" /> {box.gender}
                </div>
                <div>Age: {box.age}</div>
                <div className="col-span-2 text-primary/90 uppercase tracking-wider font-bold text-[8px] mt-0.5">
                  {box.action}...
                </div>
              </div>
              
              {/* Connecting Line */}
              <div className="absolute bottom-[-6px] left-6 w-px h-[6px] bg-primary/50"></div>
              <div className="absolute bottom-[-6px] left-6 w-1.5 h-1.5 rounded-full bg-primary translate-y-[3px] -translate-x-[2px]"></div>
            </div>
          </motion.div>
        </div>
      ))}

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/90 backdrop-blur border-t border-primary/20 flex items-center justify-between px-4 z-20">
         <div className="flex gap-4 text-[10px] md:text-xs text-muted-foreground font-mono uppercase tracking-wider">
            <span className="text-primary">Processing: YOLOv8-L</span>
            <span>FPS: 24.1</span>
            <span>Latency: 18ms</span>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[hsl(180,100%,50%)]"></span>
                <span className="text-white">Shopper</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[hsl(280,100%,70%)]"></span>
                <span className="text-white">Staff</span>
            </div>
         </div>
      </div>
    </div>
  );
}
