import React, { useState, useMemo, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Utensils, 
  ChefHat, 
  Coffee, 
  Layers, 
  Flame, 
  Leaf, 
  Sun, 
  Sparkles, 
  IceCream, 
  GlassWater, 
  Droplets, 
  Droplet, 
  Cake, 
  Crown, 
  Search, 
  Globe, 
  Plus, 
  Minus, 
  Heart, 
  ShoppingBag,
  Check,
  ChevronDown,
  BookOpen
} from "lucide-react";
import { MenuItem, MenuCategory, BackgroundConfig } from "../types";
import { POETIC_STORY } from "../data/menu";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { optimizeImageUrl } from "../lib/cloudinary";

const ARROW_PATHS = [
  "M 10 30 C 40 10, 80 50, 110 30",
  "M 10 25 Q 60 55, 110 15",
  "M 10 10 Q 50 -15, 110 30",
  "M 10 40 C 40 15, 70 65, 110 35"
];

function CurvedArrow({ index, isReversed, lang }: { index: number; isReversed: boolean; lang: "en" | "ar" }) {
  const path = ARROW_PATHS[index % ARROW_PATHS.length];
  
  // Base direction class for mobile
  const mobileFlip = lang === "ar" ? "scale-x-[-1]" : "scale-x-[1]";
  
  // Direction class for desktop (sm and up)
  const desktopFlip = lang === "en"
    ? (isReversed ? "sm:scale-x-[-1]" : "sm:scale-x-[1]")
    : (isReversed ? "sm:scale-x-[1]" : "sm:scale-x-[-1]");

  return (
    <div className="flex flex-col items-center justify-center opacity-80 select-none pointer-events-none shrink-0 w-11 sm:w-20 md:w-28">
      <svg
        className={`w-full h-6 sm:h-10 text-amber-800/60 transition-transform ${mobileFlip} ${desktopFlip}`}
        viewBox="0 0 120 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} strokeDasharray="3 3" />
        <path d="M 105 23 L 111 27 L 103 33" fill="none" strokeWidth="2" />
      </svg>
      <span className="text-[7px] sm:text-[9px] font-mono tracking-widest text-amber-800/40 uppercase -mt-1 sm:-mt-2">
        {index % 4 === 0 ? "Chef Pick" : index % 4 === 1 ? "Signature" : index % 4 === 2 ? "Classic" : "Special"}
      </span>
    </div>
  );
}

interface MenuBookProps {
  categories: MenuCategory[];
  config: BackgroundConfig;
  lang: "en" | "ar";
  onChangeLang: (lang: "en" | "ar") => void;
  defaultHeroUrl: string;
  onSecretTrigger: () => void;
}

