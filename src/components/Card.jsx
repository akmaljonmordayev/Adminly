import React from "react";

const colors = {
  cyan: "from-cyan-400 to-cyan-600",
  purple: "from-purple-400 to-purple-600",
  red: "from-red-400 to-red-600",
  blue: "from-blue-400 to-blue-600",
  yellow: "from-yellow-400 to-yellow-600",
};

function Card({ title, value, icon, color }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
      <div
        className={`absolute -top-5 -right-5 bg-gradient-to-br ${colors[color]} text-white p-4 rounded-2xl text-2xl shadow-lg`}
      >
        {icon}
      </div>

      <p className="text-sm text-gray-400 mt-6">{title}</p>
      <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    </div>
  );
}

export default Card;
