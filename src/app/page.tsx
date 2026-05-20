import TopStrip from "@/components/home/TopStrip";
import Nav from "@/components/home/Nav";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Vision from "@/components/home/Vision";
import Manifesto from "@/components/home/Manifesto";
import Eligibility from "@/components/home/Eligibility";
import JoinBanner from "@/components/home/JoinBanner";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";

async function getStats() {
  const members = 424887; // Static fallback; browser refreshes from Hostinger PHP.
  const visitorsToday = 84200; // Default fallback

  return { members, visitorsToday };
}

export default async function Home() {
  const stats = await getStats();

  return (
    <>
      <TopStrip />
      <Nav />
      <main>
        <Hero stats={stats} />
        <Marquee />
        <Vision />
        <Manifesto />
        <Eligibility />
        <JoinBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
