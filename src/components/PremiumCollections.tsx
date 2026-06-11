import React, { useState } from "react";
import { Star, Sparkles, Sliders, Check, Heart, ShoppingBag } from "lucide-react";
import { CollectionCake, CakeSpecification } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { getUniqueCakeStyle } from "../lib/imageFilters";

// Import your pre-generated high-fidelity local assets (Guaranteed to be unique visual models)
import weddingCakeLux from "../assets/images/wedding_cake_lux_1781166503230.png";
import floralPeachCake from "../assets/images/floral_peach_cake_1781166529233.png";
import kidsCarouselCake from "../assets/images/kids_carousel_cake_1781166549518.png";
import minimalistMintCake from "../assets/images/minimalist_mint_cake_1781166614887.png";
import birthdayPinkCake from "../assets/images/birthday_pink_cake_1781166636023.png";
import chocolateMultiStep from "../assets/images/chocolate_multi_step_1781170096977.png";

// New high-fidelity image assets generated custom for each individual occasion
import engagementCake from "../assets/images/engagement_cake_1781170813424.png";
import graduationCake from "../assets/images/graduation_cake_1781170831437.png";
import festivalCake from "../assets/images/festival_cake_1781170852841.png";
import valentinedayCake from "../assets/images/valentineday_cake_1781170869989.png";
import mothersdayCake from "../assets/images/mothersday_cake_1781170889334.png";

interface PremiumCollectionsProps {
  onLoadPreset: (presetSpec: CakeSpecification) => void;
  onAddToCartPreset: (cake: CollectionCake) => void;
}

