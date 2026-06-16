import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Heart, Bookmark, Calendar, ArrowRight, Star, ShoppingBag, PhoneCall, ChevronRight, Cake, MapPin, Smile, Eye, ToggleLeft, Layers, Sparkle } from "lucide-react";
import { motion } from "motion/react";
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import Navigation from "./components/Navigation";
import AICakeBuilder from "./components/AICakeBuilder";
import PremiumCollections from "./components/PremiumCollections";
import AIPersonalConsultant from "./components/AIPersonalConsultant";
import FlavorStructureShowcase from "./components/FlavorStructureShowcase";
import { 
  WishlistPanel, 
  ScheduledCartPanel, 
  OrderTracker, 
  CustomerReviewsSection 
} from "./components/SpecialFeatures";
import { CakeSpecification, SavedDesign, ChefNarrative, OrderItem, CollectionCake } from "./types";
import { getUniqueCakeStyle } from "./lib/imageFilters";
import SvgCakeFilters from "./components/SvgCakeFilters";
import { useAuth } from "./components/FirebaseProvider";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";

// Import custom 8K generated studio assets for background branding & front-page orders
import aestheticCakeBg from "./assets/images/aesthetic_cake_bg_1781168939127.png";
import crystalShimmerCake from "./assets/images/crystal_shimmer_cake_1781168953961.png";
import royalWhiteGold from "./assets/images/royal_white_gold_1781168971447.png";
import peopleCelebratingCake from "./assets/images/people_celebrating_cake_1781169471770.png";
import butterscotchSingleStep from "./assets/images/butterscotch_single_step_1781170079949.png";
import chocolateMultiStep from "./assets/images/chocolate_multi_step_1781170096977.png";

