import React from "react";
import Image from "next/image";

export default function JoinBanner() {
  return (
    <div className="border-b-2 border-ink bg-paper relative overflow-hidden">
      <img
        decoding="async"
        loading="lazy"
        src="/banner.webp"
        alt="Stronger Together — Become a Member of the Cockroach Janta Party"
        className="w-full block sm:object-fill object-cover max-h-[56vw] sm:max-h-none"
      />
    </div>
  );
}
