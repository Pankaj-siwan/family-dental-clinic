import { FaClinicMedical, FaHeartbeat, FaShieldAlt, FaUserMd } from "react-icons/fa";
import styles from "@/styles/TrustStrip.module.css";

const items = [
  { icon: FaUserMd, title: "Doctor-led care", text: "Experienced dental surgeons" },
  { icon: FaClinicMedical, title: "Three clinics", text: "Siwan, Andar & Gaushala Road" },
  { icon: FaShieldAlt, title: "Thoughtful planning", text: "Clear diagnosis and guidance" },
  { icon: FaHeartbeat, title: "Family dentistry", text: "Care for every generation" },
];

export default function TrustStrip() {
  return (
    <section className={styles.section} aria-label="Why patients choose our clinic">
      <div className={styles.container}>
        {items.map(({ icon: Icon, title, text }) => (
          <div className={styles.item} key={title}>
            <Icon aria-hidden="true" />
            <div><strong>{title}</strong><span>{text}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
