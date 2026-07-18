import Image from "next/image";
import { FaGraduationCap, FaShieldAlt, FaTooth, FaUserMd } from "react-icons/fa";
import styles from "@/styles/DoctorProfile.module.css";

const doctors = [
  {
    name: "Dr. Pankaj",
    qualification: "MDS",
    role: "Dental Surgeon & Specialist",
    image: "/images/dr-pankaj-official.png",
    focus: "Advanced treatment planning, root canal care, oral surgery and implant dentistry.",
  },
  {
    name: "Dr. Anita Kumari",
    qualification: "BDS",
    role: "Dental Surgeon",
    image: "/images/dr-anita-official.jpg",
    focus: "Family dentistry, preventive care, restorative dentistry and patient-centred treatment.",
  },
];

export default function DoctorProfile() {
  return (
    <section className={styles.section} id="doctor">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}><FaUserMd /> Meet Our Dentists</span>
          <h2>Experienced care guided by <span>trust and precision</span></h2>
          <p>Meet the dentists providing comprehensive dental care across our clinics in and around Siwan.</p>
        </div>

        <div className={styles.doctorGrid}>
          {doctors.map((doctor) => (
            <article className={styles.doctorCard} key={doctor.name}>
              <div className={styles.photoWrap}>
                <Image src={doctor.image} alt={`${doctor.name}, ${doctor.qualification}`} fill sizes="(max-width: 760px) 100vw, 50vw" className={styles.photo} />
              </div>
              <div className={styles.cardContent}>
                <span className={styles.role}>{doctor.role}</span>
                <h3>{doctor.name}</h3>
                <strong><FaGraduationCap /> {doctor.qualification}</strong>
                <p>{doctor.focus}</p>
                <div className={styles.trustLine}><FaShieldAlt /><span>Clear guidance, careful planning and respectful patient care.</span></div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.bottomNote}>
          <FaTooth />
          <div><strong>Complete family dental care</strong><span>Preventive, restorative, surgical and implant treatment under one trusted clinical team.</span></div>
        </div>
      </div>
    </section>
  );
}
