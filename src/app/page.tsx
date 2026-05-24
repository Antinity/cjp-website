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
    </div>
  );
}
