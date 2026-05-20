import React from "react";

export default function Eligibility() {
  const criteria = [
    {
      num: "REQ / 01",
      title: "Unemployed",
      sub: "By force, by choice, or by principle. We don't ask.",
    },
    {
      num: "REQ / 02",
      title: "Lazy",
      sub: "Physically only. The brain may continue to spiral.",
    },
    {
      num: "REQ / 03",
      title: "Chronically online",
      sub: "Minimum 11 hours a day, including bathroom breaks.",
    },
    {
      num: "REQ / 04",
      title: "Can rant professionally",
      sub: "As long as the content is sharp, honest, and points at something that actually matters.",
    },
  ];

  return (
    <section id="join" className="py-[80px] lg:py-[120px] bg-paper border-b-2 border-ink">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px]">
        
        <div className="text-center max-w-[760px] mx-auto mb-[64px]">
          <span className="inline-block font-mono text-[11px] tracking-[0.22em] uppercase text-saffron-deep mb-[22px]">
            Membership
          </span>
          <h2 className="font-display font-normal text-[clamp(44px,6vw,80px)] leading-[0.92] tracking-[-0.005em] text-ink">
            Are you eligible<br />
            to <em className="not-italic italic font-['Georgia',serif] font-normal text-green tracking-[-0.01em]">join?</em>
          </h2>
          <p className="font-sans text-[18px] leading-[1.55] text-ink-2 mt-6 max-w-[560px] mx-auto">
            We do not check religion, caste, or gender. We do, however, have four (4) standards.
          </p>
        </div>

        <ul className="list-none flex flex-col gap-4 max-w-[920px] mx-auto">
          {criteria.map((item, i) => (
            <li 
              key={i} 
              className="flex flex-row items-center gap-4 sm:gap-7 p-[18px_20px] sm:p-[22px_28px] bg-paper-2 border-2 border-ink shadow-[5px_5px_0_var(--color-ink)] transition-all duration-200 cursor-default group hover:bg-paper-3 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[7px_7px_0_var(--color-ink)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0">
                <span className="font-mono text-[11px] tracking-[0.22em] text-saffron-deep font-semibold mb-1 sm:mb-0 sm:w-[110px] lg:w-[140px] shrink-0">
                  {item.num}
                </span>
                <div className="flex flex-col flex-1 min-w-0">
                  <strong className="font-display text-[22px] sm:text-[24px] lg:text-[28px] text-ink tracking-[-0.005em] leading-none">
                    {item.title}
                  </strong>
                  <span className="font-sans text-[14.5px] italic text-ink-2 mt-1.5">
                    {item.sub}
                  </span>
                </div>
              </div>
              <div className="w-[48px] h-[48px] shrink-0 border-2 border-ink rounded-full grid place-items-center text-[22px] text-green bg-paper transition-colors duration-200 group-hover:bg-green group-hover:text-paper">
                ✓
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-[56px] text-center">
          <a href="#contact" className="bg-saffron-deep text-paper font-condensed text-[14px] lg:text-[16px] font-bold tracking-[0.2em] uppercase py-[18px] lg:py-[22px] px-[32px] lg:px-[40px] border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] transition-all duration-150 inline-flex items-center gap-[14px] group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)]">
            Join the Party
            <span className="text-[20px] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
          <p className="mt-6 font-sans text-[14px] italic text-ink-3 leading-[1.6]">
            Membership is free, lifelong, and revocable only by you.<br />
            No fees. No selfies with the leader. No "missed call to register."
          </p>
        </div>

      </div>
    </section>
  );
}
