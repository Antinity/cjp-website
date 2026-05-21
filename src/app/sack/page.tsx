import TopStrip from "@/components/home/TopStrip";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import SackPetition from "@/components/home/SackPetition";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Petition to Sack the Education Minister - CJP",
  description: "Sign the petition to demand accountability.",
};

export default function SackPage() {
  return (
    <>
      <TopStrip />
      <Nav />
      <main className="min-h-[calc(100vh-200px)]">
        <SackPetition />
      </main>
      <Footer />
    </>
  );
}
