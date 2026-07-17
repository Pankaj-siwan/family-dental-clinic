"use client";

import { FormEvent, useMemo, useState } from "react";
import { FaCalendarCheck, FaClock, FaDirections, FaMapMarkerAlt, FaPhoneAlt, FaTooth, FaWhatsapp } from "react-icons/fa";
import styles from "@/styles/Clinics.module.css";

type ClinicId = "siwan" | "andar" | "anita";

const clinics = [
  {
    id: "siwan" as ClinicId,
    name: "Family Dental Clinic & Implant Center",
    location: "Siwan — सीवान",
    address: "Fatehpur Bypass Road, in front of RC Complex, Siwan, Bihar",
    timings: ["Open every day — प्रतिदिन खुला", "9:00 AM – 8:00 PM"],
    note: "Walk-in and prior appointment booking available.",
    hindiNote: "वॉक-इन एवं पूर्व अपॉइंटमेंट दोनों उपलब्ध हैं।",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl: "https://google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/data=!4m2!3m1!1s0x0:0xf214d56c0ebefe53"
  },
  {
    id: "andar" as ClinicId,
    name: "Family Dental Clinic & Implant Center",
    location: "Andar — आंदर",
    address: "Andar, Siwan district, Bihar",
    timings: ["Monday, Wednesday & Friday — सोमवार, बुधवार और शुक्रवार", "11:00 AM – 3:00 PM"],
    note: "Prior appointment is necessary for better patient management.",
    hindiNote: "मरीजों के बेहतर प्रबंधन के लिए पूर्व अपॉइंटमेंट आवश्यक है।",
    phone: "+918618528975",
    whatsapp: "918618528975",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Family+Dental+Clinic+Andar+Siwan"
  },
  {
    id: "anita" as ClinicId,
    name: "Dr. Anita Dental Clinic & Implant Center",
    location: "Gaushala Road, Siwan — गौशाला रोड, सीवान",
    address: "Gaushala Road, near DAV Public School, Siwan, Bihar",
    timings: ["Monday–Saturday: 9:00 AM – 6:00 PM", "सोमवार–शनिवार: सुबह 9 से शाम 6 बजे", "Sunday: 9:00 AM – 1:00 PM — रविवार: सुबह 9 से दोपहर 1 बजे"],
    note: "Separate appointment booking available for this clinic.",
    hindiNote: "इस क्लिनिक के लिए अलग अपॉइंटमेंट सुविधा उपलब्ध है।",
    phone: "+918217553430",
    whatsapp: "918217553430",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Dr+Anita+Dental+Clinic+Gaushala+Road+Siwan"
  }
];

export default function Clinics() {
  const [selectedId, setSelectedId] = useState<ClinicId | null>(null);
  const selected = useMemo(() => clinics.find(c => c.id === selectedId) || null, [selectedId]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const data = new FormData(e.currentTarget);
    const msg = [
      `Appointment request for ${selected.name}, ${selected.location}`,
      `अपॉइंटमेंट अनुरोध: ${selected.name}, ${selected.location}`,
      `Patient / मरीज: ${data.get("name")}`,
      `Mobile / मोबाइल: ${data.get("mobile")}`,
      `Concern / समस्या: ${data.get("concern")}`,
      `Date / तारीख: ${data.get("date")}`,
      `Time / समय: ${data.get("time")}`,
      "Please confirm the available slot. कृपया उपलब्ध समय की पुष्टि करें।"
    ].join("\n");
    window.open(`https://wa.me/${selected.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <section className={styles.section} id="clinics">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}><FaMapMarkerAlt />Our Clinics — हमारे क्लिनिक</span>
          <h2>Trusted dental care across<span> three convenient locations</span></h2>
          <p>तीन सुविधाजनक स्थानों पर विश्वसनीय दंत चिकित्सा। अपने नजदीकी क्लिनिक का चयन करें।</p>
        </div>

        <div className={styles.grid}>
          {clinics.map((clinic, i) => (
            <article className={styles.card} key={clinic.id}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}><FaTooth /></div>
                <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{clinic.name}</h3>
              <strong className={styles.location}>{clinic.location}</strong>

              <div className={styles.infoBlock}><FaMapMarkerAlt /><p>{clinic.address}</p></div>
              <div className={styles.infoBlock}><FaClock /><div>{clinic.timings.map(t => <p key={t}>{t}</p>)}</div></div>

              <div className={styles.bookingNote}>
                <FaCalendarCheck />
                <div><p>{clinic.note}</p><p className={styles.hindiNote}>{clinic.hindiNote}</p></div>
              </div>

              <div className={styles.actions}>
                <button className={styles.bookButton} onClick={() => setSelectedId(clinic.id)}>
                  <FaCalendarCheck /><span>Book Appointment<small>अपॉइंटमेंट बुक करें</small></span>
                </button>
                <a className={styles.callButton} href={`tel:${clinic.phone}`}><FaPhoneAlt /><span>Call<small>कॉल करें</small></span></a>
                <a className={styles.directionButton} href={clinic.mapUrl} target="_blank" rel="noopener noreferrer"><FaDirections /><span>Directions<small>रास्ता देखें</small></span></a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedId(null)}>
          <form className={styles.bookingModal} onSubmit={submit} onClick={e => e.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={() => setSelectedId(null)}>×</button>
            <span className={styles.modalLabel}>Appointment Portal — अपॉइंटमेंट पोर्टल</span>
            <h3>{selected.location}</h3>
            <div className={styles.scheduleBox}><FaClock /><div>{selected.timings.map(t => <strong key={t}>{t}</strong>)}</div></div>

            <div className={styles.formGrid}>
              <label>Patient name — मरीज का नाम *<input name="name" required /></label>
              <label>Mobile number — मोबाइल नंबर *<input name="mobile" required /></label>
              <label className={styles.fullWidth}>Dental concern — दाँतों की समस्या *<textarea name="concern" required /></label>
              <label>Preferred date — पसंदीदा तारीख *<input name="date" type="date" required /></label>
              <label>Preferred time — पसंदीदा समय *<input name="time" type="time" required /></label>
            </div>

            <button className={styles.whatsappSubmit} type="submit"><FaWhatsapp />Send on WhatsApp — व्हाट्सऐप पर भेजें</button>
          </form>
        </div>
      )}
    </section>
  );
}
