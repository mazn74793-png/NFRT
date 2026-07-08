import React, { useState, useEffect } from "react";
import { MENU_CATEGORIES } from "./data/menu";
import { BackgroundConfig } from "./types";
import BackgroundOverlay from "./components/BackgroundOverlay";
import MenuBook from "./components/MenuBook";
import AdminPanel from "./components/AdminPanel";
import { db } from "./lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Use the generated Nefertiti hero image path
const nfrtHero = "/src/assets/images/nfrt_hero_1783081651507.jpg";

const LOCAL_STORAGE_KEY = "nfrt_menu_config_v2";
const LOCAL_STORAGE_LANG_KEY = "nfrt_lang_v2";

export default function App() {
  const [config, setConfig] = useState<BackgroundConfig>({
    coverUrl: "",
    logoUrl: "",
    backgroundUrl: "",
    brandName: "",
    categoryBackgrounds: {},
    itemImages: {},
    cloudinary: {
      cloudName: "",
      uploadPreset: ""
    }
  });
  
  const [lang, setLang] = useState<"en" | "ar">("ar"); // Default to Arabic as requested

  // Secret Admin Lock states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  // Load configuration from localStorage on mount and register Firestore listener
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
      
      const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
      if (savedLang === "en" || savedLang === "ar") {
        setLang(savedLang);
      }
    } catch (e) {
      console.error("Failed to load local storage config", e);
    }

    // Subscribe to Firestore for real-time brand & layout changes across all users
    const settingsDocRef = doc(db, "settings", "menu_config");
    const unsubscribe = onSnapshot(settingsDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreConfig = snapshot.data() as BackgroundConfig;
        setConfig(firestoreConfig);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(firestoreConfig));
        } catch (e) {
          console.error("Failed to save synced config to local storage", e);
        }
      }
    }, (error) => {
      console.error("Failed to subscribe to Firestore menu settings:", error);
    });

    return () => unsubscribe();
  }, []);

  // Save config when it changes (saves locally and syncs to Firestore)
  const handleConfigChange = async (newConfig: BackgroundConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save local storage config", e);
    }

    try {
      const settingsDocRef = doc(db, "settings", "menu_config");
      await setDoc(settingsDocRef, { 
        ...newConfig, 
        adminPassword: newConfig.adminPassword || config.adminPassword || "nfrt" 
      });
    } catch (e) {
      console.error("Failed to sync config to Firestore:", e);
    }
  };

  // Save language preference
  const handleLangChange = (selectedLang: "en" | "ar") => {
    setLang(selectedLang);
    try {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, selectedLang);
    } catch (e) {
      console.error("Failed to save language preference", e);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = config.adminPassword || "nfrt";
    if (passwordInput === correctPassword) {
      setIsAdminUnlocked(true);
      setShowPasswordModal(false);
      setPasswordError(false);
      setPasswordInput("");
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#251e15] text-amber-950 font-sans overflow-x-hidden select-none">
      
      {/* Background Layer */}
      <BackgroundOverlay 
        customBgUrl={config.backgroundUrl} 
        isCover={true}
      />

      {/* Main Content Booklet Container */}
      <div className="relative min-h-screen flex flex-col justify-between z-10">
        <MenuBook
          categories={MENU_CATEGORIES}
          config={config}
          lang={lang}
          onChangeLang={handleLangChange}
          defaultHeroUrl={nfrtHero}
          onSecretTrigger={() => setShowPasswordModal(true)}
        />
      </div>

      {/* Cloudinary Asset Customizer Panel - rendered only when unlocked */}
      {isAdminUnlocked && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start">
          <div className="w-full max-w-5xl flex justify-between items-center mb-6 mt-2 pb-3 border-b border-amber-900/20">
            <div>
              <h2 className="text-amber-400 font-serif font-bold text-lg md:text-xl uppercase tracking-wider text-left">
                {lang === "en" ? "👑 NFRT ROYAL CONTROL PANEL" : "👑 لوحة التحكم الملكية لنفرتيتي"}
              </h2>
              <p className="text-[10px] text-amber-500/50 uppercase font-mono tracking-widest mt-1 text-left">
                {lang === "en" ? "Live Settings & Direct Image Customizer" : "التحكم المباشر في صور الأطباق والخلفيات"}
              </p>
            </div>
            <button 
              onClick={() => setIsAdminUnlocked(false)}
              className="bg-red-950/80 hover:bg-red-900 border border-red-500/30 text-red-200 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg flex items-center gap-2 active:scale-95"
            >
              <span>✕</span>
              <span>{lang === "en" ? "Close Dashboard" : "إغلاق لوحة التحكم"}</span>
            </button>
          </div>
          
          <div className="w-full">
            <AdminPanel
              config={config}
              categories={MENU_CATEGORIES}
              onChangeConfig={handleConfigChange}
              lang={lang}
            />
          </div>
        </div>
      )}

      {/* Royal Admin Password Entry Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a2217] border border-amber-500/30 p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-6 text-center">
            <div className="space-y-1">
              <h3 className="text-amber-400 font-serif font-bold text-lg md:text-xl uppercase tracking-wider">
                {lang === "en" ? "Royal Authorization" : "تفويض إداري ملكي"}
              </h3>
              <p className="text-[10px] text-amber-100/60 uppercase font-mono tracking-widest">
                {lang === "en" ? "Enter Admin Secret" : "يرجى إدخال كلمة المرور السرية"}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                placeholder={lang === "en" ? "Enter password..." : "أدخل كلمة المرور..."}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className="w-full bg-black/40 border border-amber-900/40 rounded-xl px-4 py-3 text-sm text-center text-amber-100 placeholder-amber-900/30 focus:outline-none focus:border-amber-500 font-mono"
                autoFocus
              />

              {passwordError && (
                <p className="text-xs text-red-400 font-sans">
                  {lang === "en" ? "Incorrect password. Try again!" : "كلمة مرور غير صحيحة. حاول مجدداً!"}
                </p>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError(false);
                    setPasswordInput("");
                  }}
                  className="flex-1 bg-amber-950/40 hover:bg-amber-950/80 text-amber-400 font-serif text-xs py-2.5 rounded-xl border border-amber-900/30 transition-colors cursor-pointer"
                >
                  {lang === "en" ? "Cancel" : "إلغاء"}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-800 hover:bg-amber-700 text-amber-50 font-serif font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {lang === "en" ? "Submit" : "تأكيد"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