export default function MenuBook({
  categories,
  config,
  lang,
  onChangeLang,
  defaultHeroUrl,
  onSecretTrigger,
}: MenuBookProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<Record<string, number>>({});
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Synchronous and robust secret tap tracking using useRef
  const tapTracker = useRef({ count: 0, lastTime: 0 });

  const handleSecretTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const now = Date.now();
    const tracker = tapTracker.current;
    
    if (now - tracker.lastTime < 1500) {
      tracker.count += 1;
      if (tracker.count >= 5) {
        tracker.count = 0;
        onSecretTrigger();
      }
    } else {
      tracker.count = 1;
    }
    tracker.lastTime = now;
  };

  // Handle wishlist / order tray quantities
  const toggleWishlist = (itemId: string) => {
    setWishlist((prev) => {
      const current = prev[itemId] || 0;
      if (current > 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      } else {
        return { ...prev, [itemId]: 1 };
      }
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setWishlist((prev) => {
      const current = prev[itemId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const updated = { ...prev };
        delete updated[itemId];
        return updated;
      }
      return { ...prev, [itemId]: next };
    });
  };

  // Total item count in Order Tray
  const totalWishlistItems = useMemo(() => {
    return Object.values(wishlist).reduce((sum: number, qty: number) => sum + qty, 0);
  }, [wishlist]);

  // Wishlist Items across all categories
  const wishlistItems = useMemo(() => {
    const items: MenuItem[] = [];
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (wishlist[item.id]) {
          items.push(item);
        }
      });
    });
    return items;
  }, [categories, wishlist]);

  // Total price in Order Tray
  const totalPrice = useMemo(() => {
    return wishlistItems.reduce((sum, item) => sum + item.price * (wishlist[item.id] || 0), 0);
  }, [wishlistItems, wishlist]);

  // Memoized filtered categories and items for instantaneous search response and high performance
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories
      .map((cat) => {
        const matchedItems = cat.items.filter((item) => {
          return (
            item.nameEn.toLowerCase().includes(query) ||
            item.nameAr.includes(query) ||
            item.descriptionEn.toLowerCase().includes(query) ||
            item.descriptionAr.includes(query) ||
            (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(query)))
          );
        });
        return { ...cat, items: matchedItems };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !tableNumber.trim()) {
      alert(lang === "en" ? "Please fill in your name and table number." : "يرجى إدخال اسمك ورقم الطاولة أولاً.");
      return;
    }
    if (wishlistItems.length === 0) {
      alert(lang === "en" ? "Your tray is empty." : "سلة طلباتك فارغة.");
      return;
    }

    setIsOrdering(true);

    try {
      const orderedItems = wishlistItems.map((item) => ({
        itemId: item.id,
        nameEn: item.nameEn,
        nameAr: item.nameAr,
        price: item.price,
        qty: wishlist[item.id] || 1,
      }));

      await addDoc(collection(db, "orders"), {
        customerName: customerName.trim(),
        tableNumber: tableNumber.trim(),
        items: orderedItems,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setOrderSuccess(true);
      setWishlist({});
      setCustomerName("");
      setTableNumber("");
    } catch (error) {
      console.error("Error submitting order:", error);
      alert(lang === "en" ? "Failed to place order. Please try again." : "فشل إرسال الطلب. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full min-h-screen flex flex-col justify-between py-6 px-4 md:px-8 z-10"
    >
      
      {/* ELEGANT FLOATING TOP HEADER */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center z-30 mb-8">
        {/* NFRT Brand logo left */}
        <div className="flex items-center gap-2 select-none">
          {config.logoUrl ? (
            <img 
              src={optimizeImageUrl(config.logoUrl, 150)} 
              alt="NFRT" 
              className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-10 sm:h-12 px-3 rounded-xl bg-amber-950/90 border border-amber-500/20 flex items-center justify-center text-amber-300 font-mono font-extrabold text-xs shadow-md tracking-widest">
              NFRT
            </div>
          )}
        </div>

        {/* Top Right Elegance: Globe Icon Language Swapper & Order Tray */}
        <div className="flex items-center gap-3">
          {/* Globe Icon Language Button */}
          <button
            onClick={() => onChangeLang(lang === "en" ? "ar" : "en")}
            className="relative overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-amber-950/90 to-stone-900/90 border border-amber-500/30 text-amber-200 hover:text-white hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 group select-none backdrop-blur-md"
            title={lang === "en" ? "Switch to Arabic" : "التغيير للغة الإنجليزية"}
          >
            {/* Elegant glowing background pulse */}
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Globe className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-500 ease-out" />
            
            <span className="text-[11px] font-extrabold uppercase tracking-widest leading-none">
              {lang === "en" ? "عربي" : "English"}
            </span>
            
            {/* Tiny elegant accent dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          </button>

          {/* Tray Button */}
          {totalWishlistItems > 0 && (
            <button
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md bg-amber-950/95 text-amber-300 hover:bg-amber-900"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === "en" ? "My Tray" : "طلباتي"} ({totalWishlistItems})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* CONTINUOUS SCROLLING DESIGN CONTAINER */}
      <div className="flex-1 w-full flex flex-col space-y-10">
        
        {/* ======================================================== */}
        {/* STORY HERO HEADER SECTION */}
        {/* ======================================================== */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 py-6 z-20">
          
          {/* Top Royal Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/10 border border-amber-900/15 backdrop-blur-sm select-none"
          >
            <Crown className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span className="text-[9px] font-mono tracking-[0.25em] font-extrabold text-amber-900 uppercase">
              {lang === "en" ? "Royal Culinary House" : "بيت الطهي الملكي الفاخر"}
            </span>
          </motion.div>

          {/* Redesigned Brand Layout: Logo ABOVE the Name in the center */}
          <div className="flex flex-col items-center justify-center space-y-4 select-none">
            {/* Logo Image above the Name */}
            {config.logoUrl && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-500/20 bg-amber-950/5 p-1 flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-500"
              >
                <img 
                  src={optimizeImageUrl(config.logoUrl, 250)} 
                  alt="NFRT Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="sync"
                />
              </motion.div>
            )}

            {/* Restaurant Name in the middle */}
            <div className="space-y-2 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[0.15em] text-amber-950 font-sans uppercase drop-shadow-sm">
                {config.brandName || "NFRT"}
              </h1>
              
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-6 bg-amber-800/30" />
                <span className="text-[10px] font-mono tracking-widest text-amber-800 uppercase">
                  {lang === "en" ? "EST. 2026" : "تأسس عام ٢٠٢٦"}
                </span>
                <span className="h-[1px] w-6 bg-amber-800/30" />
              </div>
            </div>
          </div>

          {/* Central Royal Portal Container: Image below the name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.15 }}
            className="relative w-full max-w-xl sm:max-w-2xl px-4 flex justify-center items-center select-none"
          >
            {/* Ambient Golden Glowing Aura */}
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/15 via-transparent to-transparent blur-3xl opacity-70 scale-125 pointer-events-none select-none z-0" />
            
            {/* The Royal Frame Portal Container */}
            <div className="relative p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-amber-900/10 bg-gradient-to-b from-amber-900/[0.02] to-amber-900/[0.05] backdrop-blur-xs w-full flex items-center justify-center overflow-hidden group shadow-[inset_0_4px_40px_rgba(139,92,26,0.03)] hover:shadow-[inset_0_4px_45px_rgba(139,92,26,0.05)] transition-all duration-700">
              
              {/* Corner Golden Egyptian L-Brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-700/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-700/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-700/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-700/40 rounded-br-lg" />
              
              {/* Subtle side hieroglyphs or lines */}
              <div className="absolute inset-y-8 left-3 w-[1px] bg-gradient-to-b from-transparent via-amber-800/15 to-transparent" />
              <div className="absolute inset-y-8 right-3 w-[1px] bg-gradient-to-b from-transparent via-amber-800/15 to-transparent" />

              {/* Floating Illustration */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="w-full h-auto flex items-center justify-center z-10"
              >
                {/* Src priority: uploaded Hero Cover URL -> uploaded Logo URL (shown bigger) -> default Hero Artwork */}
                <img 
                  src={optimizeImageUrl(config.coverUrl || config.logoUrl || defaultHeroUrl, 800)} 
                  alt="NFRT Hero Illustration" 
                  className="max-w-full h-auto object-contain select-none pointer-events-none max-h-[450px] sm:max-h-[550px] md:max-h-[650px] drop-shadow-[0_20px_50px_rgba(139,92,26,0.25)] hover:drop-shadow-[0_25px_60px_rgba(139,92,26,0.35)] transition-all duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="sync"
                />
              </motion.div>

              {/* Tiny decorative star ornaments */}
              <span className="absolute top-6 left-1/2 -translate-x-1/2 text-amber-700/40 text-[10px] tracking-widest font-mono">✦ ✦ ✦</span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-amber-700/40 text-xs">✦</span>
            </div>
          </motion.div>

          {/* Poetic Narrative Block */}
          <div className="max-w-2xl px-6 space-y-4">
            <div className="flex justify-center items-center gap-2 text-amber-700/40 text-sm select-none">
              <span>✦</span>
              <span className="h-[1px] w-8 bg-amber-800/10" />
              <span>✦</span>
            </div>
            <p className="text-xs sm:text-sm md:text-[15px] text-amber-950 font-serif italic font-medium leading-relaxed md:leading-loose text-center select-none whitespace-pre-line tracking-wide drop-shadow-xs max-w-xl mx-auto">
              {lang === "en" 
                ? (config.storyEn || POETIC_STORY.textEn) 
                : (config.storyAr || POETIC_STORY.textAr)}
            </p>
            <div className="flex justify-center items-center gap-3 select-none pt-1">
              <span className="h-[1px] w-4 bg-amber-800/20" />
              <p className="text-[10px] font-mono tracking-[0.2em] text-amber-800 uppercase font-bold">
                {lang === "en" ? "NFRT Team" : "فريق نفرتيتي"}
              </p>
              <span className="h-[1px] w-4 bg-amber-800/20" />
            </div>
          </div>

          {/* Elegant Explore Indicator */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1.5 pt-2 text-amber-900/60 select-none cursor-default"
          >
            <span className="text-[9px] font-mono tracking-[0.25em] text-amber-950/80 font-extrabold uppercase">
              {lang === "en" ? "Explore the Menu" : "استكشف قائمة الطعام الملكية"}
            </span>
            <ChevronDown className="w-4 h-4 text-amber-800" />
          </motion.div>
        </div>

        {/* Elegant Spacing (Completely line-free) */}
        <div className="w-full max-w-5xl mx-auto py-4 select-none" />

        {/* ======================================================== */}
        {/* CONTINUOUS DISHES LIST SECTION (All Categories Stacked) */}
        {/* ======================================================== */}
        <div className="w-full max-w-5xl mx-auto flex flex-col space-y-8 z-20 py-2">
          
          {/* Unified Chic Search Bar (No borders) */}
          <div className="w-full max-w-2xl mx-auto flex items-center bg-amber-950/5 rounded-2xl p-2.5 backdrop-blur-sm shadow-inner">
            <div className="relative flex-1 w-full">
              <Search className={`absolute ${lang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/40`} />
              <input
                type="text"
                placeholder={lang === "en" ? "Search delicacies, grill, beverages..." : "ابحث عن دجاج، مشويات، بيتزا، مشروبات..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-white/30 border-none rounded-xl py-2.5 ${lang === 'ar' ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'} text-sm text-amber-950 placeholder-amber-900/40 focus:outline-none focus:bg-white/70 transition-all font-serif`}
              />
            </div>
          </div>

          {/* Tray View Header Indicator */}
          {showWishlistOnly && (
            <div className="flex justify-between items-center bg-amber-950/5 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-amber-950 font-sans">
                <ShoppingBag className="w-4 h-4 text-amber-900" />
                <h3 className="font-bold text-sm md:text-base">
                  {lang === "en" ? "My Tray (Review Selected Items)" : "طلباتي المختارة (مراجعة القائمة)"}
                </h3>
              </div>
              <button
                onClick={() => setShowWishlistOnly(false)}
                className="text-xs text-amber-900 font-sans font-bold hover:underline cursor-pointer"
              >
                {lang === "en" ? "← Back to Full Menu" : "← العودة لكامل المنيو"}
              </button>
            </div>
          )}

          {/* Dynamic Content Area: Render all categories stacked, completely borderless */}
          <div className="flex-1 w-full min-h-[400px]">
            {showWishlistOnly ? (
              /* ORDER TRAY DRAFT RENDER WITH FIREBASE SUBMIT */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-6"
              >
                {orderSuccess ? (
                  /* BEAUTIFUL ORDER SUCCESS STATE */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md mx-auto my-6 p-8 bg-[#251e15] border border-amber-500/10 rounded-2xl text-center space-y-6 shadow-2xl text-amber-100"
                  >
                    <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner animate-pulse">
                      ✓
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-extrabold tracking-wider uppercase text-amber-300 font-sans">
                        {lang === "en" ? "Order Sent Successfully!" : "تم إرسال طلبك بنجاح!"}
                      </h3>
                      <p className="text-xs text-amber-100/70 leading-relaxed font-serif">
                        {lang === "en" 
                          ? "Your order has been transmitted directly to our kitchen. Please stay seated, we are preparing your selection!" 
                          : "تم إرسال طلبك مباشرة للمطبخ وللوحة الطاقم. يرجى الانتظار في مكانك، جاري تحضير طلبك الرائع!"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setOrderSuccess(false);
                        setShowWishlistOnly(false);
                      }}
                      className="w-full bg-amber-900 hover:bg-amber-800 text-amber-100 text-xs font-bold py-3 px-5 rounded-xl cursor-pointer transition-colors active:scale-95 font-sans uppercase tracking-wider"
                    >
                      {lang === "en" ? "Back to Menu" : "العودة للمنيو"}
                    </button>
                  </motion.div>
                ) : wishlistItems.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-4">
                      {wishlistItems.map((item, index) => {
                        const qty = wishlist[item.id] || 0;
                        return (
                          <div 
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-amber-900/[0.04] rounded-2xl"
                          >
                            <div className="w-20 h-20 shrink-0 select-none flex items-center justify-center">
                              <img 
                                src={optimizeImageUrl(config.itemImages?.[item.id] || item.image, 160)} 
                                alt={item.nameEn} 
                                className="max-w-full max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(40,30,10,0.18)]"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                            <div className={`flex-1 w-full ${lang === "ar" ? "text-right" : "text-left"}`}>
                              <div className="flex justify-between items-baseline gap-2">
                                <h4 className="font-serif font-bold text-amber-950">{lang === "en" ? item.nameEn : item.nameAr}</h4>
                                <span className="font-mono text-amber-900 font-bold shrink-0">{item.price} EGP</span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-amber-800">{lang === "en" ? "Quantity" : "الكمية"}</span>
                                <div className="flex items-center gap-2 bg-amber-900 text-amber-50 rounded-full px-2.5 py-1 text-xs">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 cursor-pointer"><Minus className="w-3 h-3" /></button>
                                  <span className="font-mono font-bold w-4 text-center">{qty}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 cursor-pointer"><Plus className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Price and Checkout Details Form */}
                    <div className="max-w-xl mx-auto w-full bg-amber-900/[0.03] border border-amber-900/10 p-5 rounded-2xl mt-4 space-y-5">
                      <div className="flex justify-between items-center border-b border-amber-900/10 pb-3 font-sans">
                        <span className="text-amber-950 font-bold text-sm sm:text-base">
                          {lang === "en" ? "Total Order Bill:" : "الحساب الإجمالي للطلب:"}
                        </span>
                        <span className="font-mono text-amber-900 text-lg sm:text-xl font-extrabold">
                          {totalPrice} EGP
                        </span>
                      </div>

                      {/* Checkout Form */}
                      <form onSubmit={handlePlaceOrder} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-xs font-sans font-bold text-amber-950/80">
                              {lang === "en" ? "Customer Name" : "اسم العميل كامل"}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={lang === "en" ? "e.g. Mohamed Ali" : "مثال: محمد علي"}
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              className="w-full bg-white/60 border border-amber-900/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-amber-950 placeholder-amber-900/30 focus:outline-none focus:border-amber-800 font-serif"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-sans font-bold text-amber-950/80">
                              {lang === "en" ? "Table Number" : "رقم الطاولة"}
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={lang === "en" ? "e.g. 5" : "مثال: 5"}
                              value={tableNumber}
                              onChange={(e) => setTableNumber(e.target.value)}
                              className="w-full bg-white/60 border border-amber-900/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-amber-950 placeholder-amber-900/30 focus:outline-none focus:border-amber-800 font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isOrdering}
                          className="w-full flex items-center justify-center gap-2 bg-amber-950 hover:bg-amber-900 text-amber-200 font-sans font-extrabold uppercase tracking-wider text-xs sm:text-sm py-3 px-6 rounded-xl cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                        >
                          {isOrdering ? (
                            <>
                              <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                              <span>{lang === "en" ? "Sending Order..." : "جاري إرسال الطلب..."}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 text-amber-300" />
                              <span>{lang === "en" ? "Order Now" : "إتمام وإرسال الطلب"}</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 space-y-3 select-none">
                    <p className="text-sm text-amber-900/60 font-serif leading-relaxed">
                      {lang === "en" ? "Your tray is empty" : "سلة طلباتك فارغة حالياً"}
                    </p>
                    <button
                      onClick={() => setShowWishlistOnly(false)}
                      className="inline-block text-xs bg-amber-950/5 hover:bg-amber-950/15 text-amber-950 font-sans font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
                    >
                      {lang === "en" ? "Browse Menu" : "تصفح المنيو لإضافة أطباق"}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              /* INTERACTIVE WEB LIST: All categories and items stacked continuously with advanced layout transitions */
              <div className="flex flex-col gap-12 sm:gap-16">
                {filteredCategories.map((cat) => {
                  return (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="space-y-6"
                    >
                      {/* Section Title (No dividing lines, pure typography spacing) */}
                      <div className="text-center py-2 select-none">
                        <motion.h2 
                          initial={{ scale: 0.98 }}
                          whileInView={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="text-2xl md:text-3xl font-extrabold tracking-widest text-amber-950 font-sans uppercase"
                        >
                          {lang === "en" ? cat.nameEn : cat.nameAr}
                        </motion.h2>
                        <div className="w-12 h-0.5 bg-amber-800/20 mx-auto mt-2 rounded-full" />
                      </div>

                      {/* Stacked items belonging to this category */}
                      <div className="flex flex-col gap-6 md:gap-8">
                        {cat.items.map((item, index) => {
                          const qty = wishlist[item.id] || 0;
                          const isReversed = index % 2 === 1;
                          
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 15 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-100px" }}
                              transition={{ 
                                type: "tween", 
                                duration: 0.35,
                                ease: "easeOut",
                                delay: Math.min(index * 0.04, 0.16)
                              }}
                              whileHover={{ 
                                y: -4,
                                scale: 1.005,
                                backgroundColor: "rgba(120, 53, 4, 0.025)"
                              }}
                              whileTap={{ scale: 0.995 }}
                              className={`flex flex-row items-center gap-3 sm:gap-6 md:gap-10 p-2 sm:p-4 rounded-2xl transition-all duration-300 relative ${
                                isReversed ? "sm:flex-row-reverse" : ""
                              } ${
                                qty > 0 ? "bg-amber-900/[0.04] ring-1 ring-amber-800/10" : ""
                              } hover:bg-amber-900/[0.02]`}
                            >
                              {/* Isolated Dish Image (Sleek floating layout without a circle outline, blending beautifully with the website) */}
                              <div className="relative shrink-0 select-none group w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                                <img
                                  src={optimizeImageUrl(config.itemImages?.[item.id] || item.image, 250)}
                                  alt={lang === "en" ? item.nameEn : item.nameAr}
                                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_12px_24px_rgba(40,30,10,0.22)] group-hover:scale-110 group-hover:rotate-[6deg] transition-all duration-500 ease-out"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                  decoding="async"
                                />
                                <span className="absolute -top-1 -right-1 bg-amber-950/90 text-amber-400 font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-amber-500/30 shadow-md animate-pulse">
                                  ✦
                                </span>
                              </div>

                              {/* Curved sketch arrow connecting photo to text description - visible on mobile! */}
                              <div className="shrink-0 select-none">
                                <CurvedArrow index={index} isReversed={isReversed} lang={lang} />
                              </div>

                              {/* Description details floating cleanly on background */}
                              <div className={`flex-1 w-full space-y-2 ${
                                lang === "ar" ? "text-right" : "text-left"
                              }`}>
                                <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 ${
                                  isReversed ? "sm:flex-row-reverse" : ""
                                }`}>
                                  <h3 className="font-serif font-extrabold text-amber-950 text-sm sm:text-lg md:text-xl flex items-center gap-2">
                                    {lang === "en" ? item.nameEn : item.nameAr}
                                    {qty > 0 && (
                                      <span className="bg-amber-800 text-amber-100 text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-full uppercase font-mono font-bold">
                                        {qty}
                                      </span>
                                    )}
                                  </h3>
                                  <span className="font-mono font-bold text-amber-900 text-xs sm:text-base md:text-lg whitespace-nowrap bg-amber-950/5 px-2 py-0.5 rounded-md self-start sm:self-auto">
                                    {item.price} EGP
                                  </span>
                                </div>

                                <p className="text-[10px] sm:text-xs md:text-sm text-amber-900/80 leading-relaxed font-serif">
                                  {lang === "en" ? item.descriptionEn : item.descriptionAr}
                                </p>

                                {/* Footer bar under description: tags & add to tray controls */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                  <div className="flex flex-wrap gap-1">
                                    {item.tags && item.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="bg-amber-900/5 text-amber-950 text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {/* Wishlist toggle */}
                                    <button
                                      onClick={() => toggleWishlist(item.id)}
                                      className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                                        qty > 0 ? "text-rose-600 hover:bg-rose-50/20" : "text-amber-900/30 hover:bg-amber-900/5 hover:text-rose-500"
                                      }`}
                                      title="Bookmark item"
                                    >
                                      <Heart className="w-4 h-4 fill-current" />
                                    </button>

                                    {/* Quantity counter */}
                                    {qty > 0 ? (
                                      <div className="flex items-center gap-2 bg-amber-900 text-amber-50 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs">
                                        <button
                                          onClick={() => updateQuantity(item.id, -1)}
                                          className="hover:text-amber-300 p-0.5 cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="font-mono font-bold w-4 text-center">{qty}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, 1)}
                                          className="hover:text-amber-300 p-0.5 cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => toggleWishlist(item.id)}
                                        className="bg-amber-950/5 hover:bg-amber-900 text-amber-950 hover:text-amber-50 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-bold flex items-center gap-1 transition-all cursor-pointer"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>{lang === "en" ? "Add to Tray" : "إضافة للطلبات"}</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Floating Bottom Order Tray Indicator */}
      <AnimatePresence>
        {totalWishlistItems > 0 && !showWishlistOnly && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWishlistOnly(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-full text-xs sm:text-sm font-sans font-extrabold shadow-2xl bg-amber-950 text-amber-300 hover:bg-amber-900 hover:text-amber-100 border border-amber-500/20 cursor-pointer active:scale-95 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {totalWishlistItems}
              </span>
            </div>
            <span>{lang === "en" ? "View My Tray" : "عرض الطلبات"}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* FOOTER (Line-free, fully integrated into bottom layout) */}
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center pt-8 text-[10px] text-amber-900/50 font-mono mt-12 z-30 select-none">
        <span>
          © 2026 NFRT RESTAURANT{" "}
          <span 
            onClick={handleSecretTap}
            className="cursor-pointer text-amber-900/40 hover:text-amber-950 transition-colors px-4 py-2 font-bold inline-block select-none"
            title="Admin Login"
          >
            &amp;
          </span>{" "}
          CAFE
        </span>
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-950">
          <span>{lang === "en" ? "Heritage with a Twist" : "عراقة بلمسة عصرية"}</span>
        </div>
      </div>
    </motion.div>
  );
}