// Import existing collections assets for homepage features
import weddingCakeLux from "./assets/images/wedding_cake_lux_1781166503230.png";
import floralPeachCake from "./assets/images/floral_peach_cake_1781166529233.png";

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // States remain for UI responsiveness, but will be synced with Firestore when user is logged in
  const [wishlist, setWishlist] = useState<SavedDesign[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Firestore Syncing
  useEffect(() => {
    if (!user) {
      // Load from localStorage for anonymous users
      try {
        const savedWish = localStorage.getItem("frostella_wishlist");
        const savedCart = localStorage.getItem("frostella_cart");
        if (savedWish) setWishlist(JSON.parse(savedWish));
        if (savedCart) setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Local storage lookup failed safely.", e);
      }
      return;
    }

    // Sync Wishlist from Firestore
    const wishlistQuery = query(collection(db, "saved_designs"), where("userId", "==", user.uid));
    const unsubscribeWishlist = onSnapshot(wishlistQuery, (snapshot) => {
      const designs = snapshot.docs.map(doc => doc.data() as SavedDesign);
      setWishlist(designs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "saved_designs");
    });

    // Sync Cart from Firestore (Simplified as a single document or collection)
    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid), where("status", "==", "pending"));
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const allItems: OrderItem[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.items) allItems.push(...data.items);
      });
      setCart(allItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "orders");
    });

    return () => {
      unsubscribeWishlist();
      unsubscribeOrders();
    };
  }, [user]);

  // Persistence helpers
  const saveWishlist = async (newDesign: SavedDesign) => {
    if (user) {
      try {
        await setDoc(doc(db, "saved_designs", newDesign.id), { ...newDesign, userId: user.uid });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `saved_designs/${newDesign.id}`);
      }
    } else {
      const updated = [newDesign, ...wishlist];
      setWishlist(updated);
      localStorage.setItem("frostella_wishlist", JSON.stringify(updated));
    }
  };

  const handleRemoveFromWishlist = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, "saved_designs", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `saved_designs/${id}`);
      }
    } else {
      const updated = wishlist.filter(d => d.id !== id);
      setWishlist(updated);
      localStorage.setItem("frostella_wishlist", JSON.stringify(updated));
    }
  };

  const saveCartItem = async (newItem: OrderItem) => {
    if (user) {
      try {
        // For simplicity in this bespoke app, we store pending cart items in a single user order doc or separate orders
        // Here we'll use a separate doc per cart item for granular control
        await setDoc(doc(db, "orders", newItem.id), { 
          id: newItem.id,
          userId: user.uid, 
          items: [newItem], 
          totalPrice: newItem.price,
          status: "pending",
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `orders/${newItem.id}`);
      }
    } else {
      const updated = [newItem, ...cart];
      setCart(updated);
      localStorage.setItem("frostella_cart", JSON.stringify(updated));
    }
  };

  const handleRemoveFromCart = async (id: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, "orders", id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `orders/${id}`);
      }
    } else {
      const updated = cart.filter(item => item.id !== id);
      setCart(updated);
      localStorage.setItem("frostella_cart", JSON.stringify(updated));
    }
  };

  // 1. Save spec configuration to Wishlist/Saved Studio Designs
  const handleAddToWishlist = (spec: CakeSpecification, chefNarrative?: ChefNarrative, customImageUrl?: string) => {
    const defaultTitle = chefNarrative ? chefNarrative.masterpieceTitle : `${spec.occasion} Dream`;
    const newDesign: SavedDesign = {
      id: `saved-${Date.now()}`,
      name: defaultTitle,
      specification: spec,
      chefNarrative,
      customImageUrl,
      priceEstimate: 65, 
      savedAt: new Date().toISOString()
    };
    saveWishlist(newDesign);
    alert(`✨ Saved your bespoke concept "${defaultTitle}" to your dream designs checklist!`);
  };

  // 2. Schedule Design to Cart
  const handleAddToCart = (spec: CakeSpecification, date: string, customMsg: string, price: number) => {
    const orderTitle = `Bespoke ${spec.occasion} ${spec.shape} Tower`;
    const toppingsJoined = spec.toppings.length > 0 ? spec.toppings.join(", ") : "None";
    
    const whatsappQuery = `🌸 *FROSTELLA BESPOKE ORDER* 🌸
I scheduled a reserve custom cake delivery!
- Occasion: ${spec.occasion}
- Structure Style: ${spec.cakeType}
- Size: ${spec.weight}
- Shape: ${spec.shape} • ${spec.layers}
- Flavor: ${spec.flavor}
- Frosting colors: ${spec.colors.join(", ")}
- Toppings: ${toppingsJoined}
- Sweetness: ${spec.sweetness}
- Custom Message: "${customMsg || "None"}"
- Delivery Slot: ${new Date(date).toLocaleDateString()}
- Estimated Price: ₹${price.toLocaleString('en-IN')}

Please confirm my scheduled reservation! ✨`;

    const encodedMsg = encodeURIComponent(whatsappQuery);
    const link = `https://wa.me/15550201010?text=${encodedMsg}`;

    const newOrderItem: OrderItem = {
      id: `cart-${Date.now()}`,
      type: "custom",
      name: orderTitle,
      details: `${spec.flavor} (${spec.layers}), size: ${spec.weight}, shape: ${spec.shape}. Colors: ${spec.colors.join(", ")}.`,
      price,
      spec,
      deliveryDate: date,
      customerMessage: customMsg,
      whatsappLink: link
    };

    saveCartItem(newOrderItem);
    setIsCartOpen(true);
  };

  // 3. Add catalog preset to Cart
  const handleAddPresetToCart = (cake: CollectionCake) => {
    const mockDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    
    const whatsappQuery = `🌸 *FROSTELLA COLLECTIBLE ORDER* 🌸
Hello Frostella Studio, I would like to reserve a collectible cake from your menu!
- Collection Item: ${cake.name}
- Category Segment: ${cake.category}
- Specific descriptive tags: ${cake.tags.join(", ")}
- Scheduled Date: ${new Date(mockDate).toLocaleDateString()}
- Base Cost: ₹${cake.price.toLocaleString('en-IN')}

Please log this booking request! ✨`;

    const encodedMsg = encodeURIComponent(whatsappQuery);
    const link = `https://wa.me/15550201010?text=${encodedMsg}`;

    const newOrderItem: OrderItem = {
      id: `cart-${Date.now()}`,
      type: "preset",
      name: cake.name,
      details: cake.description,
      price: cake.price,
      presetId: cake.id,
      deliveryDate: mockDate,
      customerMessage: "Bespoke Collection Order",
      whatsappLink: link
    };

    saveCartItem(newOrderItem);
    setIsCartOpen(true);
  };

  // Load preset config directly into active custom builder state
  const [importedSpec, setImportedSpec] = useState<CakeSpecification | null>(null);

  const handleLoadPresetToBuilder = (spec: CakeSpecification) => {
    setImportedSpec(spec);
    setActiveTab("builder");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans">
      <SvgCakeFilters />
      
      {/* Dynamic Floating Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
        cartCount={cart.length}
        openCart={() => setIsCartOpen(true)}
      />

      {/* Main Orchestrated Body Viewports */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <div className="relative overflow-hidden min-h-screen" id="home-landing-viewport">
            
            {/* Extended Gorgeous Brand Identity Backdrop (Extends behind hero & bento highlights, fading out before direct orders) */}
            <div className="absolute top-0 inset-x-0 h-[155vh] md:h-[122vh] lg:h-[112vh] z-0 pointer-events-none select-none overflow-hidden border-b border-[#5A5A40]/5">
              {/* Background Cake Image - Brightened and clearly visible */}
              <div className="absolute inset-0 opacity-[0.26]">
                <img 
                  src={aestheticCakeBg} 
                  alt="Frostella Brand Identity Watermark" 
                  className="w-full h-full object-cover scale-102 filter brightness-105 contrast-95"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* People Celebrating with Cake - Brightened and clearly visible */}
              <div className="absolute inset-0 opacity-[0.22] mix-blend-multiply">
                <img 
                  src={peopleCelebratingCake} 
                  alt="Aesthetic People Celebrating Watermark" 
                  className="w-full h-full object-cover scale-102"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Seamless delicate bottom color transition exactly before the page background returns to bone peach */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FFFDF9] via-[#FFFDF9]/60 to-transparent" />
            </div>

            {/* FLOATING PASTEL ORNAMENT DECORATIONS (BOB & DRIFT BEHAVIORS) */}
            <div className="absolute top-24 left-10 w-24 h-24 rounded-full bg-[#FFD6E8]/30 blur-2xl animate-float-slow pointer-events-none" />
            <div className="absolute top-96 right-16 w-32 h-32 rounded-full bg-[#E6D6FF]/35 blur-3xl animate-float-reverse pointer-events-none" />
            <div className="absolute bottom-24 left-8 bg-[#D6F0FF]/35 w-28 h-28 rounded-full blur-2xl animate-float-slow pointer-events-none" />

            {/* Micro Sparkle shapes scattered */}
            <div className="absolute top-36 right-36 text-pink-300 animate-sparkle-slow pointer-events-none">
              <Sparkles className="w-8 h-8 fill-current" />
            </div>
            <div className="absolute bottom-72 left-24 text-purple-300 animate-bounce pointer-events-none">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>

            {/* --- HERO LANDING BANNER --- */}
            <section className="relative px-6 py-20 lg:py-28 text-center max-w-5xl mx-auto space-y-8 z-10">
              
              <div className="space-y-4">
                <span className="bg-[#FFE5D0] border border-[#5A5A40]/10 text-[#5A5A40] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest font-display inline-flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current animate-spin-slow mr-1 text-[#5A5A40]" /> Custom Boutique Cake Studio
                </span>
                
                <div className="space-y-2 block animate-fade-in">
                  <h1 className="font-serif text-7xl md:text-9xl font-black tracking-tight text-[#5A5A40] italic block drop-shadow-xs animate-pulse-subtle">
                    Frostella
                  </h1>
                  <h2 className="font-serif text-xl md:text-3xl font-medium text-[#5A5A40]/90 italic tracking-wide mt-2 block">
                    Where Every Cake Becomes a Masterpiece
                  </h2>
                </div>
                
                <p className="text-sm md:text-base text-[#5A5A40]/80 max-w-2xl mx-auto leading-relaxed font-medium">
                  Design your dream cake from scratch in our virtual luxury lab and witness instant, ultra-realistic 8K photorealistic visualizations. Loaded with premium, hand-sculpted decorations, boutique colors, and 50+ exquisite flavors.
                </p>
              </div>

              {/* Central Premium Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setActiveTab("collections");
                    setTimeout(() => {
                      document.getElementById("premium-collections-section")?.scrollIntoView({ behavior: "smooth" });
                    }, 50);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#FFF8F0] border border-[#5A5A40]/15 text-[#5A5A40] font-display font-semibold uppercase tracking-widest text-xs rounded-full transition-colors cursor-pointer"
                  id="btn-hero-explore"
                >
                  Explore Collections
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FFE5D0] hover:opacity-90 border border-[#5A5A40]/15 text-[#5A5A40] font-display font-bold uppercase tracking-widest text-xs rounded-full transition-colors cursor-pointer flex items-center justify-center space-x-2"
                  id="btn-hero-order"
                >
                  <ShoppingBag className="w-4 h-4 text-[#5A5A40]" />
                  <span>Order Now</span>
                </button>
              </div>

              {/* Interactive Boutique Features Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 border-t border-[#5A5A40]/10">
                <div className="bg-white/60 p-6 rounded-2xl border border-[#5A5A40]/10 text-center space-y-2">
                  <span className="p-3 bg-[#FFE5D0]/60 text-[#5A5A40] rounded-full inline-block">
                    <Sparkles className="w-5 h-5 text-[#5A5A40] animate-pulse" />
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#5A5A40] italic">Instant 3D Studio Preview</h4>
                  <p className="text-[11px] text-[#5A5A40]/80 leading-normal font-medium">
                    Observe shape contours, tiers stacking, icing dripping, custom colors and lettering change dynamically.
                  </p>
                </div>
                <div className="bg-white/60 p-6 rounded-2xl border border-[#5A5A40]/10 text-center space-y-2">
                  <span className="p-3 bg-[#FFE5D0]/60 text-[#5A5A40] rounded-full inline-block">
                    <Compass className="w-5 h-5 text-[#5A5A40]" />
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#5A5A40] italic">50+ Exquisite Aromas</h4>
                  <p className="text-[11px] text-[#5A5A40]/80 leading-normal font-medium">
                    From organic Madagascar Vanilla bean blends, local saffron Rabdi royale, to continuous drip Belgian chocolate.
                  </p>
                </div>
                <div className="bg-white/60 p-6 rounded-2xl border border-[#5A5A40]/10 text-center space-y-2">
                  <span className="p-3 bg-[#FFE5D0]/60 text-[#5A5A40] rounded-full inline-block">
                    <Smile className="w-5 h-5 text-[#5A5A40]" />
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#5A5A40] italic">Fine Art AI Couturier</h4>
                  <p className="text-[11px] text-[#5A5A40]/80 leading-normal font-medium">
                    Describe your celebration theme or allergy guidelines to receive personalized suggestions with instant builder mappings.
                  </p>
                </div>
              </div>

            </section>

            {/* --- FRONT-PAGE CURATED 8K MASTERPIECES SHOWCASE --- */}
            <section className="relative max-w-7xl mx-auto px-6 py-12 border-t border-[#5A5A40]/10 z-10" id="homepage-featured-cakes">
              <div className="text-center space-y-2 mb-10">
                <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold font-display bg-[#FFE5D0] border border-[#5A5A40]/10 px-4 py-1.5 rounded-full inline-block animate-bounce">
                  Direct Orders & Custom Tweaks
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-[#5A5A40] italic mt-1">
                  Curated 8K Studio Masterpieces
                </h3>
                <p className="text-xs text-[#5A5A40]/85 max-w-xl mx-auto font-medium leading-relaxed">
                  Bespoke, award-winning custom cakes prepared under high-integrity boutique standards. Click **Order Preset** to draft an instant booking, or click **Modify Spec** to load them straight into the virtual laboratory for personalized changes!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: "feat-pink-crystal",
                    name: "The Pink Crystal Shimmer",
                    desc: "An 8K ultra realistic close-up of a luxury birthday cake decorated with crystal-sugar pink shimmer, fresh macarons, and gold-dust flake drops.",
                    price: 3600.00,
                    image: crystalShimmerCake,
                    spec: {
                      occasion: "Birthday",
                      cakeType: "Designer Cake",
                      weight: "1.5kg",
                      shape: "Round",
                      layers: "Triple Layer",
                      flavor: "Vanilla bean Madagascar",
                      sweetness: "Medium Sweet",
                      toppings: ["Fresh Strawberries", "Macarons", "Chocolate Drip"],
                      colors: ["Pastel Pink", "Ivory Shimmer"],
                      customMessage: "Happy Birthday Edition"
                    }
                  },
                  {
                    id: "feat-royal-empress",
                    name: "The Golden Royal Empress",
                    desc: "A majestic multi-tiered royal ivory cake featuring hand-beaded golden lace details, peach pearls, and edible gold-gilded petals.",
                    price: 6400.00,
                    image: royalWhiteGold,
                    spec: {
                      occasion: "Wedding",
                      cakeType: "Multi-Tier Luxury Cake",
                      weight: "3kg",
                      shape: "Round",
                      layers: "Triple Layer",
                      flavor: "Exquisite Lavender Crumbs",
                      sweetness: "Low Sweet",
                      toppings: ["Gold Leaf", "Edible Flowers", "Silver Pearls"],
                      colors: ["Peach", "Ivory Shimmer"],
                      customMessage: "Adore Forever"
                    }
                  },
                  {
                    id: "feat-lavender-spire",
                    name: "Whispering Lavender Spire",
                    desc: "An elegant layered piece frosted in lilac cream, meticulously adorned with cascading silver pearls and edible baby's breath.",
                    price: 5200.00,
                    image: weddingCakeLux,
                    spec: {
                      occasion: "Luxury",
                      cakeType: "Designer Cake",
                      weight: "2kg",
                      shape: "Round",
                      layers: "Triple Layer",
                      flavor: "Exquisite Lavender Crumbs",
                      sweetness: "Medium Sweet",
                      toppings: ["Edible Flowers", "Silver Pearls"],
                      colors: ["Lavender", "Pastel Pink"],
                      customMessage: "Devotion"
                    }
                  },
                  {
                    id: "feat-peach-cascade",
                    name: "The Peach Blossom Cascade",
                    desc: "A dreamy soft peach-colored cake decorated with delicate fresh peony roses, shimmering gold leaf details, and pearl luster highlights.",
                    price: 4500.00,
                    image: floralPeachCake,
                    spec: {
                      occasion: "Anniversary",
                      cakeType: "Designer Cake",
                      weight: "1.5kg",
                      shape: "Round",
                      layers: "Double Layer",
                      flavor: "Sweet Mango Peaches Cream",
                      sweetness: "Medium Sweet",
                      toppings: ["Fresh Strawberries", "Edible Flowers"],
                      colors: ["Peach", "Pastel Pink"],
                      customMessage: "Together Forever"
                    }
                  }
                ].map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-white rounded-3xl border border-[#5A5A40]/10 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square overflow-hidden bg-[#FFF8F0]">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={getUniqueCakeStyle(item.name)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[10px] text-[#5A5A40] font-bold px-2 py-1 rounded-md border border-[#5A5A40]/10">
                          ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-2">
                        <span className="text-[8px] uppercase tracking-widest text-[#5A5A40]/60 font-bold font-display">
                          {item.spec.occasion} Design
                        </span>
                        <h4 className="font-serif font-bold text-sm text-[#5A5A40] italic group-hover:text-[#6C6C52] transition-colors leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[#5A5A40]/80 leading-normal line-clamp-3">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const mockDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                            const orderItem: OrderItem = {
                              id: `cart-${Date.now()}-${item.id}`,
                              type: "custom",
                              name: item.name,
                              details: item.desc,
                              price: item.price,
                              spec: item.spec,
                              deliveryDate: mockDate,
                              customerMessage: "Direct Homepage Selection",
                              whatsappLink: `https://wa.me/15550201010?text=${encodeURIComponent(`Hello Frostella! I'd like to reserve the Featured Masterpiece: *${item.name}*`)}`
                            };
                            saveCartItem(orderItem);
                            setIsCartOpen(true);
                          }}
                          className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg bg-[#5A5A40] hover:bg-[#6c6c52] text-white transition-colors cursor-pointer"
                        >
                          Order Preset
                        </button>

                        <button
                          onClick={() => {
                            handleLoadPresetToBuilder(item.spec);
                          }}
                          className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-lg bg-[#FFE5D0]/50 text-[#5A5A40] border border-[#5A5A40]/10 hover:bg-[#FFE5D0] transition-colors cursor-pointer"
                        >
                          Modify Spec
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Interactive Flavor & Step-by-Step Structure Showcase */}
            <FlavorStructureShowcase 
              onLoadPreset={handleLoadPresetToBuilder}
              onAddToCart={(orderItem) => {
                saveCartItem(orderItem);
                setIsCartOpen(true);
              }}
            />

            {/* Curated Personal AI Consultant panel directly on Homepage for discovery */}
            <AIPersonalConsultant onApplyRecommendation={handleLoadPresetToBuilder} />

            {/* Carriage status on homepage */}
            <OrderTracker />

            {/* High-fidelity customer feedback on homepage */}
            <CustomerReviewsSection />

          </div>
        )}

        {activeTab === "builder" && (
          <AICakeBuilder 
            onAddToWishlist={handleAddToWishlist} 
            onAddToCart={handleAddToCart} 
          />
        )}

        {activeTab === "collections" && (
          <PremiumCollections 
            onLoadPreset={handleLoadPresetToBuilder} 
            onAddToCartPreset={handleAddPresetToCart} 
          />
        )}
      </main>

      {/* --- DRAWERS AND OVERLAYS --- */}
      <WishlistPanel
        savedDesigns={wishlist}
        onRemove={handleRemoveFromWishlist}
        onConfigure={handleLoadPresetToBuilder}
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <ScheduledCartPanel
        cartItems={cart}
        onRemove={handleRemoveFromCart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* --- LUXURY FOOTER BRAND BLOCK --- */}
      <footer className="bg-white border-t border-[#5A5A40]/10 py-12 px-6 mt-12 bg-radial from-white to-[#FFF8F0]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-[#FFE5D0] rounded-full">
                <Cake className="w-5 h-5 text-[#5A5A40]" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#5A5A40] italic">Frostella</h4>
            </div>
            <p className="text-xs text-[#5A5A40]/70 max-w-sm leading-relaxed">
              Frostella is a signature luxury cake-only studio where dreams are customized, baked in low heat with premium ingredients, and delivered inside pristine wax-sealed cloches.
            </p>
            <div className="text-xs text-[#5A5A40]/60 font-semibold">
              📍 52 Pastel Avenue, Crystal District • open daily
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#5A5A40]">The Workspace</h5>
            <ul className="text-xs text-[#5A5A40]/70 space-y-2">
              <li>Open daily: 9:00 AM - 9:00 PM</li>
              <li>Deliveries scheduled 24/7</li>
              <li>Secure local encrypted studio database</li>
              <li>Bespoke WhatsApp channel active</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-serif font-bold text-sm text-[#5A5A40]">Artisan Pledges</h5>
            <p className="text-xs text-[#5A5A40]/70 leading-relaxed font-light">
              We pledge 100% cake integrity. No pastries, biscuits, snacks, or unrelated savouries are allowed in our boutique ovens. Every order is a custom masterpiece.
            </p>
            <div className="text-[10px] text-[#5A5A40] uppercase tracking-widest font-bold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mr-1.5" /> 100% Cake Only Studio
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#5A5A40]/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5A5A40]/60">
          <p>© 2026 Frostella Custom Cake Studio Ltd. Crafted in high-integrity pastel boutique standards.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0 font-semibold">
            <a href="#" className="hover:text-[#5A5A40]">Studio Terms</a>
            <a href="#" className="hover:text-[#5A5A40]">Privacy Ledger</a>
            <a href="#" className="hover:text-[#5A5A40]">Boutique Care</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
