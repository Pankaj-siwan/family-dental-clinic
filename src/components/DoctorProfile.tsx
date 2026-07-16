import {
  FaCheckCircle,
  FaGraduationCap,
  FaHeartbeat,
  FaShieldAlt,
  FaSmile,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";
import styles from "@/styles/DoctorProfile.module.css";

const expertise = [
  "Root Canal Treatment",
  "Dental Implants",
  "Oral Surgery",
  "Crowns & Bridges",
  "Restorative Dentistry",
  "Family Dental Care",
];

export default function DoctorProfile() {
  return (
    <section className={styles.section} id="doctor">
      <div className={styles.container}>
        <div className={styles.visual}>
          <div className={styles.photoPlaceholder}>
            <FaUserMd />
            <span>Add Doctor Photograph</span>
          </div>

          <div className={styles.floatingCard}>
            <FaShieldAlt />
            <div>
              <strong>Patient-first dentistry</strong>
              <span>Clear guidance, careful planning, comfortable care</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <FaUserMd />
            Meet Your Dentist
          </span>

          <h2>
            Clinical care guided by
            <span> trust and precision</span>
          </h2>

          <p className={styles.lead}>
            At Family Dental Clinic &amp; Implant Center, every patient receives
            an individual examination and a treatment plan suited to their oral
            health needs.
          </p>

          <p className={styles.body}>
            The focus is on preserving natural teeth whenever possible,
            explaining treatment choices clearly, and creating a calm and
            respectful experience for patients of all ages.
          </p>

          <div className={styles.credentials}>
            <article>
              <FaGraduationCap />
              <div>
                <strong>Professional dental care</strong>
                <span>Add qualification and registration details here</span>
              </div>
            </article>

            <article>
              <FaHeartbeat />
              <div>
                <strong>Comprehensive treatment planning</strong>
                <span>Preventive, restorative, surgical, and implant care</span>
              </div>
            </article>
          </div>

          <div className={styles.expertise}>
            {expertise.map((item) => (
              <span key={item}>
                <FaCheckCircle />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
