"use client";

import React, { useState } from "react";

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    issue: "",
    skills: [] as string[],
    time: "",
  });

  const skillsOptions = [
    "Making deeply unhinged but highly viral memes",
    "Arguing with strangers on the internet",
    "Video editing",
    "Hiding in corners when responsibilities appear",
    "Actual professional skills like coding/lawyer stuff",
  ];

  const timeOptions = [
    "Less than 2 hours a week:.",
    "2 to 5 hours a week:",
    "5 to 10 hours a week: I am currently unemployed or experiencing extreme existential dread.",
    "10+ hours a week: I have completely given up on my personal life. Sign me up.",
    "The \"Emergency Roach Signal\": Only contact me when the group chat is on fire and we need to launch an immediate digital protest."
  ];

  const handleSkillChange = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.skills.length === 0) {
      alert("Please select at least one skill to donate.");
      return;
    }
    alert("Form submitted! Thank you for 2% of your energy.");
  };

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
          {/* Section 1 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                1. Your Name{" "}
                <span className="normal-case font-sans font-normal italic">
                  (Or a cool alias)
                </span>{" "}
                *
              </label>
              <input
                required
                type="text"
                placeholder="____________________________________________"
                className="w-full bg-paper-2 border-2 border-ink p-4 font-sans text-ink placeholder:text-ink-3/30 focus:outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--color-ink)] transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                2. Phone Number{" "}
                <span className="normal-case font-sans font-normal italic">
                  (For when we need to spam you with revolutionary texts)
                </span>{" "}
                *
              </label>
              <input
                required
                type="tel"
                placeholder="____________________________________________"
                className="w-full bg-paper-2 border-2 border-ink p-4 font-sans text-ink placeholder:text-ink-3/30 focus:outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--color-ink)] transition-all"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                3. Email Address{" "}
                <span className="normal-case font-sans font-normal italic">
                  (Which you will probably ignore)
                </span>{" "}
                *
              </label>
              <input
                required
                type="email"
                placeholder="____________________________________________"
                className="w-full bg-paper-2 border-2 border-ink p-4 font-sans text-ink placeholder:text-ink-3/30 focus:outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--color-ink)] transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex flex-col gap-6 border-t-2 border-ink/20 pt-8 mt-2">
            <h2 className="font-display text-[28px] text-ink pb-2">
              Section 2: What's Ruining Your Life This Week?
            </h2>

            <div className="flex flex-col gap-3">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                4. Which youth issue do you want the Cockroach Janata Party to scream about? (Required)
              </label>
              <p className="font-sans text-[14.5px] italic text-ink-3 mb-1">
                Tell us what's keeping you up at night. Is it exam paper leaks? Rent being higher than your self-esteem?
              </p>
              <textarea
                required
                rows={4}
                className="w-full bg-paper-2 border-2 border-ink p-4 font-sans text-ink focus:outline-none focus:-translate-y-1 focus:shadow-[4px_4px_0_var(--color-ink)] transition-all resize-y"
                value={formData.issue}
                onChange={(e) =>
                  setFormData({ ...formData, issue: e.target.value })
                }
              ></textarea>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex flex-col gap-6 border-t-2 border-ink/20 pt-8 mt-2">
            <h2 className="font-display text-[28px] text-ink pb-2">
              Section 3: Mandatory Contribution of Free Labor (Volunteering)
            </h2>
            <p className="font-sans text-[16px] text-ink-2 mb-2">
              Lazy people actually do the most effective work because they find the quickest way to do it. What do you do best?
            </p>

            <div className="flex flex-col gap-4">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                5. What real-world skills do you possess that you can donate to the CJP? (Required)
              </label>
              <p className="font-sans text-[14.5px] italic text-ink-3">
                Examples: Making deeply unhinged but highly viral memes, arguing with strangers on the internet, video editing, hiding in corners when responsibilities appear, or actual professional skills like coding/lawyer stuff.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {skillsOptions.map((skill, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-4 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                    />
                    <div
                      className={`w-6 h-6 mt-0.5 shrink-0 border-2 border-ink flex items-center justify-center transition-colors ${formData.skills.includes(skill)
                        ? "bg-saffron-deep"
                        : "bg-paper-2 group-hover:bg-paper-3"
                        }`}
                    >
                      {formData.skills.includes(skill) && (
                        <span className="text-paper text-[14px] font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-ink-2 leading-snug mt-0.5 text-base sm:text-lg">
                      {skill}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <label className="font-condensed font-bold tracking-[0.1em] uppercase text-ink-2 text-sm sm:text-base">
                6. How much time are you willing to sacrifice for the cause? (Required)
              </label>
              <p className="font-sans text-[14.5px] italic text-ink-3">
                Be honest. Don't lie to us and say 20 hours.
              </p>

              <div className="flex flex-col gap-3 mt-2">
                {timeOptions.map((timeOpt, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-4 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      className="sr-only peer"
                      name="time_sacrifice"
                      value={timeOpt}
                      checked={formData.time === timeOpt}
                      onChange={() =>
                        setFormData({ ...formData, time: timeOpt })
                      }
                      required
                    />
                    <div
                      className={`w-6 h-6 mt-0.5 shrink-0 rounded-full border-2 border-ink flex items-center justify-center transition-colors ${formData.time === timeOpt
                        ? "bg-paper border-saffron-deep"
                        : "bg-paper-2 group-hover:bg-paper-3"
                        }`}
                    >
                      {formData.time === timeOpt && (
                        <div className="w-3 h-3 rounded-full bg-saffron-deep" />
                      )}
                    </div>
                    <span className="font-sans text-ink-2 leading-snug mt-0.5 text-base sm:text-lg">
                      {timeOpt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-paper-3 p-5 sm:p-6 border-l-[6px] border-saffron-deep shadow-[4px_4px_0_var(--color-ink)]">
            <p className="font-sans text-[15px] sm:text-[16px] italic text-ink-2 leading-[1.6]">
              <strong className="font-bold text-ink not-italic">Disclaimer:</strong> By clicking submit, you agree that you have used at least 2% of your daily energy to help the youth of this nation. Good job.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="bg-saffron-deep text-paper font-condensed text-[16px] lg:text-[18px] font-bold tracking-[0.2em] uppercase py-[20px] px-[40px] border-2 border-ink shadow-[6px_6px_0_var(--color-ink)] transition-all duration-150 inline-flex items-center justify-center gap-[14px] w-full sm:w-auto group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)]"
            >
              Submit Before You Change Your Mind
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
