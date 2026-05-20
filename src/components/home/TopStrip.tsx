import React from "react";

export default function TopStrip() {
  const items = [
    "Party Launch · Volume 1, Edition 1",
    "Filed under: General Disgruntlement",
    "Sponsored by no one. Funded by nothing.",
    "HQ: Wherever the wifi works",
    "Now accepting rants, retweets, and resentment",
  ];

  // Repeat items to ensure seamless marquee scrolling
  const allItems = [...items, ...items];

  return (
    <div className="bg-ink text-paper font-mono text-[11px] tracking-[0.14em] uppercase py-[9px] overflow-hidden border-b-2 border-saffron">
      <div className="flex gap-[56px] whitespace-nowrap w-max animate-ticker">
        {allItems.map((text, i) => (
          <span key={i} className="flex items-center">
            <span className="text-saffron-2 mr-[12px]">✦</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
