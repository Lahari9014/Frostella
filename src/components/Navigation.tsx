import React from "react";
import { Cake, Sparkles, Heart, ShoppingBag, Search, Compass, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "./FirebaseProvider";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wishlistCount: number;
  openWishlist: () => void;
  cartCount: number;
  openCart: () => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  wishlistCount,
  openWishlist,
  cartCount,
  openCart,
}: NavigationProps) {
  const { user, loginWithGoogle, logout } = useAuth();
  const links = [
    { id: "home", label: "Studio", icon: Compass },
    { id: "builder", label: "AI Custom Builder", icon: Sparkles },
    { id: "collections", label: "Premium Collections", icon: Cake },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top micro ribbon */}
      <div className="bg-gradient-to-r from-[#FFD6E8] via-[#E6D6FF] to-[#D6F0FF] py-1.5 text-center text-xs font-semibold tracking-widest text-[#5A5A40] uppercase">
        <Sparkles className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 animate-spin-slow text-[#B28DFF]" />
        Delivering Dreamy Bespoke Artisanal Masterpieces and Sparkles
        <Sparkles className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 animate-spin-slow text-[#B28DFF]" />
      </div>

      {/* Main Bar */}
      <div className="bg-[#FFF8F0]/90 backdrop-blur-md border-b border-[#5A5A40]/10 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with motion animation */}
          <div className="flex items-center space-x-6">
            <motion.div 
              onClick={() => setActiveTab("home")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center space-x-2 cursor-pointer group"
              id="nav-logo"
            >
              <div className="relative p-2 rounded-full bg-[#FFE5D0]/60 group-hover:bg-[#E6D6FF]/40 transition-colors">
                <Cake className="w-6 h-6 text-[#5A5A40]" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFE5D0] rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold italic tracking-tight text-[#5A5A40]">
                  Frostella
                </h1>
                <p className="text-[9px] uppercase tracking-widest text-[#5A5A40]/70 -mt-1 font-semibold font-display">
                  Luxury Cake Studio
                </p>
              </div>
            </motion.div>

            {/* Auth section in logo area for prominence */}
            <div className="hidden lg:flex items-center pl-4 border-l border-[#5A5A40]/10 h-8">
              {user ? (
                <div className="flex items-center space-x-3 group">
                  <div className="relative">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full border border-[#5A5A40]/20" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#FFE5D0] flex items-center justify-center text-[#5A5A40]">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white" />
                  </div>
                  <button 
                    onClick={logout}
                    className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]/60 hover:text-[#5A5A40] transition-colors flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={loginWithGoogle}
                  className="flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]/70 hover:text-[#5A5A40] transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Couturier Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links with animated dynamic slide background */}
          <nav className="hidden md:flex items-center space-x-1" id="nav-menu">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <motion.button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all z-10 cursor-pointer ${
                    isActive 
                      ? "text-[#5A5A40] font-extrabold" 
                      : "text-[#5A5A40]/70 hover:text-[#5A5A40]"
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-[#FFE5D0] border border-[#5A5A40]/10 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#5A5A40]" : "text-[#5A5A40]/60"}`} />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span 
                      layoutId="activeTabDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFD6E8]" 
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Actions Menu */}
          <div className="flex items-center space-x-3" id="nav-actions">
            
            {/* Wishlist Button with custom bounce */}
            <motion.button
              onClick={openWishlist}
              whileHover={{ scale: 1.1, rotate: 3 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#FFE5D0]/40 border border-[#5A5A40]/10 text-[#5A5A40]/80 hover:text-[#FF6F91] transition-all duration-300 cursor-pointer"
              title="View saved dream designs"
              id="btn-wishlist-nav"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD6E8] text-[10px] font-bold text-[#5A5A40] shadow-xs border border-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Shopping Bag Button with custom bounce */}
            <motion.button
              onClick={openCart}
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 rounded-full bg-white hover:bg-[#D6F0FF]/40 border border-[#5A5A40]/10 text-[#5A5A40]/80 hover:text-[#5A5A40] transition-all duration-300 cursor-pointer"
              title="Cart / Custom Reservations"
              id="btn-cart-nav"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D6F0FF] text-[10px] font-bold text-[#5A5A40] shadow-xs border border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* CTA order shortcut with custom sliding hover glitter */}
            <motion.button
              onClick={() => setActiveTab("builder")}
              whileHover={{ scale: 1.05, shadow: "0 10px 25px -5px rgba(90, 90, 64, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-[#5A5A40] text-white hover:bg-[#6C6C52] text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
              id="cta-nav-design"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="uppercase tracking-wider font-display">Design a Cake</span>
            </motion.button>
          </div>

        </div>
      </div>
    </header>
  );
}
