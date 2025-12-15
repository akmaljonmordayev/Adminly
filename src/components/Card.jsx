import React from "react";

function Card({ ish, price, percentage, icon: Icon, gradient }) {
  return (
    <div
      className={`w-72 h-44 rounded-2xl p-5 text-white relative overflow-hidden ${gradient}`}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20"></div>
      <div className="absolute bottom-0 right-10 w-24 h-24 rounded-full bg-white/10"></div>

      {/* Icon */}
      {Icon && (
        <div className="absolute top-5 right-5 bg-white/20 p-2 rounded-lg backdrop-blur-sm">
          <Icon size={20} />
        </div>
      )}

      {/* Content */}
      <h3 className="text-sm font-medium opacity-90">{ish}</h3>
      <p className="text-3xl font-bold mt-7">{price}</p>
      <p className="text-sm mt-7 opacity-90">{percentage}</p>
    </div>
  );
}

export default Card;
