import Image from "next/image";
import {
  FaCalendarCheck,
  FaHome,
  FaImages,
  FaPhoneAlt,
  FaTooth,
  FaUser,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <div className={styles.brandContainer}>
          <Image
            src="/images/clinic-logo.png"
            alt="Family Dental Clinic and Implant Center logo"
            width={104}
            height={104}
            priority
            className={styles.logo}
          />

          <div className={styles.brandText}>
            <h1>
              Family Dental Clinic
              <span>&amp; Implant Center</span>
            </h1>
          </div>

          <div className={styles.contactActions}>
            <a
              className={styles.callCard}
              href="tel:+918618528975"
              aria-label="Call Family Dental Clinic"
            >
              <FaPhoneAlt />
              <div>
                <span>Call Now</span>
                <strong>+91 86185 28975</strong>
              </div>
            </a>

            <a
              className={styles.whatsappCard}
              href="https://wa.me/918618528975?text=Hello%20Family%20Dental%20Clinic%20and%20Implant%20Center%2C%20I%20would%20like%20to%20book%20an%20appointment."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
              <div>
                <span>WhatsApp</span>
                <strong>Chat Now</strong>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.navigationRow}>
        <nav className={styles.navigation}>
          <a href="#home" className={styles.activeLink}>
            <FaHome />
            Home
          </a>

          <a href="#about">
            <FaUser />
            About Us
          </a>

          <a href="#services">
            <FaTooth />
            Services
          </a>

          <a href="#gallery">
            <FaImages />
            Gallery
          </a>

          <a href="#contact">
            <FaPhoneAlt />
            Contact
          </a>

          <a href="#appointment" className={styles.appointmentLink}>
            <FaCalendarCheck />
            Book Appointment
          </a>
        </nav>
      </div>
    </header>
  );
}