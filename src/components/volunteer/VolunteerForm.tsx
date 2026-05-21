"use client";

import React from "react";

export default function VolunteerForm() {
  return (
    <section className="py-[80px] lg:py-[120px] bg-paper min-h-screen border-b-2 border-ink">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <div className="mb-[64px]">
          <h1 className="font-display font-normal text-[clamp(40px,5vw,64px)] leading-[0.92] tracking-[-0.005em] text-ink mb-6">
            "Get Off Your Couch"<br />
            <span className="text-saffron-deep">
              Youth Suggestion &amp; Labor Form
            </span>
          </h1>
          <p className="font-sans text-[18px] leading-[1.55] text-ink-2">
            Look, we know you’re tired. But the country is a mess, and us cockroaches need to do some heavy lifting. CJP will raise the issues that are actually ruining your life, and will demand solutions on your behalf. Not things like chai samosa prices or data plans being just 28 days and not 30, of course.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <iframe 
            src="https://docs.google.com/forms/d/e/1FAIpQLSfbRAw51reJHtk6DN6fDgK66usmw0G6tL76tzSpnszs11xjCg/viewform?embedded=true" 
            width="100%" 
            height="950" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0}
            style={{ maxWidth: "640px", border: "none" }}
            title="Volunteer Form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </section>
  );
}
