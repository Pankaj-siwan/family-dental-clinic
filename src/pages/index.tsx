import Head from "next/head";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContentRibbon from "@/components/ContentRibbon";
import TrustStrip from "@/components/TrustStrip";
import Treatments from "@/components/Treatments";
import Clinics from "@/components/Clinics";
import CaseHighlights from "@/components/CaseHighlights";
import FromTheDoctors from "@/components/FromTheDoctors";
import GoogleReviews from "@/components/GoogleReviews";
import Appointment from "@/components/Appointment";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";

const siteUrl = "https://www.familydentalsiwan.in";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dentist",
      "@id": `${siteUrl}/#clinic`,
      name: "Family Dental Clinic & Implant Center",
      alternateName: "Family Dental Clinic Siwan",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/images/clinic-logo-official.png`,
      image: [
        `${siteUrl}/images/clinic-front.jpg`,
        `${siteUrl}/images/hero-treatment-room.jpg`,
      ],
      description:
        "Trusted dental clinic in Siwan offering dental implants, root canal treatment, crowns, bridges, fillings, dentures, extractions, wisdom tooth surgery, scaling, polishing and teeth whitening.",
      telephone: "+91-86185-28975",
      email: "familydentalclinic.siwan@gmail.com",
      priceRange: "₹₹",
      medicalSpecialty: "Dentistry",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Shivaji Nagar, Fatehpur Bypass Road, in front of R.C. Complex",
        addressLocality: "Siwan",
        addressRegion: "Bihar",
        postalCode: "841226",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 26.227535,
        longitude: 84.3664122,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "10:30",
          closes: "17:30",
        },
      ],
      areaServed: ["Siwan", "Fatehpur", "Andar"],
      hasMap:
        "https://www.google.com/maps?cid=17443801916793355859",
      sameAs: [
        "https://www.google.com/maps?cid=17443801916793355859",
        "https://www.youtube.com/channel/UCkLt6fDcwJIlK8I2k8aKLqQ",
        "https://www.youtube.com/channel/UCsxsonS_6WkvUG3dYPL5IPQ",
      ],
      employee: [
        { "@id": `${siteUrl}/#dr-pankaj` },
        { "@id": `${siteUrl}/#dr-anita-kumari` },
      ],
      knowsAbout: [
        "Dental implants",
        "Root canal treatment",
        "Oral medicine",
        "Maxillofacial radiology",
        "Wisdom tooth removal",
        "Dental crowns and bridges",
        "Dentures",
        "Teeth whitening",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-86185-28975",
        contactType: "appointments",
        areaServed: "IN-BR",
        availableLanguage: ["English", "Hindi"],
      },
      potentialAction: {
        "@type": "ReserveAction",
        target: `${siteUrl}/#appointment`,
        name: "Book a dental appointment",
      },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#dr-pankaj`,
      name: "Dr. Pankaj",
      honorificPrefix: "Dr.",
      jobTitle: "Dental Surgeon, Oral Medicine and Maxillofacial Radiology Specialist",
      hasCredential: "MDS (Oral Medicine and Maxillofacial Radiology)",
      image: `${siteUrl}/images/dr-pankaj-official.png`,
      worksFor: { "@id": `${siteUrl}/#clinic` },
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#dr-anita-kumari`,
      name: "Dr. Anita Kumari",
      honorificPrefix: "Dr.",
      jobTitle: "Dental Surgeon",
      hasCredential: "BDS",
      image: `${siteUrl}/images/dr-anita-official.jpg`,
      worksFor: { "@id": `${siteUrl}/#clinic` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "Family Dental Clinic & Implant Center",
      publisher: { "@id": `${siteUrl}/#clinic` },
      inLanguage: ["en-IN", "hi-IN"],
    },
  ],
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Dentist in Siwan | Family Dental Clinic &amp; Implant Center</title>
        <meta
          name="description"
          content="Trusted dental clinic in Siwan for implants, root canal treatment, crowns, dentures, extractions and family dentistry. Book with Dr. Pankaj or Dr. Anita."
        />
        <meta
          name="keywords"
          content="dentist in Siwan, dental clinic in Siwan, dental implant in Siwan, root canal treatment in Siwan, wisdom tooth removal in Siwan, dental crown and bridge in Siwan, dentures in Siwan, teeth whitening in Siwan"
        />
        <meta name="author" content="Family Dental Clinic & Implant Center" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={`${siteUrl}/`} />
        <link rel="alternate" hrefLang="en-IN" href={`${siteUrl}/`} />
        <link rel="me" href="https://www.google.com/maps?cid=17443801916793355859" />
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Siwan" />
        <meta name="geo.position" content="26.227535;84.3664122" />
        <meta name="ICBM" content="26.227535, 84.3664122" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Family Dental Clinic & Implant Center" />
        <meta property="og:title" content="Trusted Dentist in Siwan | Family Dental Clinic & Implant Center" />
        <meta property="og:description" content="Dental implants, root canal treatment, crowns, dentures, extractions and complete family dental care in Siwan, Bihar." />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:image" content={`${siteUrl}/images/clinic-front.jpg`} />
        <meta property="og:image:alt" content="Family Dental Clinic & Implant Center in Siwan" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trusted Dentist in Siwan | Family Dental Clinic" />
        <meta name="twitter:description" content="Complete family dental care, dental implants and root canal treatment in Siwan, Bihar." />
        <meta name="twitter:image" content={`${siteUrl}/images/clinic-front.jpg`} />
        <meta name="theme-color" content="#0f766e" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ContentRibbon />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Clinics />
        <FromTheDoctors />
        <Treatments />
        <CaseHighlights />
        <GoogleReviews />
        <Appointment />
        <ContactSection />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
