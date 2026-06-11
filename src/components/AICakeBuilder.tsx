import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, MessageSquare, Send, HelpCircle, ShoppingCart, Heart, Activity, ChefHat } from "lucide-react";
import { 
  CakeSpecification, 
  ChefNarrative, 
  FLAVORS_LIST, 
  TOPPINGS_LIST, 
  OCCASIONS_LIST, 
  CAKE_TYPES_LIST, 
  WEIGHTS_LIST, 
  SHAPES_LIST, 
  LAYERS_LIST, 
  PASTEL_COLORS 
} from "../types";
import InteractiveCakeCanvas from "./InteractiveCakeCanvas";

interface AICakeBuilderProps {
  onAddToWishlist: (spec: CakeSpecification, narrative?: ChefNarrative, imgUrl?: string) => void;
  onAddToCart: (spec: CakeSpecification, date: string, msg: string, price: number) => void;
}

export default function AICakeBuilder({ onAddToWishlist, onAddToCart }: AICakeBuilderProps) {
  // Initialize default cake specifications
  const [spec, setSpec] = useState<CakeSpecification>({
    occasion: "Birthday",
    cakeType: "Fresh Cream Cake",
    weight: "1kg",
    shape: "Round",
    layers: "Double Layer",
    flavor: "Vanilla Bean Madagascar",
    sweetness: "Medium Sweet",
    toppings: ["Fresh Strawberries", "Gold Leaf", "Silver Pearls"],
    colors: ["Pastel Pink", "Ivory Shimmer"],
    customMessage: "Happy Birthday!",
  });

  // State elements for additional controls
  const [deliveryDate, setDeliveryDate] = useState<string>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // default to 2 days from now
  );
  
  // Search flavor and pagination helper
  const [flavorSearch, setFlavorSearch] = useState<string>("");
  const [flavorSliceCount, setFlavorSliceCount] = useState<number>(12); // Show first 12, can expand

  // Chef Beatrice AI feedback state
  const [isChefLoading, setIsChefLoading] = useState<boolean>(false);
  const [chefNarrative, setChefNarrative] = useState<ChefNarrative | null>(null);

  // 8K Imagen render state
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiImageUrl, setAiImageUrl] = useState<string>("");

  // Auto trigger Chef Beatrice details on mount, and whenever key items change
  const triggerChefNarration = async () => {
    setIsChefLoading(true);
    try {
      const response = await fetch("/api/generate-chef-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
      });
      if (response.ok) {
        const data = await response.json();
        setChefNarrative(data);
      } else {
        console.error("Chef's API response failed.");
      }
    } catch (e) {
      console.error("Failed to fetch Chef narration:", e);
    } finally {
      setIsChefLoading(false);
    }
  };

  useEffect(() => {
    // Debounce Chef Narration a tiny bit on client specifications updates
    const timer = setTimeout(() => {
      triggerChefNarration();
    }, 1500);
    return () => clearTimeout(timer);
  }, [spec.flavor, spec.layers, spec.shape, spec.cakeType, spec.sweetness, spec.occasion]);

  // Suggest real boutique color name based on the custom flavor profile
  const getSuggestedColorForFlavor = (fl: string): string => {
    const lower = fl.toLowerCase();
    if (lower.includes("strawberry") || lower.includes("pink") || lower.includes("raspberry") || lower.includes("rose")) {
      return "Pastel Pink";
    }
    if (lower.includes("lavender") || lower.includes("purple") || lower.includes("lilac") || lower.includes("berry") || lower.includes("blueberry")) {
      return "Lavender";
    }
    if (lower.includes("mint") || lower.includes("matcha") || lower.includes("pistachio") || lower.includes("green") || lower.includes("cardamom")) {
      return "Mint Green";
    }
    if (lower.includes("mango") || lower.includes("saffron") || lower.includes("kesar") || lower.includes("peach") || lower.includes("caramel") || lower.includes("butterscotch")) {
      return "Peach";
    }
    if (lower.includes("blue") || lower.includes("ocean") || lower.includes("sky")) {
      return "Baby Blue";
    }
    return "Ivory Shimmer";
  };

  // Handle single selection updater
  const updateSpecField = (field: keyof CakeSpecification, value: any) => {
    setSpec(prev => {
      const next = { ...prev, [field]: value };
      if (field === "flavor") {
        const colorName = getSuggestedColorForFlavor(value);
        next.colors = [colorName];
      }
      return next;
    });
  };

  // Toggle multiple selections (Colors or Toppings)
  const toggleArrayItem = (field: "colors" | "toppings", item: string) => {
    setSpec(prev => {
      const current = prev[field] as string[];
      let updated: string[];
      if (current.includes(item)) {
        updated = current.filter(x => x !== item);
        // Force at least 1 color
        if (field === "colors" && updated.length === 0) return prev;
      } else {
        updated = [...current, item];
      }
      return { ...prev, [field]: updated };
    });
  };

  // Calculated exact pricing estimation representing reasonable local rates in INR
  const getCalculatedPrice = (): number => {
    let price = 1450; // Premium boutique starter price in Indian Rupees
    const weightVal = spec.weight;
    if (weightVal.includes("300g")) price += 200;
    else if (weightVal.includes("500g")) price += 450;
    else if (weightVal.includes("750g")) price += 700;
    else if (weightVal.includes("1kg")) price += 1050;
    else if (weightVal.includes("1.5kg")) price += 1400;
    else if (weightVal.includes("2kg")) price += 1900;
    else if (weightVal.includes("3kg")) price += 2800;
    else if (weightVal.includes("5kg")) price += 4200;

    const layersCount = spec.layers === "Single Layer" ? 1 : spec.layers === "Double Layer" ? 2 : spec.layers === "Triple Layer" ? 3 : 5;
    price += (layersCount - 1) * 1450;

    if (spec.shape === "Heart") price += 350;
    if (spec.shape === "Hexagon" || spec.shape === "Tiered Cake") price += 600;

    price += spec.toppings.length * 150;
    
    // Custom coloring or custom flavor
    if (spec.colors.length > 2) price += 250;
    if (spec.flavor.startsWith("Custom") || spec.flavor.includes("Gold")) price += 450;

    return price;
  };

  const calculatedPrice = getCalculatedPrice();

  // Trigger Imagen 8K Cake Generation
  const handleTriggerAiRender = async () => {
    setIsAiLoading(true);
    setAiImageUrl("");
    try {
      const response = await fetch("/api/generate-cake-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
      });

      const data = await response.json();
      if (response.ok && data.imageUrl) {
        setAiImageUrl(data.imageUrl);
      } else {
        alert(data.error || "AI service is currently busy. We've rendered a perfect, interactive visual simulation above.");
      }
    } catch (e: any) {
      console.error(e);
      alert("AI server is offline. Your gorgeous custom vector simulation is fully active above.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter 50+ Flavors by search
  const filteredFlavors = FLAVORS_LIST.filter(f => 
    f.toLowerCase().includes(flavorSearch.toLowerCase())
  );

  // Send WhatsApp order handler
  const triggerWhatsAppOrder = () => {
    const formattedDate = new Date(deliveryDate).toLocaleDateString("en-US", {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const toppingsStr = spec.toppings.length > 0 ? spec.toppings.join(", ") : "None";
    const colorsStr = spec.colors.join(", ");
    const masterName = chefNarrative ? chefNarrative.masterpieceTitle : "Bespoke Masterpiece";

    const text = `🌸 *FROSTELLA CUSTOM CAKE ORDER* 🌸
Hello Frostella Studio, I would like to design and order a custom masterpiece!

*Cake Concept Title:* "${masterName}"
*Occasion Theme:* ${spec.occasion}
*Cake Style:* ${spec.cakeType}
*Weight Size:* ${spec.weight}
*Geometric Shape:* ${spec.shape}
*Number of Layers:* ${spec.layers}
*Selected Flavor:* ${spec.flavor}
*Frosting Colors:* ${colorsStr}
*Artisanal Toppings:* ${toppingsStr}
*Sweetness Setting:* ${spec.sweetness}
*Custom Lettering:* "${spec.customMessage || "None"}"
*Deliver Date Request:* ${formattedDate}
*Estimated Price Quote:* ₹${calculatedPrice.toLocaleString('en-IN')}

I designed this cake using your live AI builder! Please review my custom specification and let me know if we can schedule it! ✨`;

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/15550201010?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleAddToCart = () => {
    onAddToCart(spec, deliveryDate, spec.customMessage, calculatedPrice);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="ai-cake-builder-section">
      
      {/* LEFT: Live Canvas View, estimated pricing & Chef dialogue (Span 4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Dynamic Cake Preview Canvas */}
        <InteractiveCakeCanvas 
          spec={spec}
          isAiLoading={isAiLoading}
          aiImageUrl={aiImageUrl}
          onTriggerAiRender={handleTriggerAiRender}
        />

        {/* --- CHEF BEATRICE AI REPORT --- */}
        <div className="bg-[#FFF8F0] border border-[#FFE5D0] rounded-3xl p-6 shadow-md relative overflow-hidden" id="chef-beatrice-panel">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FFE5D0]/30 to-[#FFE5D0]/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center space-x-3 mb-4">
            <span className="p-2 bg-[#FFE5D0] text-[#5A5A40] rounded-full">
              <ChefHat className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-serif font-bold text-[#5A5A40] text-sm">Chef Beatrice</h4>
              <p className="text-[10px] text-gray-400 capitalize">Creative Director, Frostella</p>
            </div>
          </div>

          {isChefLoading ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-2">
              <div className="w-6 h-6 border-2 border-dashed border-[#5A5A40] rounded-full animate-spin" />
              <p className="text-xs italic text-gray-400">Chef Beatrice is writing tasting notes...</p>
            </div>
          ) : chefNarrative ? (
            <div className="space-y-4 text-[#5A5A40]">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-[#5A5A40] font-bold font-display">
                  Active Concept
                </span>
                <h5 className="font-serif font-bold text-base text-[#5A5A40] italic">
                  "{chefNarrative.masterpieceTitle}"
                </h5>
              </div>

              {/* Chef process statement */}
              <p className="text-xs leading-relaxed text-[#5A5A40]/90 bg-white/40 p-3 rounded-xl border border-[#FFE5D0]/30 italic">
                "{chefNarrative.chefsNarrative}"
              </p>

              {/* Sommelier Tasting notes */}
              <div className="text-xs">
                <span className="font-bold text-[#5A5A40] block mb-1">Gourmet Tasting Notes:</span>
                <p className="text-gray-500 leading-relaxed font-medium">{chefNarrative.tastingNotes}</p>
              </div>

              {/* Luxury Pairings */}
              <div className="text-xs bg-[#FFE5D0]/30 p-2.5 rounded-lg border border-[#FFE5D0]/40">
                <span className="font-bold text-[#5A5A40] block mb-0.5 font-sans">Luxury Beverage Pairing:</span>
                <span className="text-gray-600 italic font-medium">{chefNarrative.luxuryPairing}</span>
              </div>

              {/* Interactive Nutrition panel */}
              <div className="border-t border-dashed border-[#FFE5D0] pt-3">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 font-display">
                  Dynamic Nutrition (Per serving)
                </span>
                <div className="grid grid-cols-4 gap-1 text-center">
                  <div className="bg-white/60 p-1.5 rounded-md border border-[#5A5A40]/10">
                    <span className="text-[9px] text-gray-400 block">Calories</span>
                    <span className="font-bold text-xs text-[#5A5A40]">{chefNarrative.nutrition.calories}</span>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded-md border border-[#5A5A40]/10">
                    <span className="text-[9px] text-gray-400 block">Sugar</span>
                    <span className="font-bold text-xs text-red-500">{chefNarrative.nutrition.sugarGrams}g</span>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded-md border border-[#5A5A40]/10">
                    <span className="text-[9px] text-gray-400 block">Proteins</span>
                    <span className="font-bold text-xs text-emerald-600">{chefNarrative.nutrition.proteinGrams}g</span>
                  </div>
                  <div className="bg-white/60 p-1.5 rounded-md border border-[#5A5A40]/10">
                    <span className="text-[9px] text-gray-400 block">Fats</span>
                    <span className="font-bold text-xs text-amber-600">{chefNarrative.nutrition.totalFatGrams}g</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs italic text-gray-400">Specify details on the right to summon Chef Beatrice's artisanal tasting breakdown.</p>
          )}

        </div>

      </div>

      {/* RIGHT: Specification Settings Controls (Span 8) */}
      <div className="lg:col-span-8 bg-white/90 rounded-3xl p-6 lg:p-8 border border-[#5A5A40]/10 shadow-lg space-y-8 h-fit">
        
        {/* Header Intro */}
        <div>
          <span className="bg-[#FFE5D0] text-[#5A5A40] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest font-display">
            Artisanal Lab
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#5A5A40] mt-2 italic">
            Configure Your Cake Masterpiece
          </h2>
          <p className="text-xs text-[#5A5A40]/80 mt-1 leading-relaxed">
            Every element is sculpted by hand inside our dreamy crystal kitchens. Tweak sizes, premium toppings, colors and custom messaging dynamically.
          </p>
                {/* SECTION 1: Theme & Occasion & Cake Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Occasion Option */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
              1. Occasion Theme
            </label>
            <select
              value={spec.occasion}
              onChange={(e) => updateSpecField("occasion", e.target.value)}
              className="w-full bg-[#FFF8F0]/80 border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-sm text-[#5A5A40] outline-none focus:border-[#5A5A40]/40"
              id="select-occasion"
            >
              {OCCASIONS_LIST.map(occ => (
                <option key={occ} value={occ}>{occ}</option>
              ))}
            </select>
          </div>

          {/* Cake Style/Type Option */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
              2. Structural Style
            </label>
            <select
              value={spec.cakeType}
              onChange={(e) => updateSpecField("cakeType", e.target.value)}
              className="w-full bg-[#FFF8F0]/80 border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-sm text-[#5A5A40] outline-none focus:border-[#5A5A40]/40"
              id="select-type"
            >
              {CAKE_TYPES_LIST.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

        </div>

        {/* SECTION 2: Dimensions - Shape, Layers & Weight */}
        <div className="space-y-4">
          <span className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider font-display">
            3. Layout & Geometry
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Shapes pill selector */}
            <div className="bg-[#FFF8F0]/30 border border-[#5A5A40]/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-[#5A5A40]/60 block mb-3">Geometric Silhouette</span>
              <div className="grid grid-cols-2 gap-2">
                {SHAPES_LIST.map(sh => {
                  const isSel = spec.shape === sh;
                  return (
                    <button
                      key={sh}
                      onClick={() => updateSpecField("shape", sh)}
                      className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSel 
                          ? "bg-[#FFE5D0] border-[#5A5A40]/25 text-[#5A5A40] scale-102 shadow-xs" 
                          : "bg-white border-gray-150 text-[#5A5A40]/75 hover:bg-[#FFF8F0]"
                      }`}
                      id={`shape-${sh.replace(" ", "-")}`}
                    >
                      {sh}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layers selector */}
            <div className="bg-[#FFF8F0]/30 border border-[#5A5A40]/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-[#5A5A40]/60 block mb-3">Baking Layers</span>
              <div className="grid grid-cols-1 gap-2">
                {LAYERS_LIST.slice(0, 4).map(lay => {
                  const isSel = spec.layers === lay;
                  return (
                    <button
                      key={lay}
                      onClick={() => updateSpecField("layers", lay)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all flex justify-between items-center cursor-pointer ${
                        isSel 
                          ? "bg-[#FFE5D0] border-[#5A5A40]/25 text-[#5A5A40] shadow-xs" 
                          : "bg-white border-gray-150 text-[#5A5A40]/75 hover:bg-[#FFF8F0]"
                      }`}
                      id={`layer-${lay.replace(" ", "-")}`}
                    >
                      <span>{lay}</span>
                      {isSel && <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weights selector */}
            <div className="bg-[#FFF8F0]/30 border border-[#5A5A40]/10 rounded-2xl p-4">
              <span className="text-xs font-semibold text-[#5A5A40]/60 block mb-3">Gourmet Weight</span>
              <div className="grid grid-cols-2 gap-2">
                {WEIGHTS_LIST.map(wt => {
                  const isSel = spec.weight === wt;
                  return (
                    <button
                      key={wt}
                      onClick={() => updateSpecField("weight", wt)}
                      className={`text-xs py-2 px-1 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSel 
                          ? "bg-[#FFE5D0] border-[#5A5A40]/25 text-[#5A5A40] shadow-xs" 
                          : "bg-white border-gray-150 text-[#5A5A40]/75 hover:bg-[#FFF8F0]"
                      }`}
                      id={`weight-${wt.replace(" ", "-")}`}
                    >
                      {wt}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: The 50+ Flavors Search and Select Grids */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-[#5A5A40]/10 pb-2">
            <span className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider font-display">
              4. Artisanal Flavor Base
            </span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search 50+ flavors..." 
                value={flavorSearch} 
                onChange={(e) => setFlavorSearch(e.target.value)}
                className="bg-white border border-[#5A5A40]/15 text-xs rounded-full px-3 py-1 w-44 outline-none focus:border-[#5A5A40]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 border border-[#5A5A40]/10 rounded-2xl bg-slate-50/50">
            {filteredFlavors.slice(0, flavorSliceCount).map(fl => {
              const isSel = spec.flavor === fl;
              return (
                <button
                  key={fl}
                  onClick={() => updateSpecField("flavor", fl)}
                  className={`text-[11px] py-2 px-2.5 rounded-xl border text-left font-medium line-clamp-2 transition-all cursor-pointer ${
                    isSel 
                      ? "bg-[#FFE5D0] border-[#5A5A40]/25 text-[#5A5A40] shadow-xs font-semibold ring-1 ring-[#FFE5D0]" 
                      : "bg-white border-gray-100 text-[#5A5A40] hover:bg-[#FFF8F0]/50"
                  }`}
                  id={`flavor-${fl.split(" ").join("-")}`}
                >
                  {fl}
                </button>
              );
            })}
            {filteredFlavors.length === 0 && (
              <p className="text-xs italic text-gray-400 p-4 col-span-full text-center">No flavors match your search. Custom request is fully active.</p>
            )}
          </div>
          
          {filteredFlavors.length > flavorSliceCount && (
            <button
              onClick={() => setFlavorSliceCount(prev => prev + 16)}
              className="mt-2 text-xs font-semibold text-[#5A5A40] hover:underline cursor-pointer"
            >
              + Load more exquisite flavors (Showing {flavorSliceCount} of {filteredFlavors.length})
            </button>
          )}
        </div>

        {/* SECTION 4: Pastels only Coloring Palette */}
        <div>
          <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
            5. Frosting Icing Pastels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {PASTEL_COLORS.map(col => {
              const isSel = spec.colors.includes(col.name);
              return (
                <button
                  key={col.name}
                  onClick={() => toggleArrayItem("colors", col.name)}
                  className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSel 
                      ? "border-[#5A5A40]/35 bg-white ring-2 ring-[#FFE5D0]/60 shadow-xs scale-102" 
                      : "border-gray-100 bg-white hover:bg-gray-50"
                  }`}
                  id={`color-${col.name.replace(" ", "-")}`}
                >
                  <span 
                    className={`w-8 h-8 rounded-full ${col.tailwind} border border-black/5 shadow-inner mb-1.5`} 
                    style={{ backgroundColor: col.hash }}
                  />
                  <span className="text-[10px] font-semibold text-[#5A5A40]">{col.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 5: Toppings Selection Grid */}
        <div>
          <span className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
            6. Luxurious Artisanal Toppings
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TOPPINGS_LIST.map(top => {
              const isSel = spec.toppings.includes(top);
              return (
                <button
                  key={top}
                  onClick={() => toggleArrayItem("toppings", top)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                    isSel 
                      ? "bg-[#FFE5D0] border-[#5A5A40]/25 text-[#5A5A40] shadow-xs font-semibold" 
                      : "bg-white border-[#5A5A40]/10 text-[#5A5A40]/75 hover:bg-[#FFF8F0]/30"
                  }`}
                  id={`topping-${top.replace(" ", "-")}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border ${isSel ? "bg-[#5A5A40] border-[#5A5A40]" : "bg-white border-gray-300"}`}>
                    {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="leading-tight shrink">{top}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: Sweetness setting */}
        <div>
          <span className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2.5 font-display">
            7. Sweetness Settings
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {["Sugar Free", "Low Sugar", "Medium Sweet", "Sweet", "Extra Sweet"].map(sw => {
              const isSel = spec.sweetness === sw;
              return (
                <button
                  key={sw}
                  onClick={() => updateSpecField("sweetness", sw)}
                  className={`text-xs py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                    isSel 
                      ? "bg-[#D9FFE8] border-[#D9FFE8] text-[#2C6A43] shadow-xs" 
                      : "bg-white border-[#5A5A40]/10 text-[#5A5A40]/75 hover:bg-gray-50"
                  }`}
                  id={`sweetness-${sw.replace(" ", "-")}`}
                >
                  {sw}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 7: Message and Date selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#5A5A40]/10 pt-6">
          
          {/* Custom Cake Message */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
              8. Customized Cream Lettering
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={40}
                placeholder="Ex: Elegant Happy Anniversary (Max 40 chars)"
                value={spec.customMessage}
                onChange={(e) => updateSpecField("customMessage", e.target.value)}
                className="w-full bg-[#FFF8F0]/80 border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-sm text-[#5A5A40] outline-none focus:border-[#5A5A40]/40"
                id="input-custom-message"
              />
              <span className="absolute right-3 top-3 text-[10px] text-gray-400">
                {spec.customMessage.length}/40
              </span>
            </div>
          </div>

          {/* Delivery date scheduler */}
          <div>
            <label className="block text-xs font-bold text-[#5A5A40] uppercase tracking-wider mb-2 font-display">
              9. Delivery Date Slot
            </label>
            <div className="relative">
              <input
                type="date"
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // Minimum 1 day notice
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full bg-[#FFF8F0]/80 border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-sm text-[#5A5A40] outline-none focus:border-[#5A5A40]/40 appearance-none"
                id="input-delivery-date"
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-[#5A5A40]/70 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* WORKFLOW CTAS: Save, Cart & WhatsApp Ordering */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#5A5A40]/10">
          
          {/* Wishlist design save */}
          <button
            onClick={() => onAddToWishlist(spec, chefNarrative || undefined, aiImageUrl || undefined)}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-full border border-[#5A5A40]/15 hover:bg-[#FFE5D0]/30 text-[#5A5A40] font-display font-semibold uppercase tracking-wider text-xs transition-colors cursor-pointer"
            id="btn-save-design"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Save Design</span>
          </button>

          {/* Add to checkout */}
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-[#5A5A40] hover:bg-[#6c6c52] text-white font-display font-semibold uppercase tracking-wider text-xs shadow-xs transition-all cursor-pointer"
            id="btn-add-to-cart"
          >
            <ShoppingCart className="w-4 h-4 text-[#FFE5D0]" />
            <span>Schedule Order</span>
          </button>

          {/* Direct WhatsApp channel */}
          <button
            onClick={triggerWhatsAppOrder}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-[#D9FFE8] hover:opacity-95 text-[#1FAF51] border border-[#B6F5CB] font-display font-semibold uppercase tracking-wider text-xs transition-all cursor-pointer"
            id="btn-whatsapp-order"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>Order on WhatsApp</span>
          </button>

        </div>  </div>

      </div>

    </div>
  );
}
