import TopStrip from "@/components/home/TopStrip";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import VolunteerForm from "@/components/volunteer/VolunteerForm";

export const metadata = {
  title: "Volunteer | Cockroach Janata Party",
  description: "Get Off Your Couch Youth Suggestion & Labor Form. Donate your skills and time to the CJP.",
};

export default function VolunteerPage() {
  return (
    <>
      <TopStrip />
      <Nav />
      <main>
        <VolunteerForm />
      </main>
      <Footer />
    </>
  );
}
