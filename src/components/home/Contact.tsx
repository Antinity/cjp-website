import React from "react";

export default function Contact() {
  return (
    <section id="contact" className="py-[80px] lg:py-[120px] bg-paper border-b-2 border-ink">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-[80px] items-start">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-2 mb-4 block">Get in touch</span>
            <h2 className="font-display font-normal text-[clamp(44px,6vw,80px)] leading-[0.92] tracking-[-0.005em] text-ink mb-4">
              Connect<br />with us.
            </h2>
            <p className="font-sans text-[18px] leading-[1.55] text-ink-2 max-w-[560px]">
              Want to join, volunteer, complain, or send a meme? Use the form. We read everything. We reply to most things.
            </p>

            <ul className="list-none mt-10 flex flex-col gap-[18px]">
              <li className="grid grid-cols-[110px_1fr] gap-6 pb-4 border-b border-[rgba(26,17,8,0.15)] items-baseline">
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-3">Email</span>
                <span className="font-sans text-[16px] text-ink font-medium flex flex-col gap-1">
                  contact@cockroachjantaparty.org
                </span>
              </li>
              <li className="grid grid-cols-[110px_1fr] gap-6 pb-4 border-b border-[rgba(26,17,8,0.15)] items-baseline">
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-3">Press</span>
                <span className="font-sans text-[16px] text-ink font-medium flex flex-col gap-1">
                  contact@cockroachjantaparty.org
                </span>
              </li>
              <li className="grid grid-cols-[110px_1fr] gap-6 pb-4 border-b border-[rgba(26,17,8,0.15)] items-baseline">
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-3">Headquarters</span>
                <span className="font-sans text-[16px] text-ink font-medium flex flex-col gap-1">
                  Wherever the wifi works.
                </span>
              </li>
              <li className="grid grid-cols-[110px_1fr] gap-6 pb-4 border-b border-[rgba(26,17,8,0.15)] items-baseline">
                <span className="font-mono text-[10.5px] tracking-[0.22em] uppercase text-ink-3">Founder</span>
                <span className="font-sans text-[16px] text-ink font-medium flex flex-col gap-1">
                  Abhijeet Dipke
                  <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-ink-3 font-normal">Founder &amp; Convenor</span>
                </span>
              </li>
            </ul>
          </div>

          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSdYx7uN2ozYteN7kK_Ne5a90yxZhrmp_wlhVJGaPhK6SuUmjQ/viewform?embedded=true" 
            width="100%" 
            height="1565" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            className="w-full min-w-0"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
}
