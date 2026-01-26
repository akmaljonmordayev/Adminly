import React from "react";

function Card({ title, value, icon }) {
  return (
    <div
      className="
        w-80 h-40
        rounded-2xl
        p-6
        bg-white/10
        backdrop-blur-xl
        border border-white/10
        text-white
        relative
        transition-all duration-300
        hover:scale-[1.03]
        hover:bg-white/15
        hover:shadow-2xl
        cursor-pointer
      "
    >
      {/* Icon badge */}
      <div className="absolute top-5 right-5 w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span className="text-lg">{icon}</span>
        <span>{title}</span>
      </div>

      {/* Value */}
      <div className="mt-6 text-4xl font-bold tracking-tight">{value}</div>

      {/* subtle line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}

export default Card;
