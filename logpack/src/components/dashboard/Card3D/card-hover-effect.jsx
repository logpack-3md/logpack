// src/components/ui/Card3D/card-hover-effect.jsx
import React from "react";

export function HoverEffect({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`
            ${item.cardClass}
            p-6 rounded-lg shadow-lg transition-all duration-300
            hover:scale-105 hover:shadow-xl cursor-pointer
            flex flex-col items-center justify-center text-center
          `}
        >
          <div className="mb-2">{item.icon}</div>
          <h3 className="text-xl font-semibold text-white">{item.title}</h3>
          <p className="text-sm text-white/80">{item.description}</p>
        </div>
      ))}
    </div>
  );
}