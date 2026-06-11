import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Heart, ShoppingBag, Eye, HelpCircle, Check, ArrowRight, Star, Layers } from "lucide-react";
import { CakeSpecification, OrderItem } from "../types";
import { getUniqueCakeStyle } from "../lib/imageFilters";

// Import pre-generated assets for rich visuals
import butterscotchSingleStep from "../assets/images/butterscotch_single_step_1781170079949.png";
import chocolateMultiStep from "../assets/images/chocolate_multi_step_1781170096977.png";
import weddingCakeLux from "../assets/images/wedding_cake_lux_1781166503230.png";
import floralPeachCake from "../assets/images/floral_peach_cake_1781166529233.png";
import kidsCarouselCake from "../assets/images/kids_carousel_cake_1781166549518.png";
import minimalistMintCake from "../assets/images/minimalist_mint_cake_1781166614887.png";
import birthdayPinkCake from "../assets/images/birthday_pink_cake_1781166636023.png";
import crystalShimmerCake from "../assets/images/crystal_shimmer_cake_1781168953961.png";
import royalWhiteGold from "../assets/images/royal_white_gold_1781168971447.png";
import festivalCake from "../assets/images/festival_cake_1781170852841.png";
import mothersdayCake from "../assets/images/mothersday_cake_1781170889334.png";
import engagementCake from "../assets/images/engagement_cake_1781170813424.png";
import graduationCake from "../assets/images/graduation_cake_1781170831437.png";
import valentinedayCake from "../assets/images/valentineday_cake_1781170869989.png";

interface FlavorStructureShowcaseProps {
  onLoadPreset: (spec: CakeSpecification) => void;
  onAddToCart: (item: OrderItem) => void;
}

