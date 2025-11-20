import floorPlan from "@assets/generated_images/retail_store_floor_plan_blueprint.png";
import { motion } from "framer-motion";

export function ZoneHeatmap() {
  return (
    <div className="relative w-full aspect-[16/9] bg-card/50 border border-primary/20 rounded-lg overflow-hidden shadow-lg group">
      <div className="absolute inset-0 p-4 flex items-center justify-center bg-[#0a1020]">
         <img 
           src={floorPlan} 
           alt="Store Map" 
           className="w-full h-full object-contain opacity-60 grayscale invert-[0.1] sepia-[.5] hue-rotate-180"
           style={{ filter: "drop-shadow(0 0 5px rgba(0,255,255,0.3))" }}
         />
      </div>

      {/* Heat Zones */}
      {/* Entrance - High Traffic (Red) */}
      <motion.div 
        className="absolute top-[80%] left-[50%] -translate-x-1/2 w-32 h-32 rounded-full bg-red-500/40 blur-2xl mix-blend-screen"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      ></motion.div>

      {/* Clothes Section - Medium Traffic (Orange) */}
      <motion.div 
        className="absolute top-[40%] left-[20%] w-40 h-40 rounded-full bg-orange-500/30 blur-3xl mix-blend-screen"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      ></motion.div>

      {/* Cashier - High Traffic (Yellow/Red) */}
      <motion.div 
        className="absolute top-[30%] right-[20%] w-24 h-24 rounded-full bg-yellow-500/40 blur-2xl mix-blend-screen"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      ></motion.div>

      {/* Zone Labels */}
      <div className="absolute top-[35%] left-[20%] text-xs font-mono text-primary/80 font-bold tracking-widest">APPAREL</div>
      <div className="absolute top-[25%] right-[20%] text-xs font-mono text-primary/80 font-bold tracking-widest">CHECKOUT</div>
      <div className="absolute bottom-[10%] left-[50%] -translate-x-1/2 text-xs font-mono text-primary/80 font-bold tracking-widest">ENTRANCE</div>

      <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 border border-primary/30 rounded text-xs text-primary font-mono">
        FLOOR 1 - HEATMAP
      </div>
    </div>
  );
}
