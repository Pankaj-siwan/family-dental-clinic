import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaTooth,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/Footer.module.css";

const quickLinks = [
  ["Home", "#home"],
  ["Treatments", "#treatments"],
  ["About", "#about"],
  ["Gallery", "#gallery"],
  ["Contact", "#contact"],
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.mainGrid}>
          <div className={styles.brandColumn}>
            <div className={styles.brand}>
              <span className={styles.brandIcon}>
                <FaTooth />
              </span>

              <div>
                <strong>Family Dental Clinic</strong>
                <span>&amp; Implant Center</span>
              </div>
            </div>

            <p>
              Comprehensive dental care focused on comfort, trust, safety, and
              long-term oral health.
            </p>

            <div className={styles.socials}>
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a
                href="https://wa.me/918618528975"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className={styles.linkColumn}>
            <h3>Quick Links</h3>
            {quickLinks.map(([label, href]) => (
              <Link href={href} key={label}>
                {label}
              </Link>
            ))}
          </div>

          <div className={styles.linkColumn}>
            <h3>Dental Services</h3>
            <span>Root Canal Treatment</span>
            <span>Dental Implants</span>
            <span>Crowns &amp; Bridges</span>
            <span>Dental Fillings</span>
            <span>Oral Surgery</span>
          </div>

          <div className={styles.contactColumn}>
            <h3>Contact Clinic</h3>

            <a href="tel:+918618528975">
              <FaPhoneAlt />
              +91 86185 28975
            </a>

            <a
              href="https://wa.me/918618528975"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              WhatsApp appointment
            </a>

            <p>
              Fatehpur Bypass Road, in front of RC Complex, Siwan, Bihar
            </p>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>
            © {new Date().getFullYear()} Family Dental Clinic &amp; Implant
            Center. All rights reserved.
          </span>

          <span>
            Website information is for general awareness and does not replace a
            clinical examination.
          </span>
        </div>
      </div>
    </footer>
  );
}
