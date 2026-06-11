import React, { useState } from "react";
import { Sparkles, Info, Flame } from "lucide-react";
import { CakeSpecification, PASTEL_COLORS } from "../types";

interface InteractiveCakeCanvasProps {
  spec: CakeSpecification;
  isAiLoading?: boolean;
  aiImageUrl?: string;
  onTriggerAiRender?: () => void;
}

export default function InteractiveCakeCanvas({
  spec,
  isAiLoading = false,
  aiImageUrl = "",
  onTriggerAiRender,
}: InteractiveCakeCanvasProps) {
  const { shape, layers, colors, toppings, customMessage, flavor, occasion } = spec;

  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  const hotspots = [
    {
      id: 1,
      name: "Toppings Crown",
      desc: toppings.length > 0 ? `Artisanal Selection: ${toppings.join(", ")}` : "Hand-sculpted macarons, fresh fruits, or 24K gold leaves.",
      style: { top: "25%", left: "15%" },
      arrow: (
        <svg className="absolute w-[85px] h-[35px] pointer-events-none z-40" style={{ top: "24%", left: "21%" }} viewBox="0 0 85 35" fill="none">
          <path d="M5 5 Q 35 5, 75 18" stroke="#5A5A40" strokeWidth="1.5" strokeDasharray="3 2" className="animate-pulse" />
          <path d="M75 18 L68 13 M75 18 L69 22" stroke="#5A5A40" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 2,
      name: "Velvet Glaze",
      desc: `Exquisite ${flavor || "vanilla cream"} cake with premium ${colors.join(" & ") || "pastel"} frostings.`,
      style: { top: "48%", right: "10%" },
      arrow: (
        <svg className="absolute w-[85px] h-[35px] pointer-events-none z-40" style={{ top: "45%", right: "18%" }} viewBox="0 0 85 35" fill="none">
          <path d="M80 30 Q 50 30, 8 10" stroke="#5A5A40" strokeWidth="1.5" strokeDasharray="3 2" className="animate-pulse" />
          <path d="M8 10 L16 11 M8 10 L10 17" stroke="#5A5A40" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 3,
      name: "Sculpted Foundation",
      desc: `Artfully shaped ${shape || "Round"} cake stacked in ${layers} premium style.`,
      style: { top: "74%", left: "12%" },
      arrow: (
        <svg className="absolute w-[85px] h-[35px] pointer-events-none z-40" style={{ top: "72%", left: "20%" }} viewBox="0 0 85 35" fill="none">
          <path d="M5 5 Q 35 15, 75 25" stroke="#5A5A40" strokeWidth="1.5" strokeDasharray="3 2" className="animate-pulse" />
          <path d="M75 25 L68 20 M75 25 L69 29" stroke="#5A5A40" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  // Resolve layers count
  const getLayersCount = (): number => {
    switch (layers) {
      case "Single Layer": return 1;
      case "Double Layer": return 2;
      case "Triple Layer": return 3;
      case "Four Layer": return 4;
      case "Five Layer": return 5;
      case "Multi-Tier Luxury Cake": return 5;
      default: return 1;
    }
  };

  const layersCount = getLayersCount();

  // Resolve base frosting color according to flavor
  const getFrostingColor = (index: number): string => {
    const fLower = flavor.toLowerCase();

    // Core flavor-to-color mapping for realistic boutique representation
    if (fLower.includes("chocolate") || fLower.includes("fudge") || fLower.includes("truffle") || fLower.includes("oreo") || fLower.includes("nutella") || fLower.includes("ferrero") || fLower.includes("tiramisu") || fLower.includes("praline") || fLower.includes("black forest")) {
      return "#5A3825"; // Rich chocolate cocoa brown
    }
    if (fLower.includes("coco") || fLower.includes("biscoff") || fLower.includes("espresso") || fLower.includes("coffee") || fLower.includes("caramel") || fLower.includes("butterscotch")) {
      return "#C68B59"; // Cookie warm amber caramel
    }
    if (fLower.includes("strawberry") || fLower.includes("rose milk") || fLower.includes("raspberry") || fLower.includes("royal black cherry") || fLower.includes("cherry") || fLower.includes("pink")) {
      return "#FF8DA1"; // Sweet berry rose pink
    }
    if (fLower.includes("red velvet")) {
      return "#9E2A2B"; // Royal red velvet crimson
    }
    if (fLower.includes("mango") || fLower.includes("saffron") || fLower.includes("kesar") || fLower.includes("peach")) {
      return "#FAC02C"; // Premium bright saffron mango gold
    }
    if (fLower.includes("lemon") || fLower.includes("lime") || fLower.includes("pineapple") || fLower.includes("custard") || fLower.includes("banana")) {
      return "#FFF4BD"; // Soft tropical yellow
    }
    if (fLower.includes("mint") || fLower.includes("matcha") || fLower.includes("pistachio") || fLower.includes("cardamom") || fLower.includes("green")) {
      return "#B5E3C4"; // Mint matcha / pistachio pastel green
    }
    if (fLower.includes("lavender") || fLower.includes("purple") || fLower.includes("lilac")) {
      return "#E6D6FF"; // Soft lavender
    }
    if (fLower.includes("blueberry")) {
      return "#6F8FAF"; // Delicate blueberry denim blue
    }

    // Default to spec colors or Ivory Shimmer
    if (colors && colors.length > 0) {
      const colorName = colors[index % colors.length];
      const match = PASTEL_COLORS.find(c => c.name === colorName);
      return match ? match.hash : PASTEL_COLORS[0].hash;
    }
    return "#FFF8F0"; // Default elegante Ivory Shimmer
  };

  // Check if specific toppings are active
  const hasTopping = (name: string): boolean => toppings.includes(name);

  // Derive shape descriptors for clipPaths or styling
  const getShapeClass = () => {
    switch (shape) {
      case "Heart": return "rounded-b-[20%] rounded-t-[10%] max-w-[90%] mx-auto";
      case "Square": return "skew-x-2";
      case "Hexagon": return "polygon-hexagon";
      case "Oval": return "rounded-[50%]";
      default: return "rounded-b-[16px] rounded-t-[4px]";
    }
  };

  // Calculate prices based on options representing reasonable boutique rates in INR
  const calculatePrice = (): number => {
    let base = 1450; // Premium boutique starter price in Indian Rupees
    const weightVal = spec.weight;
    if (weightVal.includes("300g")) base += 200;
    else if (weightVal.includes("500g")) base += 450;
    else if (weightVal.includes("750g")) base += 700;
    else if (weightVal.includes("1kg")) base += 1050;
    else if (weightVal.includes("1.5kg")) base += 1400;
    else if (weightVal.includes("2kg")) base += 1900;
    else if (weightVal.includes("3kg")) base += 2800;
    else if (weightVal.includes("5kg")) base += 4200;

    const layersCount = layers === "Single Layer" ? 1 : layers === "Double Layer" ? 2 : layers === "Triple Layer" ? 3 : 5;
    base += (layersCount - 1) * 1450;

    if (shape === "Heart") base += 350;
    if (shape === "Hexagon" || shape === "Tiered Cake") base += 600;

    base += toppings.length * 150;

    if (colors.length > 2) base += 250;
    if (flavor.startsWith("Custom") || flavor.includes("Gold")) base += 450;

    return base;
  };

  return (
    <div className="bg-white/80 rounded-3xl p-6 border border-[#5A5A40]/10 shadow-xl backdrop-blur-md flex flex-col items-center">
      
      {/* Title Header */}
      <div className="w-full flex items-center justify-between border-b border-[#5A5A40]/10 pb-4 mb-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold font-display">
            Live Lab
          </span>
          <h3 className="font-serif text-lg font-bold text-[#5A5A40] italic">Isomorphic Studio Render</h3>
        </div>
        <div className="bg-[#D9FFE8] text-[#2C6A43] text-xs font-semibold px-3 py-1 rounded-full border border-[#B6F5CB]/50 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAF51] mr-1.5 animate-pulse" />
          Est: ₹{calculatePrice().toLocaleString('en-IN')}
        </div>
      </div>

      {/* Main Canvas Display Stage */}
      <div className="relative w-full aspect-square max-w-[340px] bg-gradient-to-b from-[#FFF8F0] to-[#FFE5D0]/20 rounded-2xl border border-[#5A5A40]/10 shadow-inner p-4 overflow-hidden flex flex-col justify-end items-center">
        
        {/* Floating Sparkles absolute ornament */}
        <div className="absolute top-4 left-4 text-[#FFE5D0] animate-sparkle-slow">
          <Sparkles className="w-5 h-5 fill-current" />
        </div>
        <div className="absolute top-12 right-6 text-[#FFE5D0]/80 animate-bounce">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>

        {/* --- DYNAMIC CAKE STACK --- */}
        <div className="relative w-full flex flex-col items-center justify-end z-10 select-none pb-6 h-full">
          
          {/* TOPMOST CANDLE (if Birthday or Anniversary) */}
          {(occasion === "Birthday" || occasion === "Anniversary") && (
            <div className="relative flex flex-col items-center -mb-1 z-50">
              {/* Flame */}
              <div className="w-2.5 h-4 bg-gradient-to-t from-[#FF6F91] to-[#FFD6E8] rounded-full animate-pulse-subtle flex items-center justify-center">
                <Flame className="w-2.5 h-2.5 text-[#FFA600] shrink-0 animate-bounce" />
              </div>
              {/* Wick */}
              <div className="w-0.5 h-1.5 bg-[#5A5A40] -mt-0.5" />
              {/* Candle Body */}
              <div className="w-2 h-7 bg-gradient-to-r from-[#FFE5D0] to-[#FFD6E8] rounded-t-sm shadow-xs border-[0.5px] border-[#5A5A40]/20" />
            </div>
          )}

          {/* GENERATE TIERS IN DECREASING SIZES FROM BOTTOM-TOP */}
          {Array.from({ length: layersCount }).map((_, i) => {
            // Index from top to bottom (0 = topmost, layersCount-1 = bottommost)
            const tierIndex = i; 
            const inverseIndex = layersCount - 1 - tierIndex; // 0 = bottom, layersCount-1 = top
            
            // Tier width percentages
            const widthsByTiers = {
              1: [80],
              2: [62, 82],
              3: [48, 66, 84],
              4: [38, 54, 70, 86],
              5: [32, 45, 58, 71, 84]
            };
            
            const tierWidth = (widthsByTiers[layersCount as keyof typeof widthsByTiers] || widthsByTiers[1])[tierIndex];
            const backColor = getFrostingColor(inverseIndex);
            
            return (
              <div 
                key={tierIndex}
                className="relative flex flex-col items-center transition-all duration-500 ease-out z-20"
                style={{ 
                  width: `${tierWidth}%`, 
                  zIndex: 25 - tierIndex,
                  marginTop: tierIndex === 0 ? "0" : "-14px" // stack margin overlap
                }}
              >
                {/* 3D Oval Top Frosting Edge */}
                <div 
                  className="w-full h-8 rounded-full border-[0.5px] border-black/5 relative shadow-inner flex items-center justify-center overflow-hidden"
                  style={{ 
                    backgroundColor: backColor,
                    backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.02) 100%)"
                  }}
                >
                  {/* Scatter toppings on the surface of each tier */}
                  {hasTopping("Silver Pearls") && (
                    <div className="absolute inset-0 flex justify-around items-center opacity-75">
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.2)] ml-4" />
                      <span className="w-1 h-1 rounded-full bg-slate-200 shadow-xs mr-3 -mt-1" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E6D6FF] shadow-xs mr-8 mt-2" />
                    </div>
                  )}

                  {hasTopping("Gold Leaf") && (
                    <div className="absolute inset-0 flex items-center justify-between opacity-80 pointer-events-none">
                      <div className="w-2.5 h-2 bg-gradient-to-r from-amber-300 to-yellow-500 rounded-sm rotate-12 ml-6 animate-sparkle-slow" />
                      <div className="w-2 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-xs -rotate-45 mr-8" />
                    </div>
                  )}

                  {/* Top fruits / items (rendered only for top layer) */}
                  {tierIndex === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center space-x-1">
                      {hasTopping("Fresh Strawberries") && (
                        <div className="flex space-x-0.5 -mt-2">
                          <span className="w-4 h-5 bg-red-500 rounded-b-full rounded-t-sm shadow-xs border border-red-600 relative overflow-hidden">
                            <span className="absolute top-1 left-1.5 w-0.5 h-0.5 bg-yellow-300 rounded-full" />
                            <span className="absolute top-2 left-3 w-0.5 h-0.5 bg-yellow-300 rounded-full" />
                          </span>
                          <span className="w-4 h-5 bg-red-500 rounded-b-full rounded-t-sm shadow-xs border border-red-600 relative overflow-hidden rotate-12">
                            <span className="absolute top-1.5 left-2 w-0.5 h-0.5 bg-yellow-300 rounded-full" />
                          </span>
                        </div>
                      )}
                      
                      {hasTopping("Ferrero Rocher") && (
                        <div className="w-4 h-4 bg-amber-700 rounded-full shadow-[0px_2px_1px_rgba(0,0,0,0.4)] border border-amber-800 flex items-center justify-center text-[5px] text-yellow-300 font-bold -mt-2">
                          FR
                        </div>
                      )}

                      {hasTopping("Macarons") && (
                        <div className="flex space-x-1 -mt-2">
                          <span className="w-4 h-3 bg-[#FFD6E8] rounded-xs shadow-xs border-y-[1px] border-[#5A5A40]/10" />
                          <span className="w-4 h-3 bg-[#E6D6FF] rounded-xs shadow-xs border-y-[1px] border-[#5A5A40]/10 rotate-6" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Main 3D Cylinder Body */}
                <div 
                  className={`w-full h-16 -mt-4 border-x-[0.5px] border-b-[1px] border-black/10 relative overflow-hidden ${getShapeClass()}`}
                  style={{ 
                    backgroundColor: backColor,
                    backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.12) 100%)"
                  }}
                >
                  
                  {/* Frosting Swirl / Piping vector details */}
                  <div className="absolute inset-x-0 bottom-1 flex justify-around opacity-40 pointer-events-none">
                    {Array.from({ length: 8 }).map((_, s) => {
                      const swirlColorName = colors && colors.length > 0 ? colors[s % colors.length] : "Ivory Shimmer";
                      const match = PASTEL_COLORS.find(c => c.name === swirlColorName);
                      const swirlHash = match ? match.hash : "#FFF8F0";
                      return (
                        <div 
                          key={s} 
                          className="w-3 h-3 rounded-full border border-white/40 shadow-xs" 
                          style={{ backgroundColor: swirlHash }}
                        />
                      );
                    })}
                  </div>

                  {/* Chocolate Drip or Caramel Drizzle effect overlay */}
                  {(hasTopping("Chocolate Drip") || hasTopping("Caramel Drizzle")) && (
                    <div className="absolute top-0 inset-x-0 pointer-events-none">
                      <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-6">
                        <path 
                          d="M0 0 h100 v3 Q92 12, 85 4 Q75 18, 68 3 Q62 14, 55 4 Q48 16, 42 3 Q34 18, 28 4 Q18 15, 12 3 Q6 10, 0 2 Z" 
                          fill={hasTopping("Chocolate Drip") ? "#4E3629" : "#C68B59"} 
                        />
                      </svg>
                    </div>
                  )}

                  {/* Gold leaf splash on body */}
                  {hasTopping("Gold Leaf") && (
                    <div className="absolute top-4 left-6 w-5 h-4 bg-gradient-to-r from-amber-300 to-yellow-400 opacity-80 rounded-[40%_20%_60%_30%] rotate-45 animate-pulse" />
                  )}

                  {/* Delicate Iced Message rendered on the middle tier if present */}
                  {customMessage && (
                    (layersCount === 1 || (layersCount > 1 && tierIndex === Math.floor(layersCount / 2))) && (
                      <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                        <span className="font-serif italic text-[11px] font-semibold text-[#4E3629] text-center drop-shadow-md tracking-wider bg-white/20 whitespace-normal line-clamp-1 border-y-[0.5px] border-[#FFF8F0]/30 px-1.5 py-0.5 rounded-md">
                          "{customMessage}"
                        </span>
                      </div>
                    )
                  )}

                  {/* Fresh Fruits embedded on the piping border */}
                  {hasTopping("Fresh Strawberries") && (
                    <div className="absolute bottom-2 inset-x-2 flex justify-between opacity-90">
                      <div className="w-3 h-3 bg-red-600 rounded-full" />
                      <div className="w-3 h-3 bg-red-600 rounded-full" />
                    </div>
                  )}

                  {/* Edible flowers cascade ornament */}
                  {hasTopping("Edible Flowers") && (
                    <div className="absolute top-3 right-2 w-4 h-4 bg-gradient-to-br from-[#FFD6E8] to-[#FF6F91] rounded-full border border-pink-300 shadow-xs flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-[#FFF8F0] rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Pedestal Stand and Base Platter */}
          <div className="w-[96%] h-5 bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 rounded-full border border-amber-300 shadow-md -mt-1.5 z-10 flex items-center justify-center">
            {/* Marble plate design details */}
            <div className="w-[95%] h-[60%] border-t-[1px] border-[#FFD6E8]/30 rounded-full opacity-60" />
          </div>
          {/* Pedestal Stand Leg */}
          <div className="w-16 h-8 bg-gradient-to-b from-yellow-100 to-amber-200 border-x border-amber-300 shadow-lg -mt-1.5 z-5 rounded-b-md" />
          {/* Pedestal Foot */}
          <div className="w-28 h-2.5 bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-200 border border-amber-300 shadow-sm z-5 rounded-full" />
        </div>

        {/* --- DYNAMIC HOTSPOTS & ARROWS POPUPS --- */}
        {hotspots.map((hs) => (
          <div
            key={hs.id}
            className="absolute z-40 cursor-help flex items-center justify-center pointer-events-auto"
            style={hs.style}
            onMouseEnter={() => setHoveredHotspot(hs.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onTouchStart={() => setHoveredHotspot(hs.id)}
            id={`hotspot-${hs.id}`}
          >
            {/* Pulsating outer ring overlay */}
            <span className="absolute inline-flex h-6 w-6 rounded-full bg-[#5A5A40]/30 animate-ping" />
            {/* Central core node */}
            <span className="relative flex items-center justify-center rounded-full h-5.5 w-5.5 bg-[#5A5A40] hover:bg-[#6c6c52] transition-colors text-white font-mono text-[9px] font-bold shadow-md border border-[#FFF8F0]">
              ✦
            </span>
          </div>
        ))}

        {/* Real-time Arrow pointer & Speech Bubble */}
        {hoveredHotspot !== null && (
          <>
            {/* Draw active arrow pointing to cake tier */}
            {hotspots.find((h) => h.id === hoveredHotspot)?.arrow}

            {/* Micro Floating Tooltip Card */}
            <div 
              className="absolute bottom-4 inset-x-4 bg-white/95 border border-[#5A5A40]/15 rounded-2xl p-3 shadow-lg z-50 text-[11px] leading-tight text-[#5A5A40] transition-all duration-200 animate-pulse-subtle"
              id="hotspot-popup-card"
            >
              <div className="font-bold text-[10px] uppercase tracking-wider text-[#5A5A40]/70 mb-0.5 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                <span>{hotspots.find((h) => h.id === hoveredHotspot)?.name}</span>
              </div>
              <p className="font-medium text-[#5A5A40]/90">
                {hotspots.find((h) => h.id === hoveredHotspot)?.desc}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Dynamic Specifications Summary Card */}
      <div className="w-full mt-5 bg-[#FFF8F0]/60 border border-[#5A5A40]/10 rounded-2xl p-4 text-xs space-y-2">
        <h4 className="font-display font-bold text-[#5A5A40] uppercase tracking-wider text-[10px]">
          Studio Specifications
        </h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[#5A5A40]">
          <div>
            <span className="text-gray-400 font-medium">Shape:</span> {shape}
          </div>
          <div>
            <span className="text-gray-400 font-medium">Layers:</span> {layers}
          </div>
          <div>
            <span className="text-gray-400 font-medium">Size:</span> {spec.weight}
          </div>
          <div>
            <span className="text-gray-400 font-medium">Type:</span> {spec.cakeType}
          </div>
          <div className="col-span-2 border-t border-dashed border-[#5A5A40]/25 pt-1.5 my-1">
            <span className="text-gray-400 font-medium">Flavors:</span> <span className="font-semibold text-[#5A5A40]">{flavor}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400 font-medium">Colors:</span> <span className="text-[10px] font-semibold">{colors.join(", ") || "None"}</span>
          </div>
          {toppings.length > 0 && (
            <div className="col-span-2">
              <span className="text-gray-400 font-medium">Toppings:</span> <span className="text-[10px] font-semibold">{toppings.join(", ")}</span>
            </div>
          )}
        </div>
      </div>

      {/* 8K Photorealistic AI Render CTA Segment */}
      <div className="w-full mt-4 flex flex-col space-y-2">
        <button
          onClick={onTriggerAiRender}
          disabled={isAiLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-[#5A5A40] hover:bg-[#6c6c52] text-white font-display font-semibold uppercase tracking-widest text-xs shadow-md transition-all duration-300 cursor-pointer disabled:opacity-50"
          id="btn-ai-render-trigger"
        >
          <Sparkles className="w-4 h-4 text-[#FFE5D0] animate-spin-slow" />
          <span>{isAiLoading ? "Rendering 8K Masterpiece..." : "Generate 8K AI Real-Time Render"}</span>
        </button>
        <p className="text-[9px] text-center text-gray-400 flex items-center justify-center">
          <Info className="w-3 h-3 mr-1" /> Uses Imagen AI on Frostella studio database.
        </p>

        {/* Display the AI-generated high-fidelity image if present */}
        {aiImageUrl && !isAiLoading && (
          <div 
            className="w-full mt-4 border border-[#FFE5D0] rounded-2xl overflow-hidden shadow-lg animate-float-slow"
            id="ai-photo-preview-box"
          >
            <div className="bg-[#FFE5D0]/40 px-3 py-1.5 text-[10px] tracking-widest uppercase font-semibold text-center text-[#5A5A40] border-b border-[#FFE5D0]">
              ✨ 8K Studio Lens Render
            </div>
            <img 
              src={aiImageUrl} 
              alt="Artisanal Cake generated by Frostella AI" 
              className="w-full object-cover aspect-square"
              referrerPolicy="no-referrer"
            />
            <div className="bg-[#FFF8F0] p-2 text-[9px] text-gray-400 text-center">
              *Designed and generated under luxury studio photoshoot settings.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
