import React, { useState } from "react";
import { Heart, Trash2, Calendar, ShoppingCart, Sliders, ArrowRight, MessageSquare, Ship, Check, CheckCircle2, Award, Star, Search, ShieldCheck } from "lucide-react";
import { SavedDesign, OrderItem, CustomerReview, CakeSpecification } from "../types";
import { getUniqueCakeStyle } from "../lib/imageFilters";

// Static Customer Reviews Database
export const REVIEWS_DATABASE: CustomerReview[] = [
  {
    id: "rev-1",
    author: "Genevieve Dubois",
    rating: 5,
    reviewText: "The Whispering Lavender wedding cake was some other-worldly experience. It literally looked like sculpted silk. Every single petal was flawless, and the lemon undertone in the frosting left the guests absolutely breathless. The absolute apex of cake design.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    cakeType: "Wedding Cake",
    date: "May 28, 2026"
  },
  {
    id: "rev-2",
    author: "Priscilla Sterling",
    rating: 5,
    reviewText: "I custom-designed a triple-tiered heart cake for my daughter's engagement. Not only did we get a stunning real-time visual representation, but the physical cake was a exact replica of our selections. The gold leaf shimmer was spectacular. Will never order from anywhere else!",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    cakeType: "Designer Cake",
    date: "June 02, 2026"
  },
  {
    id: "rev-3",
    author: "Arthur Pendelton",
    rating: 5,
    reviewText: "Flawless Korean style bento cake! The mint green frosting was perfectly pastel, extremely light and airy cream. High-end, pristine presentation packaged in a dreamlike wax-sealed pink boutique box. True gourmet class.",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    cakeType: "Bento Cake",
    date: "June 09, 2026"
  }
];

