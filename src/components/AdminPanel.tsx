import React, { useState } from "react";
import { 
  Settings, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  Cloud, 
  Sliders, 
  Upload, 
  Loader2, 
  Info,
  ChevronDown,
  ChevronUp,
  Flame,
  ChefHat,
  Eye,
  Trash2,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  User,
  Hash,
  XCircle,
  ClipboardList
} from "lucide-react";
import { BackgroundConfig, MenuCategory, CloudinarySettings, LiveOrder } from "../types";
import { collection, onSnapshot, doc, updateDoc, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

function playOrderSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playChime = (delay: number, pitch: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime + delay);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + delay + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    };
    // Elegant 3-note ascending menu order chime
    playChime(0, 523.25, 0.4); // C5
    playChime(0.12, 659.25, 0.4); // E5
    playChime(0.24, 783.99, 0.5); // G5
  } catch (e) {
    console.error("Failed to play notification sound:", e);
  }
}

interface AdminPanelProps {
  config: BackgroundConfig;
  categories: MenuCategory[];
  onChangeConfig: (newConfig: BackgroundConfig) => void;
  lang: "en" | "ar";
}

export default function AdminPanel({
  config,
  categories,
  onChangeConfig,
  lang,
}: AdminPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [orderFilter, setOrderFilter] = useState<"all" | "pending" | "completed" | "cancelled">("pending");

  React.useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    
    let isFirstLoad = true;
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: LiveOrder[] = [];
      let hasNewPendingOrder = false;
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !isFirstLoad) {
          const data = change.doc.data();
          if (data.status === "pending") {
            hasNewPendingOrder = true;
          }
        }
      });
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedOrders.push({
          id: doc.id,
          customerName: data.customerName || "",
          tableNumber: data.tableNumber || "",
          items: data.items || [],
          totalPrice: data.totalPrice || 0,
          status: data.status || "pending",
          createdAt: data.createdAt,
        });
      });
      
      if (hasNewPendingOrder && soundEnabled) {
        playOrderSound();
      }
      
      isFirstLoad = false;
      setOrders(fetchedOrders);
    }, (error) => {
      console.error("Error loading live orders:", error);
    });
    
    return () => unsubscribe();
  }, [soundEnabled]);

  const handleUpdateStatus = async (orderId: string, newStatus: "pending" | "completed" | "cancelled") => {
    try {
      const orderDocRef = doc(db, "orders", orderId);
      await updateDoc(orderDocRef, { status: newStatus });
    } catch (e) {
      console.error("Failed to update order status:", e);
      alert(lang === "en" ? "Failed to update status." : "فشل تحديث حالة الطلب.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(lang === "en" ? "Are you sure you want to delete this order?" : "هل أنت متأكد من مسح هذا الطلب نهائياً؟")) {
      try {
        const orderDocRef = doc(db, "orders", orderId);
        await deleteDoc(orderDocRef);
      } catch (e) {
        console.error("Failed to delete order:", e);
        alert(lang === "en" ? "Failed to delete order." : "فشل مسح الطلب.");
      }
    }
  };

  const formatOrderTime = (createdAt: any) => {
    if (!createdAt) return "";
    let date: Date;
    if (createdAt.toDate && typeof createdAt.toDate === "function") {
      date = createdAt.toDate();
    } else {
      date = new Date(createdAt);
    }
    return date.toLocaleTimeString(lang === "en" ? "en-US" : "ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const [localConfig, setLocalConfig] = useState<BackgroundConfig>({
    coverUrl: config.coverUrl || "",
    logoUrl: config.logoUrl || "",
    categoryBackgrounds: config.categoryBackgrounds || {},
    itemImages: config.itemImages || {},
    cloudinary: config.cloudinary || { cloudName: "", uploadPreset: "" },
    storyEn: config.storyEn || "",
    storyAr: config.storyAr || ""
  });
  const [isSaved, setIsSaved] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("main_course");

  // Sync state if prop changes
  React.useEffect(() => {
    setLocalConfig({
      coverUrl: config.coverUrl || "",
      logoUrl: config.logoUrl || "",
      categoryBackgrounds: config.categoryBackgrounds || {},
      itemImages: config.itemImages || {},
      cloudinary: config.cloudinary || { cloudName: "", uploadPreset: "" },
      storyEn: config.storyEn || "",
      storyAr: config.storyAr || ""
    });
  }, [config]);

  const handleCloudinarySettingsChange = (field: keyof CloudinarySettings, value: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      cloudinary: {
        ...prev.cloudinary || { cloudName: "", uploadPreset: "" },
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onChangeConfig(localConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm(lang === "en" ? "Reset back to default layout?" : "هل تريد إعادة التعيين للوضع الافتراضي؟")) {
      const resetConfig: BackgroundConfig = {
        coverUrl: "",
        categoryBackgrounds: {},
        itemImages: {},
        cloudinary: { cloudName: "", uploadPreset: "" }
      };
      setLocalConfig(resetConfig);
      onChangeConfig(resetConfig);
    }
  };

  const fillMockCloudinary = () => {
    const mockUrls: Record<string, string> = {};
    categories.forEach((cat) => {
      mockUrls[cat.id] = `https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200`;
    });
    const mockConf: BackgroundConfig = {
      coverUrl: `https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200`,
      categoryBackgrounds: mockUrls,
      itemImages: {},
      cloudinary: localConfig.cloudinary
    };
    setLocalConfig(mockConf);
    onChangeConfig(mockConf);
  };

  // Direct Cloudinary Upload handler
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetType: "cover" | "logo" | "category" | "item",
    targetId?: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = localConfig.cloudinary?.cloudName || "";
    const uploadPreset = localConfig.cloudinary?.uploadPreset || "";

    if (!cloudName || !uploadPreset) {
      alert(
        lang === "en"
          ? "Please configure your Cloudinary Cloud Name and Upload Preset first in the Cloudinary Config section below!"
          : "يرجى كتابة الـ Cloud Name والـ Upload Preset أولاً في إعدادات كلاودري بالأسفل لتفعيل الرفع المباشر!"
      );
      return;
    }

    const uniqueId = targetType === "item" ? targetId! : targetType === "category" ? targetId! : targetType === "logo" ? "logo" : "cover";
    setUploadingId(uniqueId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }

      const data = await response.json();
      const uploadedUrl = data.secure_url;

      // Update local state and save config
      setLocalConfig((prev) => {
        const next = { ...prev };
        if (targetType === "cover") {
          next.coverUrl = uploadedUrl;
        } else if (targetType === "logo") {
          next.logoUrl = uploadedUrl;
        } else if (targetType === "category" && targetId) {
          next.categoryBackgrounds = {
            ...prev.categoryBackgrounds,
            [targetId]: uploadedUrl,
          };
        } else if (targetType === "item" && targetId) {
          next.itemImages = {
            ...prev.itemImages,
            [targetId]: uploadedUrl,
          };
        }
        return next;
      });

      // Directly update parent
      const parentUpdate = { ...localConfig };
      if (targetType === "cover") {
        parentUpdate.coverUrl = uploadedUrl;
      } else if (targetType === "logo") {
        parentUpdate.logoUrl = uploadedUrl;
      } else if (targetType === "category" && targetId) {
        parentUpdate.categoryBackgrounds = {
          ...localConfig.categoryBackgrounds,
          [targetId]: uploadedUrl,
        };
      } else if (targetType === "item" && targetId) {
        parentUpdate.itemImages = {
          ...localConfig.itemImages,
          [targetId]: uploadedUrl,
        };
      }
      onChangeConfig(parentUpdate);

    } catch (err) {
      console.error(err);
      alert(
        lang === "en"
          ? "Failed to upload image. Please verify your Cloudinary config values and internet connection."
          : "فشل رفع الصورة. يرجى التحقق من صحة بيانات كلاودري واتصال الإنترنت."
      );
    } finally {
      setUploadingId(null);
    }
  };

  const removeImageOverride = (itemId: string) => {
    setLocalConfig((prev) => {
      const next = { ...prev };
      const updatedItems = { ...prev.itemImages };
      delete updatedItems[itemId];
      next.itemImages = updatedItems;
      return next;
    });
    
    setTimeout(() => {
      const parentUpdate = { ...localConfig };
      const updatedItems = { ...localConfig.itemImages };
      delete updatedItems[itemId];
      parentUpdate.itemImages = updatedItems;
      onChangeConfig(parentUpdate);
    }, 100);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 bg-[#2a2217] border border-amber-900/30 rounded-2xl shadow-2xl overflow-hidden select-none">
      
      {/* Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-[#1e1710] hover:bg-[#1a130c] p-5 flex items-center justify-between text-left transition-colors cursor-pointer border-b border-amber-900/20"
      >
        <div className="flex items-center gap-3">
          <Settings className={`w-5 h-5 text-amber-500 ${isExpanded ? "animate-spin-slow" : ""}`} />
          <div>
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider text-amber-100 font-sans">
              {lang === "en" ? "👑 NFRT ROYAL DASHBOARD" : "👑 لوحة التحكم الإدارية لنفرتيتي"}
            </h2>
            <p className="text-[10px] text-amber-500/50 uppercase font-mono tracking-widest mt-0.5">
              {lang === "en" ? "Integrated Image & Cloudinary Panel" : "إدارة صور الأطباق والخلفيات"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-[10px] bg-amber-900/40 text-amber-400 font-mono px-2.5 py-1 rounded-full border border-amber-800/30 uppercase tracking-widest">
            {lang === "en" ? "Interactive Mode" : "لوحة تحكم مباشرة"}
          </span>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5 text-amber-400" />}
        </div>
      </button>

      {/* Expanded Admin Console */}
      {isExpanded && (
        <div className="p-6 space-y-8 divide-y divide-amber-900/20 text-amber-100" dir={lang === "ar" ? "rtl" : "ltr"}>
          
          {/* Live Orders Monitor Section */}
          <div className="space-y-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Bell className="w-5.5 h-5.5 text-rose-500 animate-pulse animate-duration-1000" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm md:text-base text-amber-100 uppercase tracking-wide">
                    {lang === "en" ? "🔴 Live Orders Monitor" : "🔴 شاشة استقبال طلبات المنيو المباشرة"}
                  </h3>
                  <p className="text-[10px] text-amber-500/60 uppercase font-mono mt-0.5">
                    {lang === "en" ? "Real-time orders receiving without refresh" : "استقبال الطلبات لحظياً وبدون الحاجة لعمل تحديث للمتصفح"}
                  </p>
                </div>
              </div>

              {/* Sound alert control and order count badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs bg-amber-950/40 border border-amber-900/30 text-amber-300 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 select-none font-mono">
                  {lang === "en" ? "Pending:" : "قيد التحضير:"} {orders.filter(o => o.status === "pending").length}
                </span>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all border cursor-pointer select-none ${
                    soundEnabled
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-950/60"
                      : "bg-rose-950/40 text-rose-400 border-rose-800/40 hover:bg-rose-950/60"
                  }`}
                  title={lang === "en" ? "Toggle sound notifications" : "تشغيل/إيقاف صوت التنبيهات"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? (lang === "en" ? "Sound: On" : "صوت التنبيه: مفعّل") : (lang === "en" ? "Sound: Off" : "صوت التنبيه: صامت")}</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1.5 border-b border-amber-900/20 pb-1 font-sans">
              {(["pending", "completed", "cancelled", "all"] as const).map((filter) => {
                const count = filter === "all" ? orders.length : orders.filter(o => o.status === filter).length;
                const isSelected = orderFilter === filter;
                
                const labelMap = {
                  pending: lang === "en" ? "Preparing" : "قيد التحضير",
                  completed: lang === "en" ? "Completed" : "مكتملة",
                  cancelled: lang === "en" ? "Cancelled" : "ملغاة",
                  all: lang === "en" ? "All History" : "جميع الطلبات"
                };

                return (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-2 rounded-t-lg text-xs font-bold transition-all cursor-pointer relative select-none ${
                      isSelected 
                        ? "text-amber-300 bg-amber-950/40 border-t border-x border-amber-900/40"
                        : "text-amber-100/50 hover:text-amber-100 hover:bg-amber-950/10"
                    }`}
                  >
                    <span>{labelMap[filter]}</span>
                    <span className="ml-1.5 text-[9px] font-mono bg-black/30 px-1.5 py-0.5 rounded-full text-amber-400/80 font-bold">
                      {count}
                    </span>
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Orders Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.filter(o => orderFilter === "all" || o.status === orderFilter).length > 0 ? (
                orders
                  .filter(o => orderFilter === "all" || o.status === orderFilter)
                  .map((order) => (
                    <div 
                      key={order.id} 
                      className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                        order.status === "pending"
                          ? "bg-amber-950/15 border-amber-800/30 shadow-md ring-1 ring-amber-500/5 hover:border-amber-700/40"
                          : order.status === "completed"
                          ? "bg-emerald-950/10 border-emerald-950/30 hover:border-emerald-900/30 opacity-80"
                          : "bg-rose-950/10 border-rose-950/30 hover:border-rose-900/30 opacity-70"
                      }`}
                    >
                      {/* Customer Detail Card Header */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <div className="bg-amber-900/30 p-1.5 rounded-lg text-amber-400 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold font-sans text-amber-100 truncate max-w-[130px]">
                              {order.customerName}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono text-amber-500/60 bg-black/20 px-2 py-0.5 rounded flex items-center gap-1 select-none shrink-0">
                            <Clock className="w-3 h-3" />
                            {formatOrderTime(order.createdAt)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs border-b border-amber-900/10 pb-2">
                          <span className="text-[11px] font-sans text-amber-400/90 font-bold flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5 text-amber-500" />
                            {lang === "en" ? `Table: ${order.tableNumber}` : `طاولة رقم: ${order.tableNumber}`}
                          </span>

                          <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.status === "pending"
                              ? "bg-amber-800/40 text-amber-300 border border-amber-600/20"
                              : order.status === "completed"
                              ? "bg-emerald-900/40 text-emerald-400 border border-emerald-600/20"
                              : "bg-rose-900/40 text-rose-400 border border-rose-600/20"
                          }`}>
                            {order.status === "pending" ? (lang === "en" ? "Preparing" : "جاري التحضير") : order.status === "completed" ? (lang === "en" ? "Completed" : "مكتمل") : (lang === "en" ? "Cancelled" : "ملغي")}
                          </span>
                        </div>

                        {/* Order Items List */}
                        <div className="py-2.5 space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs font-serif leading-relaxed">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-mono text-amber-400 font-bold bg-amber-900/30 px-1.5 py-0.5 rounded text-[10px]">
                                  x{item.qty}
                                </span>
                                <span className="text-amber-100/90 truncate max-w-[150px]">
                                  {lang === "en" ? item.nameEn : item.nameAr}
                                </span>
                              </div>
                              <span className="font-mono text-amber-500/80 text-[11px]">
                                {item.price * item.qty} EGP
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total and Actions */}
                      <div className="border-t border-amber-900/10 pt-2.5 mt-2 space-y-3">
                        <div className="flex justify-between items-center text-xs font-sans">
                          <span className="text-amber-400/80 font-bold">{lang === "en" ? "Total Price" : "الحساب الإجمالي"}</span>
                          <span className="font-mono text-amber-100 text-sm font-extrabold">{order.totalPrice} EGP</span>
                        </div>

                        {/* Control buttons */}
                        <div className="flex gap-1.5 justify-end">
                          {order.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "completed")}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-emerald-50 rounded-lg text-[10px] sm:text-xs font-sans font-bold cursor-pointer transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{lang === "en" ? "Complete" : "إتمام وتوصيل"}</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(order.id, "cancelled")}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-950/30 hover:bg-rose-900/30 active:scale-95 text-rose-300 border border-rose-900/30 rounded-lg text-[10px] sm:text-xs font-sans font-bold cursor-pointer transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{lang === "en" ? "Cancel" : "إلغاء الطلب"}</span>
                              </button>
                            </>
                          )}

                          {order.status !== "pending" && (
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-amber-950/10 hover:bg-rose-950/40 hover:text-rose-400 active:scale-95 text-amber-500/60 border border-amber-900/10 hover:border-rose-900/30 rounded-lg text-[10px] sm:text-xs font-sans font-semibold cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{lang === "en" ? "Delete History" : "حذف من السجل"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-2 select-none">
                  <ClipboardList className="w-8 h-8 text-amber-900/30 stroke-[1.5]" />
                  <p className="text-xs text-amber-100/40 font-sans">
                    {orderFilter === "pending"
                      ? (lang === "en" ? "Waiting for new orders... No pending orders right now" : "في انتظار طلبات جديدة... لا توجد طلبات معلقة حالياً")
                      : (lang === "en" ? "No orders found in this filter" : "لا توجد طلبات في هذا القسم")}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Cloudinary Integration Section */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-amber-400" />
              <h3 className="font-sans font-bold text-sm md:text-base text-amber-100 uppercase tracking-wide">
                {lang === "en" ? "1. Cloudinary Direct Storage Configuration" : "1. إعدادات مساحة التخزين السحابي (كلاودري)"}
              </h3>
            </div>

            <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/20 text-xs leading-relaxed text-amber-200/80 max-w-3xl space-y-2">
              <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 shrink-0" />
                {lang === "en" ? "Direct Client-Side Cloud Upload" : "رفع سحابي مباشر وبدون خلفيات!"}
              </p>
              <p>
                {lang === "en" 
                  ? "Enter your Cloudinary name and upload preset. When configured, you can upload food images (transparents/PNG cutouts) or PDF backgrounds directly from this panel, and they will save instantly!"
                  : "أدخل اسم حسابك في كلاودري والـ Upload Preset الخاص بك. عند إدخالهم، ستتمكن من رفع صور الأطباق (بدون خلفية) أو الخلفيات مباشرة من هذه اللوحة وسيتم حفظها وتحديثها فوراً!"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              <div className="space-y-1.5">
                <label className="block text-xs uppercase font-mono tracking-wider text-amber-400">
                  {lang === "en" ? "Cloud Name" : "اسم حساب كلاودري (Cloud Name)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. dfgk8923b"
                  value={localConfig.cloudinary?.cloudName || ""}
                  onChange={(e) => handleCloudinarySettingsChange("cloudName", e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase font-mono tracking-wider text-amber-400">
                  {lang === "en" ? "Upload Preset" : "اسم الـ Upload Preset"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. nfrt_presets"
                  value={localConfig.cloudinary?.uploadPreset || ""}
                  onChange={(e) => handleCloudinarySettingsChange("uploadPreset", e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Core App Display & Cover Settings */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <h3 className="font-sans font-bold text-sm md:text-base text-amber-100 uppercase tracking-wide">
                {lang === "en" ? "2. Hero Image & Brand Logo Configuration" : "2. تخصيص صورة الهيرو ولوجو المنيو الموحد"}
              </h3>
            </div>

            <p className="text-xs text-amber-200/70 leading-relaxed max-w-3xl">
              {lang === "en" 
                ? "Configure the central Nefertiti Hero artwork and the royal brand logo. These settings synchronize instantly for all users."
                : "قم بتعيين لوجو علاماتك التجارية وصورة الهيرو الكبرى لنفرتيتي. تظهر هذه الصورة في المنتصف كعنصر جمالي، بينما يظهر اللوجو في أعلى اليسار وفي الواجهة الرئيسية."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover uploader */}
              <div className="bg-black/20 p-5 rounded-xl border border-amber-900/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-xs uppercase font-mono tracking-wider text-amber-400">
                    {lang === "en" ? "Hero / Cover Image" : "صورة الهيرو / غلاف المنيو"}
                  </span>
                  <span className="text-[10px] text-amber-500/60 font-mono">
                    {lang === "en" ? "Central Artwork" : "الصورة المركزية الكبرى"}
                  </span>
                </div>

                {/* Live Cover Preview */}
                <div className="w-full h-32 rounded-lg overflow-hidden border border-amber-900/30 bg-black/40 relative flex items-center justify-center group">
                  {localConfig.coverUrl ? (
                    <>
                      <img 
                        src={localConfig.coverUrl} 
                        alt="Hero Preview" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/30">
                          {lang === "en" ? "Active Cover" : "مفعل حالياً"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <ImageIcon className="w-8 h-8 text-amber-900/30 mx-auto mb-1" />
                      <span className="text-[10px] font-mono text-amber-500/50 block">
                        {lang === "en" ? "Using default Nefertiti Artwork" : "يتم استخدام صورة نفرتيتي الافتراضية"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    placeholder={lang === "en" ? "Paste image URL or upload file →" : "ضع رابط الصورة أو ارفع ملف من هنا ←"}
                    value={localConfig.coverUrl}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, coverUrl: e.target.value }))}
                    className="flex-1 bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-mono"
                  />

                  <label className="relative flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 active:scale-95 text-amber-50 px-4 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold font-sans shrink-0">
                    {uploadingId === "cover" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{lang === "en" ? "Upload Cover" : "رفع الغلاف"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "cover")}
                      className="hidden"
                      disabled={uploadingId !== null}
                    />
                  </label>
                </div>
              </div>

              {/* Logo uploader */}
              <div className="bg-black/20 p-5 rounded-xl border border-amber-900/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-xs uppercase font-mono tracking-wider text-amber-400">
                    {lang === "en" ? "Brand Logo Image" : "شعار المنيو (اللوجو الرئيسي)"}
                  </span>
                  <span className="text-[10px] text-amber-500/60 font-mono">
                    {lang === "en" ? "Transparent PNG" : "يُفضل بدون خلفية"}
                  </span>
                </div>

                {/* Live Logo Preview */}
                <div className="w-full h-32 rounded-lg border border-amber-900/30 bg-black/40 relative flex items-center justify-center group">
                  {localConfig.logoUrl ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-amber-500/30 bg-[#1e1710] p-1 flex items-center justify-center shadow-lg">
                        <img 
                          src={localConfig.logoUrl} 
                          alt="Logo Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/30">
                        {lang === "en" ? "Active Brand Logo" : "شعار علامة نفرتيتي النشط"}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-amber-950/50 border border-amber-900/30 flex items-center justify-center mx-auto mb-1.5 text-amber-400 font-mono font-bold text-xs">
                        NFRT
                      </div>
                      <span className="text-[10px] font-mono text-amber-500/50 block">
                        {lang === "en" ? "Using default NFRT Text" : "يتم استخدام نص شعار نفرتيتي"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    placeholder={lang === "en" ? "Paste logo URL or upload file →" : "ضع رابط اللوجو أو ارفع ملف من هنا ←"}
                    value={localConfig.logoUrl || ""}
                    onChange={(e) => setLocalConfig(prev => ({ ...prev, logoUrl: e.target.value }))}
                    className="flex-1 bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-mono"
                  />

                  <label className="relative flex items-center justify-center gap-2 bg-amber-800 hover:bg-amber-700 active:scale-95 text-amber-50 px-4 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold font-sans shrink-0">
                    {uploadingId === "logo" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{lang === "en" ? "Upload Logo" : "رفع اللوجو"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "logo")}
                      className="hidden"
                      disabled={uploadingId !== null}
                    />
                  </label>
                </div>
              </div>

              {/* Story / Poetic Welcome Text customizer */}
              <div className="md:col-span-2 bg-black/20 p-5 rounded-xl border border-amber-900/20 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="block text-xs uppercase font-mono tracking-wider text-amber-400">
                    {lang === "en" ? "Poetic Welcome Message / Restaurant Story" : "رسالة الترحيب وقصة المطعم (أسفل صورة الهيرو)"}
                  </span>
                  <span className="text-[10px] text-amber-500/60 font-mono">
                    {lang === "en" ? "Supports multiple lines" : "يدعم السطور المتعددة والفقرات"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-amber-500/80">
                      {lang === "en" ? "Story (English)" : "القصة (باللغة الإنجليزية)"}
                    </label>
                    <textarea
                      rows={5}
                      placeholder={lang === "en" ? "Enter English story text..." : "أدخل نص القصة بالإنجليزية..."}
                      value={localConfig.storyEn || ""}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, storyEn: e.target.value }))}
                      className="w-full bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-amber-500/80">
                      {lang === "en" ? "Story (Arabic)" : "القصة (باللغة العربية)"}
                    </label>
                    <textarea
                      rows={5}
                      placeholder={lang === "en" ? "Enter Arabic story text..." : "أدخل نص القصة بالعربية..."}
                      value={localConfig.storyAr || ""}
                      onChange={(e) => setLocalConfig(prev => ({ ...prev, storyAr: e.target.value }))}
                      className="w-full bg-black/40 border border-amber-900/40 rounded-xl px-4 py-2.5 text-xs text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-sans text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Dish Cutout Customization System */}
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <h3 className="font-sans font-bold text-sm md:text-base text-amber-100 uppercase tracking-wide">
                  {lang === "en" ? "3. Customize Dishes & Upload Isolated PNGs" : "3. تخصيص صور الأطباق الفردية (بدون خلفية)"}
                </h3>
              </div>
              
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase">
                {lang === "en" ? "Alternating Row Style" : "ربط مباشر بالطبق"}
              </span>
            </div>

            {/* Section tabs for dishes selector */}
            <div className="flex overflow-x-auto no-scrollbar gap-1.5 pb-2 border-b border-amber-900/10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-sans font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryTab === cat.id
                      ? "bg-amber-800 text-amber-50 shadow-md"
                      : "bg-[#1f1710] text-amber-400/60 hover:text-amber-300"
                  }`}
                >
                  {lang === "en" ? cat.nameEn : cat.nameAr}
                </button>
              ))}
            </div>

            {/* List of dishes in active category uploader cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {categories
                .find((c) => c.id === activeCategoryTab)
                ?.items.map((item) => {
                  const currentImage = localConfig.itemImages?.[item.id] || item.image;
                  const isUploaded = !!localConfig.itemImages?.[item.id];
                  
                  return (
                    <div 
                      key={item.id} 
                      className="bg-black/20 p-4 rounded-xl border border-amber-900/10 flex items-center justify-between gap-4 hover:border-amber-900/30 transition-all"
                    >
                      {/* Left: Dish Preview Circle */}
                      <div className="shrink-0 relative group">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-amber-800/30 shadow-md bg-amber-950/25 relative flex items-center justify-center">
                          {currentImage ? (
                            <img 
                              src={currentImage} 
                              alt={item.nameEn} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-amber-800/40" />
                          )}
                        </div>
                        {isUploaded && (
                          <button
                            onClick={() => removeImageOverride(item.id)}
                            className="absolute -top-1 -right-1 bg-red-950 text-red-300 p-1 rounded-full hover:bg-red-900 shadow border border-red-500/30 cursor-pointer"
                            title={lang === "en" ? "Delete upload and restore default placeholder" : "مسح المرفوع واستعادة الافتراضي"}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Right: Dish Info & Uploader Controls */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-xs font-bold text-amber-100 font-sans">
                            {lang === "en" ? item.nameEn : item.nameAr}
                          </h4>
                          <span className="text-[10px] font-mono text-amber-500">{item.price} EGP</span>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder={lang === "en" ? "Paste PNG link..." : "رابط الصورة..."}
                            value={localConfig.itemImages?.[item.id] || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLocalConfig((prev) => ({
                                ...prev,
                                itemImages: {
                                  ...prev.itemImages,
                                  [item.id]: value
                                }
                              }));
                            }}
                            className="flex-1 bg-black/30 border border-amber-900/30 rounded-lg px-2 py-1.5 text-[10px] text-amber-200 placeholder-amber-900/30 focus:outline-none font-mono"
                          />

                          <label className="relative shrink-0 flex items-center justify-center gap-1 bg-amber-950/80 hover:bg-amber-900 text-amber-300 px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-[10px] font-bold font-sans border border-amber-800/40">
                            {uploadingId === item.id ? (
                              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                            ) : (
                              <Upload className="w-3 h-3" />
                            )}
                            <span>{lang === "en" ? "Upload PNG" : "رفع PNG"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, "item", item.id)}
                              className="hidden"
                              disabled={uploadingId !== null}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Bottom Action Footer inside Accordion Panel */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-amber-50 font-sans font-bold py-3 px-6 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer uppercase tracking-wider border border-amber-500/20"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Check className="w-4 h-4" />}
              <span>{isSaved ? (lang === "en" ? "Changes Applied to Applet!" : "تم حفظ التغييرات بنجاح!") : (lang === "en" ? "Apply & Save Settings" : "تطبيق وحفظ التغييرات الإدارية")}</span>
            </button>

            <button
              onClick={fillMockCloudinary}
              className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 py-3 px-4 rounded-xl text-xs transition-all border border-amber-900/30 cursor-pointer flex items-center justify-center gap-1.5"
              title={lang === "en" ? "Load Sample Backgrounds" : "تحميل خلفيات تجريبية"}
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === "en" ? "Load Samples" : "تحميل نماذج تجريبية"}</span>
            </button>

            <button
              onClick={handleReset}
              className="bg-amber-950/40 hover:bg-amber-900/20 text-amber-400/80 hover:text-amber-100 p-3 rounded-xl transition-all border border-amber-900/20 cursor-pointer flex items-center justify-center gap-1.5"
              title={lang === "en" ? "Reset back to defaults" : "إعادة التعيين"}
            >
              <RotateCcw className="w-4 h-4" />
              <span>{lang === "en" ? "Reset" : "إعادة تعيين"}</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
