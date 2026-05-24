export default function Home() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center px-6"
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.37), rgba(0,0,0,0.54)), url('/home/hero.webp')",
        backgroundColor: "black",
      }}
    >
      <div className="flex flex-col items-center max-w-6xl mb-48">
        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-[128px] leading-[0.95] tracking-wide text-black text-center uppercase select-none">
          &ldquo;THIS COULD CHANGE<br />INDIA FOREVER&rdquo;
        </h1>
        <p className="font-sans text-lg sm:text-lg md:text-xl text-black/60 text-center max-w-2xl font-medium leading-relaxed">
          A movement built by the generation tired of being<br />ignored, unemployed, and spoken down.
        </p>
      </div>

      <div className="absolute bottom-12 left-12 w-xl space-y-1 bg-black/10 backdrop-blur-sm px-6 py-8 rounded-xl cursor-pointer hover:bg-black/20 transition-all">
        <div className="flex items-center gap-4">
          {/* red dot */}
          <div className="rounded-full h-4 w-4 bg-red-600"></div>
          <div>
            <p className="text-white font-semibold">Activity I</p>
            <p className="text-white font-semibold">Petition for resignation of Dharmendra Pradhan</p>
          </div>
        </div>
        <p className="text-xs text-white/70 pl-8">May 22, 2026 • 500K+ Signed</p>
        <p className="text-white/90 pl-8 text-sm">We demand the resignation of the Education Minister of India for failing a generation of students. From exam mismanagement and unemployment anxiety to policy failures and institutional silence, students deserve accountability, not excuses.</p>
      </div>

    </div>
  );
}
