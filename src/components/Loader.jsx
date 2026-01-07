import React from 'react'

function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Tashqi aylanuvchi halqa */}
        <div className="absolute w-32 h-32 border-4 border-t-cyan-500 border-b-cyan-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>

        {/* O'rtadagi pulsatsiya qiluvchi halqa */}
        <div className="absolute w-24 h-24 border-2 border-cyan-400/30 rounded-full animate-ping"></div>

        {/* Ichki qarama-qarshi aylanuvchi halqa */}
        <div className="absolute w-20 h-20 border-2 border-r-cyan-300 border-l-cyan-300 border-t-transparent border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>

        {/* Markaziy nuqta va nur */}
        <div className="relative w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse"></div>
      </div>

      {/* Matn qismi */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <span className="text-cyan-400 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
          Loading Data
        </span>
        {/* Yuklanish chizig'i (progress bar ko'rinishida) */}
        <div className="w-32 h-[2px] bg-slate-800 overflow-hidden rounded-full">
          <div className="w-full h-full bg-cyan-500 -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        </div>
      </div>

      {/* Tailwind configga qo'shimcha shimmer animatsiyasi kerak bo'lsa yoki inline style bilan: */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `,
        }}
      />
    </div>
  )
}

export default Loader