// 1. WISHLIST PANEL
interface WishlistPanelProps {
  savedDesigns: SavedDesign[];
  onRemove: (id: string) => void;
  onConfigure: (spec: CakeSpecification) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistPanel({ savedDesigns, onRemove, onConfigure, isOpen, onClose }: WishlistPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="wishlist-overlay">
      <div className="absolute inset-0 bg-[#5A5A40]/30 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8F0] border-l border-[#5A5A40]/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#5A5A40]/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-400 fill-current" />
              <h3 className="font-serif text-lg font-bold text-[#5A5A40] italic">My Dream Designs</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-[#5A5A40]/70 hover:text-[#5A5A40] text-xs font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedDesigns.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Heart className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs mt-2">No custom designs saved yet.</p>
                <p className="text-[10px] text-gray-400">Design some masterpieces inside the Art Lab to retrieve them here!</p>
              </div>
            ) : (
              savedDesigns.map((design) => (
                <div key={design.id} className="bg-white rounded-2xl border border-[#5A5A40]/10 p-4 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[9px] font-bold text-[#5A5A40]/70 uppercase tracking-wider block">
                      {design.specification.occasion} Concept
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#5A5A40] italic">
                      "{design.chefNarrative?.masterpieceTitle || design.name}"
                    </h4>
                    <p className="text-[11px] text-[#5A5A40]/80 mt-1 font-medium">
                      Flavor: {design.specification.flavor} • {design.specification.layers} • {design.specification.weight}
                    </p>
                  </div>

                  {/* Render Thumbnail Image if AI photo exists */}
                  {design.customImageUrl && (
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-[#FFE5D0] shadow-sm">
                      <img src={design.customImageUrl} alt={design.name} style={getUniqueCakeStyle(design.name)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-[#5A5A40]">Est: ₹{design.priceEstimate.toLocaleString('en-IN')}</span>
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => {
                          onConfigure(design.specification);
                          onClose();
                        }}
                        className="p-1.5 rounded-full bg-[#FFE5D0]/50 hover:bg-[#FFE5D0] text-[#5A5A40]"
                        title="Load specs to configure further"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemove(design.id)}
                        className="p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                        title="Delete design"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#5A5A40]/10 bg-white shadow-inner">
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              *Saved designs are persisted securely inside your local studio library database.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}


// 2. SCHEDULED CART PANEL
interface ScheduledCartPanelProps {
  cartItems: OrderItem[];
  onRemove: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduledCartPanel({ cartItems, onRemove, isOpen, onClose }: ScheduledCartPanelProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [generatedId, setGeneratedId] = useState<string>("");

  const totalCost = cartItems.reduce((acc, item) => acc + item.price, 0);

  // Compile and trigger comprehensive Master WhatsApp message for all cart items together
  const handleFinalizeWhatsAppOrder = () => {
    const finalName = customerName.trim() || "Valued Frostella Guest";
    const finalPhone = customerPhone.trim() || "(Direct Order)";
    const finalAddress = customerAddress.trim() || "Bespoke Handcraft Pickup inside Studio";
    const finalNotes = customerNotes.trim() || "None";

    const orderRef = `FROST-LUX-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedId(orderRef);

    const whatsappText = `🌸 *FROSTELLA BOUTIQUE SPECIAL RESERVATION* 🌸
Hello Frostella Studio, I would like to finalize my active cake carriages!

*CLIENT DETAILS:*
- Name: ${finalName}
- Phone: ${finalPhone}
- Delivery Address: ${finalAddress}
- Special Instructions: ${finalNotes}
- Studio Tracking Code: ${orderRef}

*RESERVATIONS LIST:*
${cartItems.map((item, index) => `${index + 1}. *${item.name}*
   - Description: ${item.details}
   - Estimated Cost: ₹${item.price.toLocaleString('en-IN')}
   - Delivery Slot Selected: ${new Date(item.deliveryDate).toLocaleDateString()}`).join("\n\n")}

*COMBINED ORDER ESTIMATE:* ₹${totalCost.toLocaleString('en-IN')}

Please log this master booking inside the crystal kiln ledger! ✨`;

    const encoded = encodeURIComponent(whatsappText);
    const customLink = `https://wa.me/15550201010?text=${encoded}`;
    
    // Dispatch
    window.open(customLink, "_blank");
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-overlay">
      <div className="absolute inset-0 bg-[#5A5A40]/30 backdrop-blur-xs transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFF8F0] border-l border-[#5A5A40]/10 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#5A5A40]/10 flex items-center justify-between col-span-1">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-[#5A5A40]" />
              <h3 className="font-serif text-lg font-bold text-[#5A5A40] italic">
                {step === "cart" && "Studio Reservations"}
                {step === "checkout" && "Artisan Checkout"}
                {step === "success" && "Carriage Secured"}
              </h3>
            </div>
            <button 
              onClick={() => {
                setStep("cart");
                onClose();
              }}
              className="text-[#5A5A40]/70 hover:text-[#5A5A40] text-xs font-semibold px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Core Body Steps */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* STEP 1: CART LIST */}
            {step === "cart" && (
              <>
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-gray-400">
                    <ShoppingCart className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs mt-2">No scheduled orders yet.</p>
                    <p className="text-[10px] text-gray-400">Add preset cakes or custom masterpieces to configure delivery dates!</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-[#5A5A40]/10 p-4 shadow-sm flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] bg-[#FFE5D0] text-[#5A5A40] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            {item.type === "custom" ? "Bespoke Sculpt" : "Studio Collection"}
                          </span>
                          <button
                            onClick={() => onRemove(item.id)}
                            className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Remove reservation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-[#5A5A40] mt-1 italic">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#5A5A40]/85 leading-normal mt-1 font-medium">
                          {item.details}
                        </p>
                      </div>

                      {/* Delivery date block */}
                      <div className="bg-[#FFF8F0] p-2.5 rounded-xl border border-[#FFE5D0]/30 text-[11px] flex justify-between">
                        <div>
                          <span className="text-gray-400">Delivery Slot:</span>
                          <p className="font-bold text-[#5A5A40]">{new Date(item.deliveryDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-400">Item Cost:</span>
                          <p className="font-extrabold text-[#5A5A40]">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* Ordering on WhatsApp direct button channel */}
                      <button
                        onClick={() => window.open(item.whatsappLink, "_blank")}
                        className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-[#B6F5CB] rounded-full bg-[#D9FFE8] text-[#2C6A43] text-xs font-semibold uppercase tracking-wide hover:opacity-95 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>Instant Send Order to WhatsApp</span>
                      </button>

                    </div>
                  ))
                )}
              </>
            )}

            {/* STEP 2: CHECKOUT FORM DETAILS */}
            {step === "checkout" && (
              <div className="space-y-4 animate-fade-in text-[#5A5A40]">
                <div className="bg-white p-4 rounded-2xl border border-[#5A5A40]/10 space-y-3">
                  <h4 className="font-serif font-bold text-sm italic border-b border-gray-100 pb-2">Kiln Delivery Information</h4>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Clara Sterling"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#FFF8F0]/85 rounded-xl border border-[#5A5A40]/15 px-3 py-2 text-xs text-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider mb-1">Mobiles Number / Whatsapp</label>
                    <input 
                      type="text" 
                      placeholder="Ex: +91 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#FFF8F0]/85 rounded-xl border border-[#5A5A40]/15 px-3 py-2 text-xs text-[#5A5A40] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider mb-1">Bespoke Delivery Address</label>
                    <textarea 
                      rows={3}
                      placeholder="Ex: Penthouse 4A, Orchid Towers, Sector 15"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-[#FFF8F0]/85 rounded-xl border border-[#5A5A40]/15 px-3 py-2 text-xs text-[#5A5A40] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#5A5A40]/70 uppercase tracking-wider mb-1">Optional Cake Care Details / Eggless</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 100% Eggless, make it mild sweet"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full bg-[#FFF8F0]/85 rounded-xl border border-[#5A5A40]/15 px-3 py-2 text-xs text-[#5A5A40] outline-none"
                    />
                  </div>
                </div>

                {/* Micro order summary list preview inside checkout */}
                <div className="bg-[#FFE5D0]/30 border border-[#FFE5D0] p-4 rounded-2xl text-xs space-y-2">
                  <span className="font-bold text-[10px] uppercase text-[#5A5A40]">Booking carriage summary:</span>
                  <div className="space-y-1 text-gray-500">
                    {cartItems.map((c, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="truncate max-w-[200px]">{c.name}</span>
                        <span className="font-bold text-[#5A5A40]">₹{c.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS BLOCK */}
            {step === "success" && (
              <div className="text-center py-10 space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-[#D9FFE8] text-[#2C6A43] border border-[#B6F5CB] rounded-full mx-auto flex items-center justify-center animate-bounce shadow-md">
                  <Check className="w-8 h-8 font-bold" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-bold text-[#5A5A40] italic">Carriage Secured!</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    We've formatted your custom specifications successfully and loaded the whatsapp link. If the window did not open, click the button below to resume.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#5A5A40]/10 max-w-xs mx-auto space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#5A5A40]/60 font-bold font-display block">Studio Tracking Reference</span>
                  <div className="font-mono text-base font-bold text-[#5A5A40] tracking-wider select-all" id="success-track-ref">
                    {generatedId || "FROST-LUX-928"}
                  </div>
                  <p className="text-[10px] text-gray-400">Input this ID on the main page to monitor baking stages.</p>
                </div>

                <button
                  onClick={() => {
                    setStep("cart");
                    onClose();
                  }}
                  className="px-6 py-2 bg-[#5A5A40] hover:bg-[#6c6c52] text-white text-xs font-semibold rounded-full uppercase tracking-wider font-display transition-colors cursor-pointer"
                >
                  Return to Lab
                </button>
              </div>
            )}

          </div>

          {/* Checkout block with pricing totaling inside Footer */}
          {step !== "success" && (
            <div className="p-6 border-t border-[#5A5A40]/10 bg-white shadow-inner space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-500 uppercase tracking-widest text-xs font-display">Total Reservations:</span>
                <span className="font-serif text-xl font-bold text-[#5A5A40]">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>

              {cartItems.length > 0 && (
                <div className="flex space-x-2">
                  {step === "checkout" && (
                    <button
                      onClick={() => setStep("cart")}
                      className="px-4 py-3 rounded-full border border-[#5A5A40]/15 text-[#5A5A40] text-xs font-semibold font-display hover:bg-gray-50 transition-colors cursor-pointer uppercase"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (step === "cart") {
                        setStep("checkout");
                      } else {
                        handleFinalizeWhatsAppOrder();
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-3 px-4 rounded-full bg-[#5A5A40] text-white hover:bg-[#6c6c52] font-display font-semibold uppercase tracking-widest text-xs cursor-pointer shadow-sm"
                    id="btn-finalize-booking-channel"
                  >
                    <span>
                      {step === "cart" ? "Finalize Booking Channels" : "Secure Slots & Send Whatsapp"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#FFE5D0]" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


// 3. ORDER TRACKING status widget
export function OrderTracker() {
  const [typedId, setTypedId] = useState<string>("");
  const [activeTracking, setActiveTracking] = useState<boolean>(false);
  
  const MOCK_STAGES = [
    { title: "Design Architectural Structure", desc: "Chef Beatrice evaluates details and maps structure layouts.", code: "STAGE_DESIGN_DONE", active: true },
    { title: "Baking Cake Sponge core", desc: "Premium organic local ingredients blended and baked in low heat.", code: "STAGE_BAKING", active: true },
    { title: "Piping Pastel Frosting layers", desc: "Delicate layering of organic fruits and hand-piped pastel cream icing.", code: "STAGE_FROSTING", active: true },
    { title: "Artisanal Topping Ornament decoration", desc: "Affixing macaron sets, glazed strawberry crowns, and 24K gold leaf detailing.", code: "STAGE_TOPO_DONE", active: false },
    { title: "Cloche Chilled Carriage delivery", desc: "Secured inside pristine temperature controlled boxes en route.", code: "STAGE_EN_ROUTE", active: false }
  ];

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedId.trim()) return;
    setActiveTracking(true);
  };

  return (
    <div className="bg-white/80 rounded-3xl p-6 border border-[#5A5A40]/10 shadow-md max-w-2xl mx-auto my-12" id="order-tracker-box">
      <div className="flex items-center space-x-3 mb-4">
        <span className="p-2 bg-[#FFF8F0] text-[#5A5A40] rounded-full border border-[#FFE5D0]">
          <CheckCircle2 className="w-5 h-5 text-[#5A5A40]" />
        </span>
        <div>
          <h3 className="font-serif font-bold text-lg text-[#5A5A40] italic">Live Studio Carriage Tracking</h3>
          <p className="text-[10px] text-[#5A5A40]/60 uppercase tracking-widest font-display">Real-time baking stages</p>
        </div>
      </div>

      <form onSubmit={handleTrackSubmit} className="flex space-x-2 mb-6">
        <input 
          type="text" 
          placeholder="Ex: FROST-Luxury-928" 
          value={typedId}
          onChange={(e) => setTypedId(e.target.value)}
          className="flex-1 bg-[#FFF8F0]/80 rounded-xl border border-[#5A5A40]/15 px-4 py-2.5 text-xs text-[#5A5A40] outline-none placeholder-[#5A5A40]/40 focus:border-[#5A5A40]/40"
          id="input-tracker-id"
        />
        <button 
          type="submit"
          className="bg-[#5A5A40] hover:bg-[#6c6c52] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer uppercase tracking-wider font-display"
        >
          Locate
        </button>
      </form>

      {activeTracking ? (
        <div className="space-y-4 pt-2">
          
          <div className="bg-sky-50 border border-sky-100 p-3 rounded-2xl flex items-center justify-between text-xs mb-4">
            <span className="font-semibold text-sky-700">Carriage Status:</span>
            <span className="bg-sky-500 text-white font-bold p-1 rounded uppercase min-w-[70px] text-center text-[9px] tracking-widest animate-pulse-subtle">
              FROSTING TIER
            </span>
          </div>

          <div className="relative pl-6 space-y-6 border-l-[1.5px] border-[#5A5A40]/20 ml-2">
            {MOCK_STAGES.map((stg, i) => (
              <div key={i} className="relative text-xs">
                {/* Node circle state indicator */}
                <div className={`absolute -left-[30px] top-0 w-4 h-4 rounded-full border flex items-center justify-center ${stg.active ? "bg-[#5A5A40] border-[#5A5A40] text-white" : "bg-white border-gray-200 text-gray-300"}`}>
                  {stg.active ? <Check className="w-2.5 h-2.5" /> : null}
                </div>
                
                <div>
                  <h4 className={`font-semibold ${stg.active ? "text-[#5A5A40]" : "text-gray-300"}`}>{stg.title}</h4>
                  <p className={`text-[10px] mt-0.5 leading-relaxed ${stg.active ? "text-gray-500" : "text-gray-300 font-normal"}`}>
                    {stg.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-center text-gray-400 italic py-6">Enter your custom Reservation ID above to monitor the continuous icing status of your cake.</p>
      )}

    </div>
  );
}


// 4. CUSTOMER REVIEWS WIDGET FOOTER
export function CustomerReviewsSection() {
  const [newReviewText, setNewReviewText] = useState<string>("");
  const [newAuthor, setNewAuthor] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviews, setReviews] = useState<CustomerReview[]>(REVIEWS_DATABASE);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newAuthor.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-custom-${Date.now()}`,
      author: newAuthor,
      rating: reviewRating,
      reviewText: newReviewText,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120", // placeholder
      cakeType: "Bespoke Sculpt",
      date: "Today"
    };

    setReviews(prev => [newRev, ...prev]);
    setNewAuthor("");
    setNewReviewText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 border-t border-[#5A5A40]/10" id="reviews-section-container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Review list display (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold font-display">Tasting Board</span>
            <h3 className="font-serif text-3xl font-bold text-[#5A5A40] mt-1 italic">Liturgy of the Satisfied</h3>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white/80 border border-[#5A5A40]/10 rounded-2xl p-5 shadow-xs relative">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                    <img src={rev.avatar} alt={rev.author} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-xs text-[#5A5A40]">{rev.author}</h4>
                      {rev.verified && (
                        <span className="text-[8px] bg-[#D9FFE8] text-[#2C6A43] border border-[#B6F5CB]/30 px-1.5 py-0.5 rounded-full font-bold uppercase flex items-center">
                          <Check className="w-2.5 h-2.5 mr-0.5" /> Verified Order
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 mt-0.5">
                      <span className="font-bold text-[#5A5A40]/80">{rev.cakeType}</span>
                      <span>• {rev.date}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center space-x-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#5A5A40]/90 italic leading-relaxed font-semibold">"{rev.reviewText}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create Review panel (Span 5) */}
        <div className="lg:col-span-5 bg-white/95 rounded-3xl p-6 border border-[#5A5A40]/10 shadow-md">
          <h4 className="font-serif text-xl font-bold mb-1 text-[#5A5A40] italic">Contribute a Review</h4>
          <p className="text-xs text-[#5A5A40]/70 mb-4 leading-normal">
            Bask in the glory of fine frosting? Send back your sensory feedback for the master guild chefs.
          </p>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40]/80 uppercase tracking-wider mb-1 font-display">Aroma Name</label>
              <input 
                type="text" 
                placeholder="Ex: Beatrice S." 
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full bg-[#FFF8F0]/80 rounded-xl border border-[#5A5A40]/15 px-4 py-2.5 text-xs text-[#5A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40]/80 uppercase tracking-wider mb-1 font-display">Tasting Rating</label>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-center cursor-pointer"
                  >
                    <Star className={`w-5 h-5 cursor-pointer ${star <= reviewRating ? "text-amber-500 fill-current" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40]/80 uppercase tracking-wider mb-1 font-display">Sensory Review Description</label>
              <textarea 
                rows={3}
                placeholder="Describe your tasting experience in details..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                className="w-full bg-[#FFF8F0]/80 rounded-xl border border-[#5A5A40]/15 px-4 py-2 text-xs text-[#5A5A40] outline-none resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#5A5A40] text-xs font-bold text-white uppercase tracking-widest font-display shadow-2xs hover:bg-[#6c6c52] transition-colors cursor-pointer"
            >
              Submit Critique
            </button>
          </form>

          {/* Secure Studio check banner */}
          <div className="mt-4 flex items-center space-x-2 bg-[#D9FFE8]/50 border border-[#B6F5CB]/30 p-2.5 rounded-xl text-[10px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-[#2C6A43] flex-shrink-0" />
            <span>Critiques are verified on the secure studio ledger database safely.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