export default function FlavorStructureShowcase({ onLoadPreset, onAddToCart }: FlavorStructureShowcaseProps) {
  // Toggle between structure modes
  const [structureType, setStructureType] = useState<"single" | "multi">("single");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Chocolates", "Fruits & Berries", "Classics", "Indian Delights"];

  // Trimmed down distinct non-repeating premium flavor profiles featuring gourmet cupcakes for single-step and structural masterpieces for multi-step
  const FLAVORS_DATA = [
    {
      category: "Chocolates",
      nameSingle: "Belgian Chocolate Cupcake Assortment",
      descSingle: "Warm box of 6 premium cupcakes featuring deep Belgian cocoa frosting and golden caramelized crunch on a sponge cake.",
      nameMulti: "Royal Belgian Chocolate Majestic Tower",
      descMulti: "A towering multi-tiered masterwork of layered premium Belgian cocoa ganache with golden caramelized crunch shards.",
      basePriceSingle: 1350,
      basePriceMulti: 4690,
      imageSingle: valentinedayCake,
      imageMulti: chocolateMultiStep
    },
    {
      category: "Fruits & Berries",
      nameSingle: "Rose Queen Strawberry Cupcakes",
      descSingle: "An aromatic box of 6 strawberry-infused cupcakes topped with Mahabaleshwar strawberries and soft rose syrup ribbon.",
      nameMulti: "Rose Queen Strawberry Majestic Spire",
      descMulti: "A majestic multi-tiered celebration of fresh organic Mahabaleshwar strawberries with real rose milk folds and cascading crystal shimmers.",
      basePriceSingle: 1250,
      basePriceMulti: 4250,
      imageSingle: birthdayPinkCake,
      imageMulti: crystalShimmerCake
    },
    {
      category: "Indian Delights",
      nameSingle: "Alphonso Mango Saffron Cupcakes",
      descSingle: "Luxurious half-dozen pack of golden cupcakes infused with Alphonso mango nectar, cardamom, and saffron buttercream.",
      nameMulti: "Alphonso Mango Saffron Royal Cascade",
      descMulti: "A spectacular multi-tiered structure infused with dynamic saffron strands, fresh Alphonso mango cream folds, and marigold petals.",
      basePriceSingle: 1400,
      basePriceMulti: 4490,
      imageSingle: festivalCake,
      imageMulti: floralPeachCake
    },
    {
      category: "Classics",
      nameSingle: "Royal Butterscotch Praline Cupcakes",
      descSingle: "Rich butter-caramel sponge cupcakes topped with butterscotch crunch crumbles and warm caramel glaze pipings.",
      nameMulti: "Royal Butterscotch Grand Castle",
      descMulti: "A soaring multi-step tower featuring golden caramelized praline butterscotch crunch layers and royal white-gold sugar carvings.",
      basePriceSingle: 1150,
      basePriceMulti: 3890,
      imageSingle: butterscotchSingleStep,
      imageMulti: engagementCake
    },
    {
      category: "Classics",
      nameSingle: "Korean Minimalist Mint Cupcakes",
      descSingle: "Half-dozen pack of aesthetic pastel green mint frosting cupcakes with delicate ivory shell border ruffles.",
      nameMulti: "Korean Minimalist Mint Spire",
      descMulti: "A magnificent multi-tiered pastel mint masterpiece showcasing layered ruffles and smooth ivory sugar sculpting.",
      basePriceSingle: 1100,
      basePriceMulti: 3690,
      imageSingle: minimalistMintCake,
      imageMulti: weddingCakeLux
    },
    {
      category: "Classics",
      nameSingle: "Pristine Vanilla Velvet Cupcakes",
      descSingle: "Elegant cupcakes crafted from pure Madagascar vanilla bean and decorated with continuous white cocoa curls.",
      nameMulti: "Pristine Vanilla Velvet Palace",
      descMulti: "A breathtaking multi-step design crafted with pure Madagascar vanilla whip and continuous white cocoa curls.",
      basePriceSingle: 1050,
      basePriceMulti: 3490,
      imageSingle: mothersdayCake,
      imageMulti: royalWhiteGold
    },
    {
      category: "Classics",
      nameSingle: "Ethereal Lavender Field Cupcakes",
      descSingle: "Soothing lavender-infused cupcake roses dressed in a lilac sugar glaze and fresh edible baby's breath blossoms.",
      nameMulti: "Ethereal Lavender Field Spire",
      descMulti: "An enchanting towering multi-step work wrapped with soothing lavender cream layers and fresh baby's breath blossoms.",
      basePriceSingle: 1300,
      basePriceMulti: 4490,
      imageSingle: mothersdayCake,
      imageMulti: weddingCakeLux
    },
    {
      category: "Chocolates",
      nameSingle: "Rich Hazelnut Praline Cupcakes",
      descSingle: "Delicious chocolate hazelnut cupcakes finished with velvety mocha whipped frosting and gold luster dusting.",
      nameMulti: "Rich Hazelnut Praline Monument",
      descMulti: "A majestic double tiered chocolate masterpiece layered with hazelnut mocha cream, roasted praline curls, and gold leaf ribbons.",
      basePriceSingle: 1480,
      basePriceMulti: 4890,
      imageSingle: graduationCake,
      imageMulti: kidsCarouselCake
    }
  ];

  // Filter logic
  const filtered = FLAVORS_DATA.filter(f => {
    const matchesCategory = activeCategory === "All" || f.category === activeCategory;
    const currentName = structureType === "single" ? f.nameSingle : f.nameMulti;
    const matchesSearch = currentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrderDirect = (flavorObj: any) => {
    const price = structureType === "single" ? flavorObj.basePriceSingle : flavorObj.basePriceMulti;
    const imageToUse = structureType === "single" ? flavorObj.imageSingle : flavorObj.imageMulti;
    const currentName = structureType === "single" ? flavorObj.nameSingle : flavorObj.nameMulti;
    const currentDesc = structureType === "single" ? flavorObj.descSingle : flavorObj.descMulti;
    const structureName = structureType === "single" ? "Bespoke Cupcakes Box of 6" : "Multi-Step Masterpiece";
    const weightVal = structureType === "single" ? "6-Piece Box" : "2kg";
    const layersVal = structureType === "single" ? "Cupcakes" : "Triple Layer";

    const mockDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const spec: CakeSpecification = {
      occasion: "Celebration",
      cakeType: "Designer Cake",
      weight: weightVal,
      shape: "Round",
      layers: layersVal,
      flavor: currentName,
      sweetness: "Medium Sweet",
      toppings: ["Silver Pearls", "Edible Flowers"],
      colors: ["Ivory Shimmer", "Pastel Pink"],
      customMessage: "Direct Selection"
    };

    const orderItem: OrderItem = {
      id: `cart-${Date.now()}-${currentName.replace(/\s+/g, "-")}`,
      type: "custom",
      name: `${currentName}`,
      details: `${currentDesc} Structuring: ${structureName}. Estimated setup size: ${weightVal}.`,
      price: price,
      spec: spec,
      deliveryDate: mockDate,
      customerMessage: `Direct Flavor Selection: ${currentName}`,
      whatsappLink: `https://wa.me/15550201010?text=${encodeURIComponent(`Hello Frostella! I'd like to book a *${currentName}* (${structureName}). Base quote: ₹${price}`)}`
    };

    onAddToCart(orderItem);
  };

  const handleCustomiseDirect = (flavorObj: any) => {
    const weightVal = structureType === "single" ? "500g" : "2kg";
    const layersVal = structureType === "single" ? "Single Layer" : "Triple Layer";
    const currentName = structureType === "single" ? flavorObj.nameSingle : flavorObj.nameMulti;

    const spec: CakeSpecification = {
      occasion: "Celebration",
      cakeType: "Designer Cake",
      weight: weightVal,
      shape: "Round",
      layers: layersVal,
      flavor: currentName,
      sweetness: "Medium Sweet",
      toppings: ["Silver Pearls", "Edible Flowers"],
      colors: ["Ivory Shimmer", "Pastel Pink"],
      customMessage: "Custom Draft"
    };

    onLoadPreset(spec);
    document.getElementById("ai-cake-builder-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-[#F4F4F6] border-b border-[#5A5A40]/10" id="homepage-flavor-structure-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content with animations */}
        <div className="text-center space-y-3 mb-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#5A5A40] uppercase tracking-widest text-[10px] font-bold font-display bg-[#FFE5D0] px-4 py-1.5 rounded-full inline-block border border-[#5A5A40]/10"
          >
            The Pastry Lab Spec Menu
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl md:text-5xl font-extrabold text-[#5A5A40] italic"
          >
            8 Royal Flavors & Structural Finishes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[#5A5A40]/75 max-w-2xl mx-auto leading-relaxed font-semibold"
          >
            Toggle between our **Elegant Single-Step (Single Tier)** cakes or towering **Multi-Step (Multi-Tier)** masterpieces. Choose from our 8 handcrafted non-repeating flavor profiles at incredibly reasonable rates. Click any card to order instantly or customize inside our virtual luxury laboratory!
          </motion.p>
        </div>

        {/* Structure Selector Pill Controls (with bouncy spring clicks) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#5A5A40]/10 mb-8">
          
          {/* Action Tabs for Structure selection */}
          <div className="flex items-center bg-[#FFE5D0]/30 border border-[#5A5A40]/10 p-1.5 rounded-2xl w-full md:w-auto">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStructureType("single")}
              className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                structureType === "single"
                  ? "bg-[#5A5A40] text-white shadow-md font-extrabold"
                  : "text-[#5A5A40] hover:bg-[#FFE5D0]/50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Single-Step (Single Tier)</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStructureType("multi")}
              className={`flex-1 md:flex-initial flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                structureType === "multi"
                  ? "bg-[#5A5A40] text-white shadow-md font-extrabold"
                  : "text-[#5A5A40] hover:bg-[#FFE5D0]/50"
              }`}
            >
              <Layers className="w-4 h-4 text-purple-300 animate-pulse" />
              <span>Multi-Step (Multi-Tier)</span>
            </motion.button>
          </div>

          {/* Quick Category Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search inputs */}
            <input 
              type="text" 
              placeholder="Search 8 premium flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 text-xs rounded-xl border border-[#5A5A40]/15 outline-none focus:border-[#5A5A40] bg-white text-[#5A5A40] font-medium placeholder-[#5A5A40]/40"
            />
            
            {/* Horizontal list */}
            <div className="flex flex-wrap items-center gap-1.5 justify-center">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    activeCategory === c
                      ? "bg-[#FFE5D0] text-[#5A5A40] border-[#5A5A40]/25"
                      : "bg-white text-[#5A5A40]/70 border-gray-100 hover:bg-[#FFF8F0]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Dynamic Structural Info Notice */}
        <div className="bg-[#FFE5D0]/20 border border-[#5A5A40]/10 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-[#5A5A40]">
            <div className="p-2 bg-[#5A5A40] text-white rounded-xl">
              {structureType === "single" ? <Sparkles className="w-4 h-4 text-amber-300" /> : <Layers className="w-4 h-4 text-purple-300" />}
            </div>
            <div>
              <p className="text-xs font-bold">
                {structureType === "single" 
                  ? "Single-Step Option (Ideal for bento parties, family tables, and small meetups)" 
                  : "Multi-Step Towering Option (Featuring layered supports, tiered design, and visual prestige)"}
              </p>
              <p className="text-[10px] text-[#5A5A40]/70">
                {structureType === "single" 
                  ? "Pricing includes luxurious cupcake box of 6, custom frostings, gourmet flavor extracts, and custom card carrier packaging." 
                  : "Pricing includes dowel stack systems, dual-flavors setup, intricate handcraft drip-work, and visual setup guide."}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#5A5A45] bg-[#FFE5D0] px-3 py-1 rounded-lg border border-[#5A5A40]/10">
            {structureType === "single" ? "Starts from ₹1,200" : "Starts from ₹3,490"}
          </span>
        </div>

        {/* Flavor Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs font-semibold">
            No matching flavor profile was found. Try searching for "Chocolate", "Mango", or "Rose".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item, index) => {
              const currentPrice = structureType === "single" ? item.basePriceSingle : item.basePriceMulti;
              const currentImage = structureType === "single" ? item.imageSingle : item.imageMulti;
              const currentName = structureType === "single" ? item.nameSingle : item.nameMulti;
              const currentDesc = structureType === "single" ? item.descSingle : item.descMulti;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(0.2, (index % 4) * 0.05) }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="group bg-white rounded-3xl border border-[#5A5A40]/10 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {/* Visual Card Image (with tap/click zoom animations) */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAFAFB] border-b border-gray-100">
                      <motion.img
                        src={currentImage}
                        alt={currentName}
                        style={getUniqueCakeStyle(currentName)}
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full h-full object-cover cursor-zoom-in"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[10px] text-[#5A5A40] font-black px-2.5 py-1 rounded-lg border border-[#5A5A40]/10 shadow-xs">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </div>
                      <span className="absolute bottom-2 left-2 bg-[#5A5A40] text-white text-[8px] tracking-widest font-bold uppercase px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-extrabold text-sm text-[#5A5A40] italic">
                          {currentName}
                        </h4>
                        <div className="flex items-center space-x-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] font-bold text-[#5A5A40]">4.9</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#5A5A40]/80 leading-normal line-clamp-2">
                        {currentDesc}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Customize or Order) */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => handleOrderDirect(item)}
                        className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-xl bg-[#5A5A40] hover:bg-[#6c6c52] text-white transition-colors cursor-pointer"
                      >
                        Order Preset
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={() => handleCustomiseDirect(item)}
                        title="Load this spec directly into the 3D lab customization system"
                        className="flex-1 py-2 text-center text-[10px] font-bold uppercase tracking-wider rounded-xl bg-[#FFE5D0]/50 text-[#5A5A40] border border-[#5A5A40]/10 hover:bg-[#FFE5D0] transition-colors cursor-pointer"
                      >
                        Modify Spec
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
