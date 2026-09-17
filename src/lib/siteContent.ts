import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

export type SiteContent = {
  ribbonMessages: string[];
  heroEyebrow: string; heroTitle: string; heroAccent: string; heroTagline: string; heroHighlights: string[];
  aboutEyebrow: string; aboutTitle: string; aboutAccent: string; aboutLead: string; aboutBody: string; aboutHighlights: string[];
  doctorsEyebrow: string; doctorsTitle: string; doctorsIntro: string;
  contactEyebrow: string; contactTitle: string; contactAccent: string; contactIntro: string;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  ribbonMessages: ["Complete family dental care", "Three convenient clinic locations", "Dental implants and advanced treatment planning", "Book an appointment online"],
  heroEyebrow: "Trusted dental care in Siwan", heroTitle: "Family Dental Clinic", heroAccent: "& Implant Center",
  heroTagline: "Fulfilling your dental needs in and around Siwan with thoughtful, modern and dependable dental care for every member of your family.",
  heroHighlights: ["Complete family dental care", "Modern treatment planning", "Patient-first clinical approach"],
  aboutEyebrow: "About Our Clinic", aboutTitle: "Compassionate dentistry with a", aboutAccent: "modern clinical approach",
  aboutLead: "Family Dental Clinic & Implant Center is committed to providing dependable dental care in a comfortable and reassuring environment. Every treatment begins with careful examination, honest discussion, and a plan tailored to the patient’s needs.",
  aboutBody: "Our focus is not only on treating dental problems, but also on helping patients understand their oral health and make confident decisions about treatment.",
  aboutHighlights: ["Personalized treatment planning", "Modern and patient-friendly dental care", "Clear explanation before every procedure", "Strict sterilization and hygiene protocols"],
  doctorsEyebrow: "From the Doctors", doctorsTitle: "Reliable guidance, shared personally",
  doctorsIntro: "Written articles, informative videos and photographs from Dr. Pankaj and Dr. Anita—created to help families make better oral-health decisions.",
  contactEyebrow: "Visit Our Clinic", contactTitle: "Find Family Dental Clinic", contactAccent: "& Implant Centre",
  contactIntro: "Use the interactive Google Map for the clinic location, directions, and nearby landmarks. Please call before visiting to confirm the available appointment time.",
};

const ref = () => doc(db, "website_settings", "homepage");
function merge(data: Partial<SiteContent>): SiteContent { return { ...DEFAULT_SITE_CONTENT, ...data }; }
export async function getSiteContent() { const snapshot = await getDoc(ref()); return snapshot.exists() ? merge(snapshot.data() as Partial<SiteContent>) : DEFAULT_SITE_CONTENT; }
export async function saveSiteContent(content: SiteContent) { await setDoc(ref(), content, { merge: true }); }
export function useSiteContent() {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  useEffect(() => onSnapshot(ref(), (snapshot) => { if (snapshot.exists()) setContent(merge(snapshot.data() as Partial<SiteContent>)); }, () => undefined), []);
  return content;
}
