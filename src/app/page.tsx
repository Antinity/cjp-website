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

export default function Home() {
  return (
    <>
      <TopStrip />
      <Nav />
      <main>
        <Hero />
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
