import React from "react";

function Card({ title, value, icon, color }) {
  const colors = {
    cyan: "text-cyan-400 bg-cyan-400/30",
    purple: "text-purple-400 bg-purple-400/30",
    red: "text-red-400 bg-red-400/30",
    blue: "text-blue-400 bg-blue-400/30",
    yellow: "text-yellow-400 bg-yellow-400/30",
    green: "text-emerald-400 bg-emerald-400/30",
  };

  return (
    <div
      className="
        min-w-[260px] h-[140px]
        relative rounded-2xl p-5
        bg-white/10 border border-white/10
        backdrop-blur-xl
        shadow-[0_0_25px_rgba(0,0,0,0.7)]
        hover:scale-[1.04] transition-all duration-300
      "
    >
      <div
        className={`absolute inset-0 blur-2xl opacity-20 ${colors[color]}`}
      ></div>

      <div className=" relative flex justify-between gap-2 items-center h-full">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
        </div>

        <div className={`absolute bottom-20 left-50 opacity-100 text-4xl p-4 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default Card;