export default function PremiumCollections({ onLoadPreset, onAddToCartPreset }: PremiumCollectionsProps) {
  // Define 11 exact occasions as specified by the user
  const occasions = [
    "All",
    "Birthday",
    "Wedding",
    "Anniversary",
    "Engagement",
    "Baby Shower",
    "Graduation",
    "Corporate Event",
    "Festival",
    "Valentine's Day",
    "Mother's Day",
    "Custom Occasion"
  ];

  const [activeOccasion, setActiveOccasion] = useState<string>("All");

  // Premium Cake Database matching the 11 key celebrations with completely unique imagery (zero duplicate designs)
  const PRESET_CAKES: CollectionCake[] = [
    {
      id: "preset-birthday",
      name: "The Rose Queen Glaze",
      category: "Birthday",
      description: "Deluxe pastel pink frosting crowned with fresh luscious strawberries, organic raspberries, and refined vanilla cream piping. A magnificent birthday crown.",
      price: 3400.00,
      image: birthdayPinkCake,
      tags: ["Strawberry Shimmer", "Vanilla Bean Madagascar", "Best Seller"],
      rating: 4.9
    },
    {
      id: "preset-wedding",
      name: "Whispering Lavender Spire",
      category: "Wedding",
      description: "An elegant layered masterpiece in pastel lavender and soft cream, meticulously hand-decorated with cascading silver pearls and edible baby's breath blossoms.",
      price: 8900.00,
      image: weddingCakeLux,
      tags: ["Lavender Infused Velvet", "Ethereal White Forest", "Wedding Royale"],
      rating: 5.0
    },
    {
      id: "preset-anniversary",
      name: "The Peach Blossom Cascade",
      category: "Anniversary",
      description: "A dreamy soft peach-colored cake layered with rich custard and decorated with delicate fresh peony roses, gold leaf flakes, and a pearl luster glaze.",
      price: 4500.00,
      image: floralPeachCake,
      tags: ["Sweet Mango Nectar", "Rose Milk Elixir", "Premium Floral"],
      rating: 5.0
    },
    {
      id: "preset-engagement",
      name: "Champagne Peony Sovereign",
      category: "Engagement",
      description: "A majestic double tiered champagne-gold treasure draped in sugar peony blossoms, ivory buttercream ruffles, and edible heritage gold dust ribbons.",
      price: 7200.00,
      image: engagementCake,
      tags: ["Chai Spice Infusion", "Vanilla Bean", "Lace Embroidery"],
      rating: 4.9
    },
    {
      id: "preset-babyshower",
      name: "Celestial Enchanted Carousel",
      category: "Baby Shower",
      description: "A whimsical baby blue and ivory children's carousel cake, decorated with custom hand-carved stars and golden crown structures. Truly a fairytale.",
      price: 5200.00,
      image: kidsCarouselCake,
      tags: ["White Chocolate", "Vanilla Bean Madagascar", "Whimsical"],
      rating: 4.8
    },
    {
      id: "preset-graduation",
      name: "The Scholar's Capstone",
      category: "Graduation",
      description: "A sleek, crisp single-tier navy blue and gold finish celebrating achievement. Rendered with an edible black graduation cap and a golden tassled scroll.",
      price: 3200.00,
      image: graduationCake,
      tags: ["Rich Creme Caramel", "Belgian Chocolate", "Golden Tassels"],
      rating: 4.9
    },
    {
      id: "preset-corporate",
      name: "Opulent Golden Praline",
      category: "Corporate Event",
      description: "A multi-layered rich hazelnut mousse cake covered in continuous streaks of luxury gold leaf, shimmering sugar crystals, and premium gold-dusted chocolate macarons.",
      price: 7900.00,
      image: chocolateMultiStep,
      tags: ["Lush Hazelnut Praline", "Belgian Chocolate", "Gold Leaf"],
      rating: 4.9
    },
    {
      id: "preset-festival",
      name: "Royal Kesar Marigold",
      category: "Festival",
      description: "A traditional luxury celebration cake infused with aromatic Kesar (saffron) cream, loaded with cardamoms, and decorated with actual golden marigold blossoms.",
      price: 5400.00,
      image: festivalCake,
      tags: ["Rabdi Saffron Royale", "Kulfi Cardamom", "Pistachio Crumb"],
      rating: 4.8
    },
    {
      id: "preset-valentines",
      name: "Deep Crimson Valentine Heart",
      category: "Valentine's Day",
      description: "A passionate heart-shaped luxurious red velvet cake layered with cream cheese folds, dark Belgian chocolate curls, and a fresh romantic rose bloom.",
      price: 2800.00,
      image: valentinedayCake,
      tags: ["Red Velvet Glamour", "Belgian Chocolate", "Romantic Accent"],
      rating: 5.0
    },
    {
      id: "preset-mothersday",
      name: "Chamomile Lavender Basket",
      category: "Mother's Day",
      description: "A rustic yet delicate basket-weave visual piece, fragranced with lavender glaze. Topped with wild chamomile flowers and a handcrafted edible card.",
      price: 2500.00,
      image: mothersdayCake,
      tags: ["Lavender Infused Velvet", "Lemon Mist", "For Mom"],
      rating: 4.9
    },
    {
      id: "preset-custom",
      name: "Korean Mint Solitary",
      category: "Custom Occasion",
      description: "An elegant, aesthetic Korean-style minimalist cake blanketed in airy mint green frosting and pristine ivory cream shell border piping. Pristine and simple.",
      price: 2200.00,
      image: minimalistMintCake,
      tags: ["Matcha Green Tea Royale", "Lemon Mist", "Minimalist"],
      rating: 4.7
    }
  ];

  // Filter preset cakes based on selection
  const filteredCakes = activeOccasion === "All"
    ? PRESET_CAKES
    : PRESET_CAKES.filter(cake => cake.category === activeOccasion);

  // Load a preset directly into custom state specs
  const handleLoadPreset = (cake: CollectionCake) => {
    // Map preset tags or properties to CakeSpecification fields
    const spec: CakeSpecification = {
      occasion: cake.category,
      cakeType: cake.category === "Custom Occasion" ? "Bento Cake" : "Designer Cake",
      weight: cake.category === "Wedding" || cake.category === "Corporate Event" ? "2kg" : "1kg",
      shape: cake.category === "Valentine's Day" ? "Heart" : "Round",
      layers: cake.category === "Wedding" || cake.category === "Engagement" ? "Triple Layer" : "Single Layer",
      flavor: cake.tags[0],
      sweetness: "Medium Sweet",
      toppings: cake.tags.includes("Gold Leaf") ? ["Gold Leaf", "Edible Flowers"] : ["Fresh Strawberries", "Silver Pearls"],
      colors: cake.category === "Wedding" ? ["Lavender", "Ivory Shimmer"] : ["Pastel Pink", "Peach"],
      customMessage: `For ${cake.category} Celebration`
    };
    onLoadPreset(spec);
    
    // Smooth scroll back up to active custom builder
    document.getElementById("ai-cake-builder-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-[#FFF8F0]/30 border-t border-b border-[#5A5A40]/10" id="premium-collections-section">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Gallery Headers with scroll entrances */}
        <div className="text-center space-y-3 mb-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#5A5A40] uppercase tracking-widest text-[10px] font-bold font-display bg-[#FFE5D0] px-4 py-1 rounded-full inline-block border border-[#5A5A40]/10"
          >
            The Curated Pavilion
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-extrabold text-[#5A5A40] italic"
          >
            Distinct Signature Occasions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xs text-[#5A5A40]/70 max-w-xl mx-auto leading-relaxed font-semibold"
          >
            We have handcrafted 11 unique masterpiece models – exactly one for each celebration motif. Choose your specific theme with zero duplicate configurations!
          </motion.p>
        </div>

        {/* 11 Occasions Filter Bar with horizontal scroll/scrollbars and bounce triggers */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto pb-6 mb-10 scrollbar-thin gap-1.5 px-2">
          {occasions.map((occ) => (
            <motion.button
              key={occ}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveOccasion(occ)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider transition-all whitespace-nowrap uppercase cursor-pointer border ${
                activeOccasion === occ
                  ? "bg-[#5A5A40] text-white shadow-md border-[#5A5A40] font-extrabold"
                  : "bg-white text-[#5A5A40] border-[#5A5A40]/15 hover:bg-[#FFFDF9]"
              }`}
              id={`cat-tab-${occ.replace(" ", "-")}`}
            >
              {occ}
            </motion.button>
          ))}
        </div>

        {/* Presets Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="preset-gallery-grid">
          <AnimatePresence mode="popLayout">
            {filteredCakes.map((cake, index) => (
              <motion.div 
                layout
                key={cake.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group bg-white rounded-3xl border border-[#5A5A40]/10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                id={`cake-card-${cake.id}`}
              >
                {/* Card Image Area with tags overlay */}
                <div className="relative aspect-square overflow-hidden bg-[#FFF8F0] border-b border-gray-100">
                  <motion.img 
                    src={cake.image} 
                    alt={cake.name} 
                    style={getUniqueCakeStyle(cake.name)}
                    whileHover={{ scale: 1.07 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="w-full h-full object-cover cursor-zoom-in"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Visual Overlay Sparkle gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5A5A40]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Price Label Overlay */}
                  <span className="absolute top-4 right-4 bg-white/95 border border-[#5A5A40]/15 text-[#5A5A40] font-bold text-xs px-3 py-1.5 rounded-full shadow-xs backdrop-blur-xs">
                    ₹{cake.price.toLocaleString('en-IN')}
                  </span>

                  {/* Main Filter Category small badge */}
                  <span className="absolute bottom-4 left-4 bg-[#FFE5D0] text-[#5A5A40] border border-[#5A5A40]/10 text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow-xs">
                    {cake.category}
                  </span>
                </div>

                {/* Card Meta Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  
                  {/* Name, rating and tag line */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-extrabold text-sm text-[#5A5A40] group-hover:text-[#5A5A40]/80 transition-colors leading-tight italic">
                        {cake.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-[#5A5A40]">{cake.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {/* Detailed flavor markers */}
                    <div className="flex flex-wrap gap-1">
                      {cake.tags.map((tg, i) => (
                        <span key={i} className="text-[8px] text-[#5A5A40] bg-[#FFE5D0]/40 px-2.5 py-0.5 rounded-full font-bold">
                          {tg}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-[#5A5A40]/85 leading-relaxed font-semibold">
                      {cake.description}
                    </p>
                  </div>

                  {/* Presets Action CTA (Configure or Buy) */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#5A5A40]/10">
                    
                    {/* Acquire base specs and open customizer */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => handleLoadPreset(cake)}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-full border border-[#5A5A40]/15 hover:bg-[#FFE5D0]/30 text-[#5A5A40] font-display text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      title="Load these specs as baseline in the custom builder"
                      id={`btn-configure-preset-${cake.id}`}
                    >
                      <Sliders className="w-3 h-3 text-[#5A5A40]/60" />
                      <span>Configure</span>
                    </motion.button>

                    {/* Add direct reservation to Cart */}
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={() => onAddToCartPreset(cake)}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-full bg-[#5A5A40] hover:bg-[#6c6c52] text-white font-display text-[10px] font-bold uppercase tracking-wider shadow-2xs transition-all cursor-pointer"
                      id={`btn-order-preset-${cake.id}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#FFE5D0]" />
                      <span>Order</span>
                    </motion.button>

                  </div>

                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
