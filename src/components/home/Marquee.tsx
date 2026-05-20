import React from "react";

export default function Marquee() {
  const items = [
    "Together We Survive",
    "Stronger Together",
    "Unity · Resilience · Progress",
    "You Cannot Squash A Movement",
  ];

  const allItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-ink text-paper py-6 overflow-hidden border-t-4 border-saffron border-b-4 border-green">
      <div className="flex gap-12 whitespace-nowrap w-max animate-marquee font-display text-[20px] sm:text-[26px] lg:text-[32px] tracking-[0.015em]">
        {allItems.map((text, i) => (
          <React.Fragment key={i}>
            <span className="text-saffron-2">
              {text}
            </span>
            <span className="dot text-green-2 text-[22px] self-center">✦</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

