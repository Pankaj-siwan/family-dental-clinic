"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaClock,
  FaDirections,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTooth,
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
};

const clinics: Clinic[] = [
  {
    id: "siwan",
    name: "Family Dental Clinic & Implant Center",
    shortName: "Siwan Main Clinic",
    location: "Siwan",
    address: "Fatehpur Bypass Road, in front of RC Complex, Siwan, Bihar",
    timingLines: ["Open every day", "9:00 AM – 8:00 PM"],
    bookingNote: "Walk-in and prior appointment booking available.",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl:
      "https://google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/data=!4m2!3m1!1s0x0:0xf214d56c0ebefe53?sa=X&ved=1t:2428&ictx=111",
    accentLabel: "Main Branch",
  },
  {
    id: "andar",
    name: "Family Dental Clinic & Implant Center",
    shortName: "Andar Clinic",
    location: "Andar",
    address: "Andar, Siwan district, Bihar",
    timingLines: ["Monday, Wednesday & Friday", "11:00 AM – 3:00 PM"],
    bookingNote:
      "Prior appointment is necessary for better patient management.",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Family+Dental+Clinic+and+Implant+Center+Andar+Siwan+Bihar",
    accentLabel: "Appointment Required",
  },
  {
    id: "anita",
    name: "Dr. Anita Dental Clinic & Implant Center",
    shortName: "Gaushala Road Clinic",
    location: "Gaushala Road, Siwan",
    address: "Gaushala Road, near DAV Public School, Siwan, Bihar",
    timingLines: [
      "Monday – Saturday: 9:00 AM – 6:00 PM",
      "Sunday: 9:00 AM – 1:00 PM",
    ],
    bookingNote: "Separate appointment booking available for this clinic.",
    phone: "+918217553430",
    whatsapp: "918217553430",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Dr.+Anita+Dental+Clinic+and+Implant+Center+Gaushala+Road+Siwan",
    accentLabel: "Dr. Anita Clinic",
  },
];

export default function Clinics() {
  const [selectedClinicId, setSelectedClinicId] =
    useState<ClinicId | null>(null);

  const selectedClinic = useMemo(
    () => clinics.find((clinic) => clinic.id === selectedClinicId) ?? null,
    [selectedClinicId],
  );

  const handleBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedClinic) return;

    const formData = new FormData(event.currentTarget);
    const patientName = String(formData.get("patientName") || "").trim();
    const mobile = String(formData.get("mobile") || "").trim();
    const concern = String(formData.get("concern") || "").trim();
    const preferredDate = String(formData.get("preferredDate") || "").trim();
    const preferredTime = String(formData.get("preferredTime") || "").trim();

    const message = [
      `Hello, I would like to book an appointment at ${selectedClinic.name}, ${selectedClinic.location}.`,
      "",
      `Patient name: ${patientName}`,
      `Mobile: ${mobile}`,
      `Dental concern: ${concern}`,
      `Preferred date: ${preferredDate}`,
      `Preferred time: ${preferredTime}`,
      "",
      "Please confirm the available appointment slot.",
    ].join("\n");

    window.open(
      `https://wa.me/${selectedClinic.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section className={styles.section} id="clinics">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaMapMarkerAlt />
            Our Clinics
          </span>

          <h2>
            Trusted dental care across
            <span> three convenient locations</span>
          </h2>

          <p>
            Choose the clinic nearest to you, review its timings, get
            directions, and use its dedicated booking portal.
          </p>
        </div>

        <div className={styles.grid}>
          {clinics.map((clinic, index) => (
            <article className={styles.card} key={clinic.id}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  <FaTooth />
                </div>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <span className={styles.branchLabel}>{clinic.accentLabel}</span>
              <h3>{clinic.name}</h3>
              <strong className={styles.location}>{clinic.location}</strong>

              <div className={styles.infoBlock}>
                <FaMapMarkerAlt />
                <p>{clinic.address}</p>
              </div>

              <div className={styles.infoBlock}>
                <FaClock />
                <div>
                  {clinic.timingLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>

              <div className={styles.bookingNote}>
                <FaCalendarCheck />
                <p>{clinic.bookingNote}</p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.bookButton}
                  onClick={() => setSelectedClinicId(clinic.id)}
                >
                  <FaCalendarCheck />
                  Book Appointment
                </button>

                <a className={styles.callButton} href={`tel:${clinic.phone}`}>
                  <FaPhoneAlt />
                  Call
                </a>

                <a
                  className={styles.directionButton}
                  href={clinic.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDirections />
                  Directions
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedClinic && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setSelectedClinicId(null)}
        >
          <form
            className={styles.bookingModal}
            onSubmit={handleBooking}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedClinicId(null)}
              aria-label="Close appointment booking"
            >
              ×
            </button>

            <span className={styles.modalLabel}>Appointment Portal</span>
            <h3>{selectedClinic.shortName}</h3>
            <p className={styles.modalAddress}>{selectedClinic.address}</p>

            <div className={styles.scheduleBox}>
              <FaClock />
              <div>
                {selectedClinic.timingLines.map((line) => (
                  <strong key={line}>{line}</strong>
                ))}
              </div>
            </div>

            {selectedClinic.id === "andar" && (
              <div className={styles.importantNote}>
                Prior appointment is required at the Andar clinic for better
                patient management.
              </div>
            )}

            <div className={styles.formGrid}>
              <label>
                Patient name *
                <input name="patientName" required />
              </label>

              <label>
                Mobile number *
                <input name="mobile" type="tel" inputMode="numeric" required />
              </label>

              <label className={styles.fullWidth}>
                Dental concern *
                <textarea
                  name="concern"
                  required
                  placeholder="Example: tooth pain, swelling, implant consultation"
                />
              </label>

              <label>
                Preferred date *
                <input name="preferredDate" type="date" required />
              </label>

              <label>
                Preferred time *
                <input name="preferredTime" type="time" required />
              </label>
            </div>

            <button type="submit" className={styles.whatsappSubmit}>
              <FaWhatsapp />
              Send Booking Request on WhatsApp
            </button>

            <small>
              The requested slot is confirmed only after the clinic responds.
            </small>
          </form>
        </div>
      )}
    </section>
  );
}
