import React from "react";
import Image from "next/image";

export default function Vision() {
  return (
    <section
      id="vision"
      className="py-[80px] lg:py-[110px] border-b-2 border-ink"
      style={{ background: 'linear-gradient(180deg, var(--color-paper) 0%, var(--color-paper-2) 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr] gap-14 lg:gap-20 items-start">

          <div className="flex flex-col items-start">
            <span className="inline-block font-mono text-[11px] tracking-[0.22em] uppercase text-saffron-deep mb-[22px]">
              Chapter One
            </span>
            <h2 className="font-display font-normal text-[clamp(44px,6vw,80px)] leading-[0.92] tracking-[-0.005em] text-ink">
              Our Movement's<br />
              <em className="not-italic italic font-['Georgia',serif] font-normal text-green tracking-[-0.01em]">Vision.</em>
            </h2>
            <p className="font-sans text-[18px] leading-[1.55] max-w-[520px] mb-[38px] text-ink-2 mt-4">
              We are not here to set up another PM CARES, holiday in Davos on the taxpayer's salary slip, or rebrand corruption as "strategic spending." We are here to ask — loudly, repeatedly, in writing — where the money went.
            </p>

            <div className="mt-10 border-2 border-ink bg-paper py-[28px] px-[30px] relative shadow-[8px_8px_0_var(--color-ink)]">
              <span className="inline-block font-mono text-[10.5px] tracking-[0.22em] uppercase text-green bg-paper-2 py-1 px-2.5 border border-green mb-4">
                Our Mission
              </span>
              <p className="font-sans text-[17px] leading-[1.6] text-ink-2">
                Build a party for the young people who keep getting called lazy, chronically online, and — most recently — cockroaches. That's it. That's the mission. The rest is satire.
              </p>
            </div>
          </div>

          <aside className="w-full">
            <div className="border-2 border-ink shadow-[5px_5px_0_var(--color-saffron-deep),5px_5px_0_2px_var(--color-ink)] sm:shadow-[10px_10px_0_var(--color-saffron-deep),10px_10px_0_2px_var(--color-ink)] overflow-hidden bg-paper">
              <img
                decoding="async"
                loading="lazy"
                src="/cockroach_speaking.webp"
                alt="Cockroach Janta Party banner with the crowd raising fists"
                className="w-full h-auto lg:h-full block object-cover border-b-2 border-ink aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto"
              />
              <div className="flex justify-between py-3 px-[18px] font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-2 bg-paper-2">
                <span>Rally · The People's Banner</span>
                <span>16 . 05 . 2026</span>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
}
