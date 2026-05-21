import React from "react";

export default function Nav() {
  return (
    <header className="bg-[rgba(244,235,215,0.94)] backdrop-blur-[8px] border-b-2 border-ink sticky top-0 z-[100]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px] py-4 grid grid-cols-[1fr_auto] lg:grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-10">
        
        <a href="/" className="flex items-center gap-[14px]">
          <span className="w-12 h-12 grid place-items-center">
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
              <circle cx="32" cy="32" r="29" fill="none" stroke="#E0651E" strokeWidth="3" strokeDasharray="46 1000" transform="rotate(-90 32 32)"></circle>
              <circle cx="32" cy="32" r="29" fill="none" stroke="#1F5A2E" strokeWidth="3" strokeDasharray="46 1000" transform="rotate(30 32 32)"></circle>
              <circle cx="32" cy="32" r="29" fill="none" stroke="#2A1A10" strokeWidth="0.8"></circle>
              <ellipse cx="32" cy="36" rx="11" ry="16" fill="#5A2F12"></ellipse>
              <ellipse cx="32" cy="25" rx="7" ry="6" fill="#5A2F12"></ellipse>
              <path d="M28 17 Q22 10 18 8 M36 17 Q42 10 46 8" stroke="#2A1A10" strokeWidth="1.6" fill="none" strokeLinecap="round"></path>
              <rect x="26" y="23" width="12" height="3.5" rx="1" fill="#0a0807"></rect>
            </svg>
          </span>
          <span className="flex flex-col gap-[6px] leading-none">
            <span className="font-display text-[14px] sm:text-[16px] tracking-[0.01em] leading-[0.94] text-ink">
              COCKROACH<br />JANTA PARTY
            </span>
            <span className="hidden sm:block font-mono text-[10px] tracking-[0.16em] uppercase text-saffron-deep">
              कॉकरोच जनता पार्टी · Est. 2026
            </span>
          </span>
        </a>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="list-none flex justify-center gap-[36px]">
            {['Vision', 'Manifesto', 'Eligibility', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`/#${item.toLowerCase()}`} 
                  className="font-condensed text-[14px] font-medium tracking-[0.18em] uppercase text-ink py-[6px] relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-saffron after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:text-saffron-deep hover:after:scale-x-100"
                >
                  {item}
                </a>
              </li>
            ))}
            <li>
              <a 
                href="/volunteer" 
                className="font-condensed text-[14px] font-medium tracking-[0.18em] uppercase text-ink py-[6px] relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-saffron after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:text-saffron-deep hover:after:scale-x-100"
              >
                VOLUNTEER
              </a>
            </li>
          </ul>
        </nav>

        <a 
          href="/#eligibility"
          className="bg-ink text-paper font-condensed text-[11px] sm:text-[12px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase px-[14px] py-[9px] sm:px-[22px] sm:py-[12px] border-2 border-ink transition-all duration-150 hover:bg-saffron-deep hover:border-saffron-deep hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0_var(--color-ink)]"
        >
          Join the Party
        </a>
      </div>
    </header>
  );
}
