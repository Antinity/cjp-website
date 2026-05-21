"use client";

import React, { useEffect, useState } from "react";
import CounterCell from "./CounterCell";

interface HeroProps {
  stats?: {
    members: number;
    visitorsToday: number;
  };
}

export default function Hero({ stats = { members: 0, visitorsToday: 0 } }: HeroProps) {
  const [petitionCount, setPetitionCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/petition.php?action=get");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.count === "number") {
            setPetitionCount(data.count);
          }
        }
      } catch (error) {
        console.error("Failed to fetch petition count in Hero:", error);
      }
    };
    fetchCount();
  }, []);

  return (
    <section className="relative border-b-[3px] border-ink overflow-hidden" data-screen-label="01 Hero">
      <div
        className="absolute inset-0 pointer-events-none before:content-['CJP'] before:absolute before:-bottom-[120px] before:-right-[40px] before:font-display before:text-[520px] before:text-ink before:opacity-5 before:leading-[0.8]"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 85% 15%, rgba(224,101,30,0.12), transparent 60%),
                       radial-gradient(ellipse 50% 50% at 10% 90%, rgba(31,90,46,0.10), transparent 60%)`
        }}
      ></div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px] pt-[40px] lg:pt-[72px] pb-[56px] lg:pb-[90px] grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr] gap-9 lg:gap-16 items-center relative z-2">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-[10px] font-mono text-[11px] tracking-[0.22em] uppercase text-blood mb-[32px] py-[7px] px-[14px] border border-blood rounded-full">
            <span className="w-[7px] h-[7px] rounded-full bg-blood animate-livepulse"></span>
            <span>Party Launch · Live since yesterday</span>
          </div>

          <h1 className="font-display font-normal text-[52px] sm:text-[clamp(58px,9.5vw,138px)] leading-[0.86] tracking-[-0.015em] mb-[28px] text-ink">
            Voice of the<br />
            <span className="text-saffron-deep">Lazy</span> &amp;<br />
            <span className="text-green font-['Georgia',serif] italic tracking-[-0.02em]">Unemployed.</span>
          </h1>

          <p className="font-sans text-[19px] leading-[1.55] max-w-[520px] mb-[38px] text-ink-2">
            A political party for the people the system forgot to count.
            Five demands. Zero sponsors. One large, stubborn swarm.
          </p>

          <div className="flex items-center gap-5 sm:gap-6 mb-14 flex-wrap">
            <a
              href="#join"
              className="bg-saffron-deep text-paper font-condensed text-[14px] font-bold tracking-[0.2em] uppercase py-[18px] px-[32px] border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] transition-all duration-150 inline-flex items-center gap-[14px] group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)]"
            >
              Join the Party
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            <a
              href="/sack"
              className="bg-[#E53E3E] hover:bg-[#F55252] text-paper font-condensed tracking-[0.1em] py-[12px] px-[24px] border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] transition-all duration-150 flex flex-col items-start gap-0.5 group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)] relative overflow-hidden"
            >
              <div className="flex items-center gap-[8px] flex-wrap sm:flex-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-gold animate-livepulse flex-shrink-0"></span>
                <span className="font-bold text-[14px] sm:text-[16px] uppercase tracking-[0.15em] text-paper leading-tight">
                  Sack the Education Minister
                </span>
                {petitionCount > 0 && (
                  <span className="bg-ink text-gold font-mono text-[10px] tracking-normal font-bold px-2 py-[2px] rounded-full border border-gold/20 ml-2">
                    {petitionCount.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="font-sans text-[11px] font-medium tracking-[0.05em] text-paper/80 flex items-center gap-1.5 pl-[18px]">
                <span>File the petition!</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">➔</span>
              </div>
            </a>

            <a
              href="#manifesto"
              className="font-condensed text-[14px] font-medium tracking-[0.2em] uppercase text-ink border-b border-ink pb-[6px] transition-colors duration-200 hover:text-saffron-deep hover:border-saffron-deep"
            >
              Read the Manifesto
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-[18px] border-t border-[rgba(26,17,8,0.2)] pt-[22px] w-full">
            <div className="flex flex-col gap-[6px] pr-[18px] border-r border-[rgba(26,17,8,0.12)]">
              <strong className="font-display text-[28px] sm:text-[36px] font-normal text-ink leading-none">5</strong>
              <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-3">Demands</span>
            </div>
            <div className="flex flex-col gap-[6px] pr-[18px] lg:border-r border-[rgba(26,17,8,0.12)] border-r-0 lg:border-r-[rgba(26,17,8,0.12)]">
              <strong className="font-display text-[28px] sm:text-[36px] font-normal text-ink leading-none">0</strong>
              <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-3">Corporate donors</span>
            </div>
             <div className="flex flex-col gap-[6px] pr-[18px] border-r border-[rgba(26,17,8,0.12)]">
              <strong className="font-display text-[28px] sm:text-[36px] font-normal text-ink leading-none">∞</strong>
              <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-3">Patience</span>
            </div>
            <div className="flex flex-col gap-[6px] pr-[18px]">
              <strong className="font-display text-[28px] sm:text-[36px] font-normal text-ink leading-none">1</strong>
              <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-ink-3">Founder, no PA</span>
            </div>
            <CounterCell
              value={stats.members}
              label="Members"
              isLive={true}
              endpoint="/api/members.php?action=get"
            />
            <CounterCell
              value={stats.visitorsToday}
              label="Visitors"
              endpoint="/api/counter.php?action=increment"
            />
          </div>
        </div>

        <div className="relative">
          <div className="bg-paper-2 border-[3px] border-ink relative transform lg:rotate-[1.5deg] shadow-[5px_5px_0_var(--color-ink),5px_5px_0_4px_var(--color-saffron-deep)] lg:shadow-[12px_12px_0_var(--color-ink),12px_12px_0_4px_var(--color-saffron-deep)] overflow-hidden">
            <div className="bg-saffron-deep text-paper py-[10px] px-[18px] font-mono text-[10.5px] tracking-[0.28em] uppercase flex justify-between border-b-2 border-ink">
              <span>Official Poster · No. 001</span>
              <span>★ ★ ★</span>
            </div>
            <img
              decoding="async"
              fetchPriority="high"
              src="/banner.webp"
              alt="Official Poster"
              className="w-full aspect-[1024/1180] object-cover object-top border-b-2 border-ink block"
            />
            <div className="bg-ink text-paper py-[18px] px-[18px] pb-[20px] lg:py-[22px] lg:px-[24px] lg:pb-[26px] text-center">
              <p className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-saffron-2 mb-[12px]">
                Together · Resilient · Unstoppable
              </p>
              <p className="font-display text-[18px] sm:text-[22px] leading-[1.15] text-paper tracking-[-0.005em]">
                &quot;They tried to step on us.<br />We came back.&quot;
              </p>
            </div>
          </div>

          <span className="absolute top-[40px] lg:top-[56px] -right-[22px] lg:-right-[28px] transform rotate-[15deg] bg-blood text-paper py-[6px] px-[22px] lg:py-[8px] lg:px-[32px] font-condensed font-bold text-[12px] sm:text-[15px] tracking-[0.22em] uppercase border-2 border-paper shadow-[0_0_0_2px_var(--color-blood)] z-3">
            Approved
          </span>
        </div>
      </div>
    </section>
  );
}
