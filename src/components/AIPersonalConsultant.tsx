import React, { useState } from "react";
import { Sparkles, MessageSquare, Coffee, Compass, ArrowRight, HelpCircle } from "lucide-react";
import { CakeRecommendation, CakeSpecification } from "../types";

interface AIPersonalConsultantProps {
  onApplyRecommendation: (recommendedSpec: CakeSpecification) => void;
}

export default function AIPersonalConsultant({ onApplyRecommendation }: AIPersonalConsultantProps) {
  const [promptInput, setPromptInput] = useState<string>("");
  const [occasionInput, setOccasionInput] = useState<string>("Birthday");
  const [flavorPreference, setFlavorPreference] = useState<string>("");
  const [glutenFree, setGlutenFree] = useState<boolean>(false);
  const [dairyFree, setDairyFree] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<CakeRecommendation | null>(null);

  // Suggested quick prompts to help make the interface highly interactive
  const SUGGESTED_IDEAS = [
    { label: "Garden Tea Wedding", occasion: "Wedding", flavor: "Pistachio Rose Blossom", desc: "A whimsical floral tea celebration with soft peony decorations and light flavors." },
    { label: "Golden Anniversary", occasion: "Anniversary", flavor: "Tiramisu with Gold Dust", desc: "A regal and indulgent double tier with gold sparkles and espresso notes." },
    { label: "Summer Orchard Baby Shower", occasion: "Baby Shower", flavor: "Strawberry Bliss", desc: "A fresh and cheerful cream-layered cake styled with glazed summer fruits." }
  ];

  const handleConsult = async (customPrompt?: string, customOccasion?: string, customFlavor?: string) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const payload = {
        prompt: customPrompt || promptInput,
        occasion: customOccasion || occasionInput,
        flavorPreference: customFlavor || flavorPreference,
        glutenFree,
        dairyFree
      };

      const res = await fetch("/api/recommend-cake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setRecommendation(data);
      } else {
        alert("Our luxury consultant is currently resting. Please try again soon!");
      }
    } catch (e) {
      console.error(e);
      alert("Consultation channel is currently congested. Your builder specifications are fully active.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToBuilder = () => {
    if (!recommendation) return;

    // Convert recommended concept into matching builder specification
    const spec: CakeSpecification = {
      occasion: occasionInput,
      cakeType: "Designer Cake",
      weight: "1.5kg",
      shape: "Round", // default
      layers: "Double Layer", // default
      flavor: recommendation.flavors ? (recommendation.flavors.split(",")[0] || "Vanilla Bean Madagascar") : "Vanilla Bean Madagascar",
      sweetness: "Medium Sweet",
      // Map toppings if returned or default
      toppings: recommendation.toppings && recommendation.toppings.length > 0 
        ? recommendation.toppings.slice(0, 4) 
        : ["Edible Flowers", "Gold Leaf"],
      colors: ["Pastel Pink", "Ivory Shimmer"],
      customMessage: recommendation.title || "Masterpiece Concept"
    };

    onApplyRecommendation(spec);
    
    // Smooth scroll back to workspace
    document.getElementById("ai-cake-builder-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12" id="ai-consultant-section">
      <div className="bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D0]/20 to-[#FFE5D0]/30 border border-[#5A5A40]/10 rounded-3xl p-6 md:p-8 shadow-xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Input specifications (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold font-display">
                Concierge Studio
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#5A5A40] mt-1">
                Consult our AI Cake Couturier
              </h2>
              <p className="text-xs text-[#5A5A40]/70 mt-1">
                Describe the atmosphere, matching colors, or personal flavor profiles, and our AI artist will draft a bespoke masterpiece concept for you.
              </p>
            </div>

            {/* Occasion Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#5A5A40]/80 uppercase tracking-wider mb-1.5 font-display">
                Celebrate Occasion
              </label>
              <select
                value={occasionInput}
                onChange={(e) => setOccasionInput(e.target.value)}
                className="w-full bg-white border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-xs text-[#5A5A40] outline-none"
              >
                {["Birthday", "Wedding", "Anniversary", "Engagement", "Baby Shower", "Graduation", "Corporate Event", "Festival", "Custom Occasion"].map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            {/* Flavor preferences (or ingredients) */}
            <div>
              <label className="block text-xs font-semibold text-[#5A5A40]/80 uppercase tracking-wider mb-1.5 font-display">
                Base Flavor Preferences
              </label>
              <input
                type="text"
                placeholder="Ex: I love rich Belgian dark chocolate and raspberries..."
                value={flavorPreference}
                onChange={(e) => setFlavorPreference(e.target.value)}
                className="w-full bg-white border border-[#5A5A40]/15 rounded-xl px-4 py-2.5 text-xs text-[#5A5A40] outline-none"
              />
            </div>

            {/* Custom Narrative Dream Description */}
            <div>
              <label className="block text-xs font-semibold text-[#5A5A40]/80 uppercase tracking-wider mb-1.5 font-display">
                Bespoke Vibe Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your perfect cake setup, decorations, theme or special textures..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full bg-white border border-[#5A5A40]/15 rounded-xl px-4 py-2 text-xs text-[#5A5A40] outline-none resize-none"
              />
            </div>

            {/* Dietary Constraints */}
            <div className="flex space-x-4 pt-1.5">
              <label className="flex items-center space-x-2 text-xs text-[#5A5A40]/80">
                <input 
                  type="checkbox" 
                  checked={glutenFree} 
                  onChange={(e) => setGlutenFree(e.target.checked)}
                  className="rounded text-[#5A5A40] border-gray-300"
                />
                <span>Gluten Free Base</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-[#5A5A40]/80">
                <input 
                  type="checkbox" 
                  checked={dairyFree} 
                  onChange={(e) => setDairyFree(e.target.checked)}
                  className="rounded text-[#5A5A40] border-gray-300"
                />
                <span>Vegan Dairy Free</span>
              </label>
            </div>

            {/* Action Consult Button */}
            <button
              onClick={() => handleConsult()}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-[#5A5A40] text-white font-display font-semibold uppercase tracking-wider text-xs shadow-md hover:bg-[#6C6C52] cursor-pointer disabled:opacity-50 transition-all duration-300"
              id="btn-ai-consult-trigger"
            >
              <Sparkles className="w-4 h-4 text-[#FFE5D0] animate-spin-slow" />
              <span>{isLoading ? "Consulting Chef Guild..." : "Draft Bespoke AI Cake Design"}</span>
            </button>

            {/* Suggested Shortcuts */}
            <div className="border-t border-[#5A5A40]/10 pt-4">
              <span className="text-[10px] uppercase font-bold text-[#5A5A40]/60 block mb-2 font-display">
                Or Quick Inspiration
              </span>
              <div className="flex flex-col gap-2">
                {SUGGESTED_IDEAS.map((idea, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setOccasionInput(idea.occasion);
                      setFlavorPreference(idea.flavor);
                      setPromptInput(idea.desc);
                      handleConsult(idea.desc, idea.occasion, idea.flavor);
                    }}
                    className="text-left bg-white/70 p-2.5 rounded-xl border border-[#5A5A40]/10 hover:border-[#5A5A40]/30 hover:bg-white text-xs transition-all"
                  >
                    <span className="font-semibold text-[#5A5A40] block">{idea.label}</span>
                    <span className="text-[11px] text-[#5A5A40]/60 line-clamp-1">{idea.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: AI suggestion feedback (Span 7) */}
          <div className="lg:col-span-7 bg-white/65 border border-[#5A5A40]/10 rounded-2xl p-6 min-h-[380px] flex flex-col justify-center">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-12">
                <div className="w-10 h-10 border-4 border-dashed border-[#5A5A40] rounded-full animate-spin" />
                <h4 className="font-serif font-bold text-[#5A5A40] text-lg italic">Cursive Draft in progress...</h4>
                <p className="text-xs text-[#5A5A40]/60 text-center max-w-xs px-4">
                  Our AI is layering colors, sculpting shapes, and formulating taste notes based on your luxurious description.
                </p>
              </div>
            ) : recommendation ? (
              <div className="space-y-6 text-[#5A5A40] animate-pulse-subtle">
                
                {/* Masterpiece Title header */}
                <div className="border-b border-dashed border-[#5A5A40]/10 pb-4">
                  <span className="bg-[#FFE5D0] text-[#5A5A40] text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md">
                    Bespoke Concept Drafted
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#5A5A40] mt-2 italic">
                    "{recommendation.title}"
                  </h3>
                </div>

                {/* Vibe and visual descriptions */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-[#5A5A40] uppercase tracking-wider text-[10px] block font-display">
                    Dreamlike Visual Architecture
                  </span>
                  <p className="text-[#5A5A40]/90 leading-relaxed bg-[#FFF8F0]/30 p-3.5 border border-[#FFE5D0]/30 rounded-xl">
                    {recommendation.description}
                  </p>
                </div>

                {/* Layers layout and geometry suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#FFE5D0]/20 p-3 rounded-xl border border-[#FFE5D0]/50">
                    <span className="font-bold text-[#5A5A40] block mb-0.5">Recommended Structure:</span>
                    <span className="text-[#5A5A40]/80 leading-relaxed">{recommendation.layersConfig}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#5A5A40]/10">
                    <span className="font-bold text-[#5A5A40] block mb-0.5">Sensory Flavors:</span>
                    <span className="text-[#5A5A40]/80 leading-relaxed font-semibold">{recommendation.flavors}</span>
                  </div>
                </div>

                {/* Suggest Toppings and embellishment list */}
                {recommendation.toppings && recommendation.toppings.length > 0 && (
                  <div className="text-xs">
                    <span className="font-bold text-[#5A5A40] block mb-1.5 uppercase text-[10px] tracking-wider">toppings & garnishments</span>
                    <div className="flex flex-wrap gap-1.5">
                      {recommendation.toppings.map((top, i) => (
                        <span key={i} className="bg-white px-2.5 py-1 border border-[#5A5A40]/10 text-[#5A5A40] rounded-full text-[10px] font-medium font-display uppercase tracking-wide">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultants personal notes */}
                <div className="text-xs italic text-[#5A5A40]/70 leading-relaxed border-t border-[#5A5A40]/10 pt-4">
                  <span className="font-semibold text-[#5A5A40] not-italic block mb-0.5 font-sans">Couturier’s Consultation Summary:</span>
                  "{recommendation.consultantNotes}"
                </div>

                {/* Apply recommendation directly */}
                <button
                  onClick={handleApplyToBuilder}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-[#5A5A40] hover:bg-[#6c6c52] text-white font-display font-semibold uppercase tracking-wider text-xs shadow-xs transition-colors cursor-pointer"
                  id="btn-apply-ai-rec"
                >
                  <span>Build and Sculpt This Design in Studio</span>
                  <ArrowRight className="w-4 h-4 text-[#FFE5D0]" />
                </button>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12 text-[#5A5A40]/40 space-y-3">
                <span className="p-3 bg-[#FFE5D0]/60 rounded-full text-[#5A5A40]">
                  <MessageSquare className="w-6 h-6" />
                </span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#5A5A40]">Consultation Desk Empty</h4>
                  <p className="text-[11px] max-w-xs mx-auto text-[#5A5A40]/60 mt-1 leading-relaxed">
                    Specify preferences or select a quick inspiration draft on the left to write a personalized luxury concept.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
