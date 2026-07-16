import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clinics from "@/components/Clinics";
import CaseHighlights from "@/components/CaseHighlights";
import Facilities from "@/components/Facilities";
import PatientJourney from "@/components/PatientJourney";
import PaymentOptions from "@/components/PaymentOptions";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import Appointment from "@/components/Appointment";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Clinics />
        <CaseHighlights />
        <Facilities />
        <PatientJourney />
        <PaymentOptions />
        <GoogleReviews />
        <FAQ />
        <Appointment />
        <ContactSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
