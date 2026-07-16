import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import styles from "@/styles/FloatingActions.module.css";

export default function FloatingActions() {
  return (
    <div className={styles.actions} aria-label="Quick contact actions">
      <a
        href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsapp}
        aria-label="Book appointment on WhatsApp"
      >
        <FaWhatsapp />
      </a>

      <a
        href="tel:+918618528975"
        className={styles.call}
        aria-label="Call Family Dental Clinic"
      >
        <FaPhoneAlt />
      </a>
    </div>
  );
}
