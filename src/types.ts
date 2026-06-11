export interface CakeSpecification {
  occasion: string;
  cakeType: string;
  weight: string;
  shape: string;
  layers: string;
  flavor: string;
  sweetness: string;
  toppings: string[];
  colors: string[];
  customMessage: string;
}

export interface ChefNarrative {
  masterpieceTitle: string;
  chefsNarrative: string;
  tastingNotes: string;
  luxuryPairing: string;
  nutrition: {
    servingSize: string;
    calories: number;
    sugarGrams: number;
    proteinGrams: number;
    totalFatGrams: number;
  };
}

export interface CakeRecommendation {
  title: string;
  description: string;
  layersConfig: string;
  flavors: string;
  toppings: string[];
  consultantNotes: string;
}

export interface CollectionCake {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  rating: number;
}

export interface SavedDesign {
  id: string;
  name: string;
  specification: CakeSpecification;
  chefNarrative?: ChefNarrative;
  customImageUrl?: string;
  priceEstimate: number;
  savedAt: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  reviewText: string;
  verified: boolean;
  avatar: string;
  cakeType: string;
  date: string;
}

export interface OrderItem {
  id: string;
  type: "custom" | "preset";
  name: string;
  details: string;
  price: number;
  spec?: CakeSpecification;
  presetId?: string;
  deliveryDate: string;
  customerMessage: string;
  whatsappLink: string;
}

// Full 50+ Premium Luxury Cake Flavors List
export const FLAVORS_LIST = [
  // Chocolates & Decadence
  "Belgian Chocolate", "Dark Chocolate", "White Chocolate", "Ferrero Rocher", 
  "Oreo", "KitKat", "Nutella", "Lotus Biscoff", "Tiramisu", "Hazelnut Chocolate",
  "Chocolate Fudge", "Salted Caramel Crisp", "Chocolate Truffle", "German Chocolate",
  
  // Berries & Fruits
  "Strawberry Shimmer", "Blueberry Velvet", "Raspberry Bliss", "Sweet Mango Nectar",
  "Pineapple Tropical Breeze", "Mixed Fruit Orchard", "Coconut Paradise", "Key Lime Sunshine",
  "Lemon Mist", "Passion Fruit Fusion", "Black Cherry Rose", "Spiced Apple Spire",

  // Classics & Elegance
  "Vanilla Bean Madagascar", "Red Velvet Glamour", "Butterscotch Swirl", 
  "Classic Black Forest", "Ethereal White Forest", "Coffee Espresso Macchiato",
  "Rich Creme Caramel", "Lush Hazelnut Praline", "Pistachio Rose Blossom", "Almond Marzipan Royale",
  "Lavender Infused Velvet", "Chai Spice Infusion", "Earle Grey Tea Cake", "Matcha Green Tea Royale",

  // Festive & Exquisite Local Infusions
  "Rose Milk Elixir", "Rabdi Saffron Royale", "Gulab Jamun Gold Dust", "Kulfi Cardamom Shimmer",
  "Saffron Pistachio Delight", "Rasmalai Heaven", "Coconut Rose Ladoo Cake",
  
  // Custom Novelty
  "Custom Flavor Creation"
];

// Luxury toppings
export const TOPPINGS_LIST = [
  "Fresh Strawberries", "Blueberries", "Raspberries", "Chocolate Drip", "Gold Leaf", 
  "Silver Pearls", "Ferrero Rocher", "Macarons", "Oreos", "KitKat", "Edible Flowers", 
  "Almonds", "Pistachios", "Caramel Drizzle", "Custom Toppings"
];

// Occasions
export const OCCASIONS_LIST = [
  "Birthday", "Wedding", "Anniversary", "Engagement", "Baby Shower", 
  "Graduation", "Corporate Event", "Festival", "Valentine's Day", 
  "Mother's Day", "Custom Occasion"
];

// Cake Types
export const CAKE_TYPES_LIST = [
  "Fresh Cream Cake", "Ice Cream Cake", "Fondant Cake", "Buttercream Cake", 
  "Photo Cake", "Designer Cake", "Floral Cake", "Wedding Cake", "Bento Cake", 
  "Theme Cake"
];

// Weight list
export const WEIGHTS_LIST = [
  "300g", "500g", "750g", "1kg", "1.5kg", "2kg", "3kg", "5kg", "Custom Weight"
];

// Custom Shapes
export const SHAPES_LIST = [
  "Round", "Square", "Heart", "Hexagon", "Oval", "Tiered Cake", "Custom Shape"
];

// Layers
export const LAYERS_LIST = [
  "Single Layer", "Double Layer", "Triple Layer", "Four Layer", "Five Layer", "Multi-Tier Luxury Cake"
];

// Pastel Frosting Colors
export const PASTEL_COLORS = [
  { name: "Pastel Pink", hash: "#FFD6E8", tailwind: "bg-[#FFD6E8]" },
  { name: "Lavender", hash: "#E6D6FF", tailwind: "bg-[#E6D6FF]" },
  { name: "Baby Blue", hash: "#D6F0FF", tailwind: "bg-[#D6F0FF]" },
  { name: "Mint Green", hash: "#D9FFE8", tailwind: "bg-[#D9FFE8]" },
  { name: "Peach", hash: "#FFE5D0", tailwind: "bg-[#FFE5D0]" },
  { name: "Ivory Shimmer", hash: "#FFF8F0", tailwind: "bg-[#FFF8F0]" }
];
