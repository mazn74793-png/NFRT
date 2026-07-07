import React from "react";

interface BackgroundOverlayProps {
  customBgUrl?: string;
  isCover?: boolean;
}

export default function BackgroundOverlay({ customBgUrl, isCover = false }: BackgroundOverlayProps) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 transform-gpu">
      {/* Base Papyrus Color & Texture */}
      <div 
        className="absolute inset-0 bg-[#f4e6cc] transition-colors duration-700"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(253, 244, 227, 0.4) 0%, rgba(220, 200, 165, 0.25) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.035'/%3E%3C/svg%3E")
          `,
        }}
      />

      {/* Papyrus Fibers / Subtle Lines */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(160,120,70,0.06) 1px, transparent 1px),
            linear-gradient(0deg, rgba(160,120,70,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Decorative Golden Egyptian Column Borders on Left/Right */}
      <div className="absolute top-0 bottom-0 left-0 w-8 md:w-16 border-r border-amber-900/10 bg-gradient-to-r from-amber-950/5 to-transparent flex flex-col items-center justify-around py-12 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="text-amber-900/30 text-xs font-mono select-none tracking-widest rotate-90">
            NFRT
          </div>
        ))}
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-8 md:w-16 border-l border-amber-900/10 bg-gradient-to-l from-amber-950/5 to-transparent flex flex-col items-center justify-around py-12 opacity-40">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="text-amber-900/30 text-xs font-mono select-none tracking-widest -rotate-90">
            NFRT
          </div>
        ))}
      </div>

      {/* Faint Egyptian Column Lines / Vertical Lines across background */}
      <div className="absolute inset-0 flex justify-between px-16 md:px-32 opacity-[0.035]">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-full w-[1px] bg-amber-900 border-dashed border-r border-amber-950" />
        ))}
      </div>

      {/* Faint Hieroglyph/Artwork Accents in corners (Eye of Horus & Hieroglyphs) */}
      <div className="absolute top-12 left-12 md:left-24 opacity-15 text-amber-900 w-16 h-16">
        {/* Simple Eye of Horus SVG */}
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10,50 Q45,20 90,50" />
          <path d="M10,50 Q45,80 90,50" />
          <circle cx="48" cy="50" r="14" fill="currentColor" fillOpacity="0.8" />
          <path d="M48,64 L48,85 Q40,88 35,80" />
          <path d="M62,50 Q75,75 55,80" />
          <path d="M35,30 Q45,25 65,30" strokeWidth="4" />
        </svg>
      </div>

      <div className="absolute bottom-12 right-12 md:right-24 opacity-15 text-amber-900 w-16 h-16">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M10,50 Q45,20 90,50" />
          <path d="M10,50 Q45,80 90,50" />
          <circle cx="48" cy="50" r="14" fill="currentColor" fillOpacity="0.8" />
          <path d="M48,64 L48,85 Q40,88 35,80" />
          <path d="M62,50 Q75,75 55,80" />
          <path d="M35,30 Q45,25 65,30" strokeWidth="4" />
        </svg>
      </div>

      {/* Custom User Background Image from Cloudinary (Overlays with customizable opacity) */}
      {customBgUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out z-10"
          style={{ 
            backgroundImage: `url("${customBgUrl}")`,
          }}
        />
      )}

      {/* Vintage vignette shading */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-amber-950/20 z-20 pointer-events-none" />
    </div>
  );
}
