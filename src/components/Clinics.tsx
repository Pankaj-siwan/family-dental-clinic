"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaDirections,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/Clinics.module.css";

type ClinicId = "siwan" | "andar" | "anita";

type Clinic = {
  id: ClinicId;
  name: string;
  shortName: string;
  location: string;
  address: string;
  timingLines: string[];
  bookingNote: string;
  phone: string;
  whatsapp: string;
  mapUrl: string;
  accentLabel: string;
  image: string;
};

const clinics: Clinic[] = [
  {
    id: "siwan",
    name: "Family Dental Clinic & Implant Center",
    shortName: "Siwan Main Clinic",
    location: "Fatehpur, Siwan",
    address: "Fatehpur Bypass Road, in front of RC Complex, Siwan, Bihar",
    timingLines: ["Open every day", "9:00 AM – 8:00 PM"],
    bookingNote: "Walk-in and prior appointment booking available.",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl: "https://www.google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/@26.2276268,84.36642,19.58z/data=!4m14!1m7!3m6!1s0x3992fd990899d987:0xf214d56c0ebefe53!2sFAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)!8m2!3d26.227535!4d84.3664122!16s%2Fg%2F11qszln2dm!3m5!1s0x3992fd990899d987:0xf214d56c0ebefe53!8m2!3d26.227535!4d84.3664122!16s%2Fg%2F11qszln2dm?entry=ttu",
    accentLabel: "Main Branch",
    image: "/images/siwan-clinic.jpg",
  },
  {
    id: "andar",
    name: "Family Dental Clinic & Implant Center",
    shortName: "Andar Clinic",
    location: "Andar",
    address: "Andar, Siwan district, Bihar",
    timingLines: ["Monday, Wednesday & Friday", "11:00 AM – 3:00 PM"],
    bookingNote: "Prior appointment is necessary for better patient management.",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl: "https://www.google.com/search?q=FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+Andar+Branch",
    accentLabel: "Appointment Required",
    image: "/images/andar-clinic.webp",
  },
  {
    id: "anita",
    name: "Dr. Anita Dental Clinic & Implant Center",
    shortName: "Gaushala Road Clinic",
    location: "Gaushala Road, Siwan",
    address: "Gaushala Road, near DAV Public School, Siwan, Bihar",
    timingLines: ["Monday – Saturday: 9:00 AM – 6:00 PM", "Sunday: 9:00 AM – 1:00 PM"],
    bookingNote: "Separate appointment booking available for this clinic.",
    phone: "+918217553430",
    whatsapp: "918217553430",
    mapUrl: "https://www.google.com/maps/place/Dr.+Anita+Dental+Clinic+%26+Implant+Center/@26.2292131,84.366198,18.25z/data=!4m20!1m13!4m12!1m4!2m2!1d84.3665047!2d26.2275615!4e1!1m6!1m2!1s0x3992fd9feac63abd:0xa8af3b5f5f2cd075!2sDr.+Anita+Dental+Clinic+%26+Implant+Center,+Gaushala+Rd,+near+DAV+public+School,+Siwan,+Pakri+Bangali,+Bihar+841226!2m2!1d84.3674861!2d26.2295354!3m5!1s0x3992fd9feac63abd:0xa8af3b5f5f2cd075!8m2!3d26.2295221!4d84.3675117!16s%2Fg%2F11n47f11cr?entry=ttu",
    accentLabel: "Dr. Anita Clinic",
    image: "/images/dr-anita-clinic.jpeg",
  },
];

export default function Clinics() {
  const [selectedClinicId, setSelectedClinicId] = useState<ClinicId | null>(null);
  const selectedClinic = useMemo(() => clinics.find((clinic) => clinic.id === selectedClinicId) ?? null, [selectedClinicId]);

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClinic) return;
    const formData = new FormData(event.currentTarget);
    const message = [
      `Hello, I would like to book an appointment at ${selectedClinic.name}, ${selectedClinic.location}.`,
      "",
      `Patient name: ${String(formData.get("patientName") || "").trim()}`,
      `Mobile: ${String(formData.get("mobile") || "").trim()}`,
      `Dental concern: ${String(formData.get("concern") || "").trim()}`,
      `Preferred date: ${String(formData.get("preferredDate") || "").trim()}`,
      `Preferred time: ${String(formData.get("preferredTime") || "").trim()}`,
      "",
      "Please confirm the available appointment slot.",
    ].join("\n");
    window.open(`https://wa.me/${selectedClinic.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={styles.section} id="clinics">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}><FaMapMarkerAlt /> Our Clinics</span>
          <h2>Trusted dental care across <span>three convenient locations</span></h2>
          <p>Explore real photographs of our clinics, check timings, get directions, and book your visit.</p>
        </div>

        <div className={styles.grid}>
          {clinics.map((clinic) => (
            <article className={styles.card} key={clinic.id}>
              <div className={styles.clinicImageWrap}>
                <Image src={clinic.image} alt={`${clinic.shortName} treatment area`} fill sizes="(max-width: 950px) 100vw, 33vw" className={styles.clinicImage} />
                <span className={styles.branchLabel}>{clinic.accentLabel}</span>
              </div>
              <div className={styles.cardBody}>
                <h3>{clinic.name}</h3>
                <strong className={styles.location}>{clinic.location}</strong>
                <div className={styles.infoBlock}><FaMapMarkerAlt /><p>{clinic.address}</p></div>
                <div className={styles.infoBlock}><FaClock /><div>{clinic.timingLines.map((line) => <p key={line}>{line}</p>)}</div></div>
                <div className={styles.bookingNote}><FaCalendarCheck /><p>{clinic.bookingNote}</p></div>
                <div className={styles.actions}>
                  <button type="button" className={styles.bookButton} onClick={() => setSelectedClinicId(clinic.id)}><FaCalendarCheck /> Book Appointment</button>
                  <a className={styles.callButton} href={`tel:${clinic.phone}`}><FaPhoneAlt /> Call</a>
                  <a className={styles.directionButton} href={clinic.mapUrl} target="_blank" rel="noopener noreferrer"><FaDirections /> Directions</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedClinic && (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setSelectedClinicId(null)}>
          <form className={styles.bookingModal} onSubmit={handleBooking} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={() => setSelectedClinicId(null)} aria-label="Close appointment booking">×</button>
            <span className={styles.modalLabel}>Appointment Portal</span>
            <h3>{selectedClinic.shortName}</h3>
            <p className={styles.modalAddress}>{selectedClinic.address}</p>
            <div className={styles.scheduleBox}><FaClock /><div>{selectedClinic.timingLines.map((line) => <strong key={line}>{line}</strong>)}</div></div>
            <div className={styles.formGrid}>
              <label>Patient name *<input name="patientName" required /></label>
              <label>Mobile number *<input name="mobile" type="tel" inputMode="numeric" required /></label>
              <label className={styles.fullWidth}>Dental concern *<textarea name="concern" required placeholder="Example: tooth pain, swelling, implant consultation" /></label>
              <label>Preferred date *<input name="preferredDate" type="date" required /></label>
              <label>Preferred time *<input name="preferredTime" type="time" required /></label>
            </div>
            <button type="submit" className={styles.whatsappSubmit}><FaWhatsapp /> Continue on WhatsApp</button>
          </form>
        </div>
      )}
    </section>
  );
}
