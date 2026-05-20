import React from "react";

export default function Manifesto() {
  const demands = [
    {
      num: "01",
      text: (
        <>
          If the CJP comes in power, <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>no Chief Justice shall be granted a Rajya Sabha seat</strong> as a post-retirement reward.
        </>
      )
    },
    {
      num: "02",
      text: (
        <>
          If any legit vote is deleted, whether in a CJP or opposition-ruled state, the <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>CEC shall be arrested under UAPA</strong>, as taking away voting rights of citizens is no less than terrorism.
        </>
      )
    },
    {
      num: "03",
      text: (
        <>
          <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>Women shall receive 50% reservation, not 33%</strong>, without increasing the strength of Parliament. Additionally, <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>50% of all Cabinet positions</strong> shall be reserved for women.
        </>
      )
    },
    {
      num: "04",
      text: (
        <>
          All media houses owned by <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>Ambani and Adani shall have their licences cancelled</strong> to make way for truly independent media. Bank accounts of Godi media anchors shall be investigated.
        </>
      )
    },
    {
      num: "05",
      text: (
        <>
          Any MLA or MP who defects from one party to another shall be <strong className="text-paper font-bold px-0.5" style={{ background: 'linear-gradient(180deg, transparent 62%, rgba(224,101,30,0.45) 62%)' }}>barred from contesting elections — and from holding any public office — for a period of 20 years</strong>.
        </>
      )
    }
  ];

  return (
    <section 
      id="manifesto" 
      className="bg-ink text-paper py-[80px] lg:py-[120px] relative overflow-hidden border-b-2 border-ink"
    >
      <div 
        className="absolute -top-[200px] -left-[200px] w-[700px] h-[700px] opacity-[0.22] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-saffron-deep), transparent 70%)' }}
      ></div>
      <div 
        className="absolute -bottom-[200px] -right-[200px] w-[700px] h-[700px] opacity-[0.22] pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-green), transparent 70%)' }}
      ></div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px] relative z-2">
        
        <div className="text-center mb-[72px] relative z-2">
          <span className="inline-block font-mono text-[11px] tracking-[0.22em] uppercase text-saffron-2 mb-[22px]">
            The Five Demands
          </span>
          <h2 className="font-display font-normal text-[clamp(44px,6vw,80px)] leading-[0.92] tracking-[-0.005em] text-paper">
            The Manifesto.
          </h2>
          <p className="font-sans text-[18px] leading-[1.55] text-[rgba(244,235,215,0.78)] max-w-[560px] mx-auto mt-6">
            Read it once. Read it twice. Then send it to someone who needs to read it.
          </p>
        </div>

        <ul className="list-none grid gap-0 max-w-[980px] mx-auto relative z-2 border-t border-[rgba(244,235,215,0.18)]">
          {demands.map((demand, i) => (
            <li 
              key={i} 
              className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] lg:grid-cols-[140px_1fr] gap-[18px] sm:gap-[24px] lg:gap-[36px] py-[36px] border-b border-[rgba(244,235,215,0.18)] items-start transition-all duration-250 hover:px-4 hover:bg-[rgba(224,101,30,0.07)]"
            >
              <span className="font-display text-[44px] sm:text-[60px] lg:text-[88px] leading-[0.85] text-saffron-2 tracking-[-0.02em]">
                {demand.num}
              </span>
              <div className="font-sans text-[16.5px] sm:text-[18px] lg:text-[21px] leading-[1.5] text-[rgba(244,235,215,0.92)] font-normal pt-[10px] lg:pt-[16px]">
                {demand.text}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
