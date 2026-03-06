import React from "react";

function Card({ title, value, icon, color }) {
  const colorMap = {
    cyan: {
      gradient: "from-cyan-500/20 to-cyan-600/5",
      iconBg: "bg-gradient-to-br from-cyan-400/25 to-cyan-500/10",
      iconText: "text-cyan-400",
      border: "border-cyan-500/15 hover:border-cyan-400/30",
      glow: "shadow-cyan-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]",
      line: "from-cyan-500 to-cyan-400",
    },
    purple: {
      gradient: "from-purple-500/20 to-purple-600/5",
      iconBg: "bg-gradient-to-br from-purple-400/25 to-purple-500/10",
      iconText: "text-purple-400",
      border: "border-purple-500/15 hover:border-purple-400/30",
      glow: "shadow-purple-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]",
      line: "from-purple-500 to-purple-400",
    },
    red: {
      gradient: "from-red-500/20 to-red-600/5",
      iconBg: "bg-gradient-to-br from-red-400/25 to-red-500/10",
      iconText: "text-red-400",
      border: "border-red-500/15 hover:border-red-400/30",
      glow: "shadow-red-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]",
      line: "from-red-500 to-red-400",
    },
    blue: {
      gradient: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-gradient-to-br from-blue-400/25 to-blue-500/10",
      iconText: "text-blue-400",
      border: "border-blue-500/15 hover:border-blue-400/30",
      glow: "shadow-blue-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]",
      line: "from-blue-500 to-blue-400",
    },
    yellow: {
      gradient: "from-yellow-500/20 to-yellow-600/5",
      iconBg: "bg-gradient-to-br from-yellow-400/25 to-yellow-500/10",
      iconText: "text-yellow-400",
      border: "border-yellow-500/15 hover:border-yellow-400/30",
      glow: "shadow-yellow-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]",
      line: "from-yellow-500 to-yellow-400",
    },
    green: {
      gradient: "from-emerald-500/20 to-emerald-600/5",
      iconBg: "bg-gradient-to-br from-emerald-400/25 to-emerald-500/10",
      iconText: "text-emerald-400",
      border: "border-emerald-500/15 hover:border-emerald-400/30",
      glow: "shadow-emerald-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      line: "from-emerald-500 to-emerald-400",
    },
    slate: {
      gradient: "from-slate-400/15 to-slate-500/5",
      iconBg: "bg-gradient-to-br from-slate-400/20 to-slate-500/10",
      iconText: "text-slate-400",
      border: "border-slate-500/15 hover:border-slate-400/30",
      glow: "shadow-slate-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(148,163,184,0.2)]",
      line: "from-slate-400 to-slate-300",
    },
    lime: {
      gradient: "from-lime-500/20 to-lime-600/5",
      iconBg: "bg-gradient-to-br from-lime-400/25 to-lime-500/10",
      iconText: "text-lime-400",
      border: "border-lime-500/15 hover:border-lime-400/30",
      glow: "shadow-lime-500/10",
      valueShadow: "drop-shadow-[0_0_12px_rgba(132,204,22,0.3)]",
      line: "from-lime-500 to-lime-400",
    },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div
      className={`
        group relative min-w-0 w-full
        rounded-2xl overflow-hidden
        bg-[var(--card-bg)] border ${c.border}
        shadow-xl ${c.glow}
        hover:shadow-2xl
        hover:scale-[1.02] hover:-translate-y-0.5
        transition-all duration-500 ease-out
        cursor-default
      `}
    >
      {/* Top gradient line */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${c.line} opacity-60 group-hover:opacity-100 transition-opacity`} />

      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />

      {/* Noise overlay */}
      <div className="noise absolute inset-0" />

      {/* Content */}
      <div className="relative p-5 flex flex-col justify-between h-[130px]">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className={`text-[12px] font-black ${c.iconText} uppercase tracking-[0.2em] leading-tight mb-1 drop-shadow-sm`}>
              {title}
            </p>
            <div className={`w-10 h-[3px] bg-gradient-to-r ${c.line} rounded-full mt-1.5 opacity-40`} />
          </div>
          <div className={`w-12 h-12 flex items-center justify-center shrink-0 ${c.iconBg} ${c.iconText} text-xl rounded-xl border border-white/5 shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10`}>
            {icon}
          </div>
        </div>

        <div className="mt-auto">
          <h2 className={`text-3xl xl:text-4xl font-black text-[var(--text-primary)] ${c.valueShadow} transition-all truncate`}>
            {value}
          </h2>
        </div>
      </div>

      {/* Bottom shimmer line */}
      <div className="animate-shimmer h-[1px] w-full" />
    </div>
  );
}

export default Card;
