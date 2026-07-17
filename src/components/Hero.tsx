import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaClock,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
  FaWhatsapp,
  FaXRay,
} from "react-icons/fa";
import styles from "@/styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, x: -36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}>
            <FaShieldAlt aria-hidden="true" />
            <span>Trusted Dental Clinic in Siwan</span>
          </div>

          <h1 className={styles.title}>
            Where Healthy
            <span>Smiles Begin</span>
          </h1>

          <p className={styles.tagline}>
            Modern dentistry with compassion, precision, and excellence.
          </p>

          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#clinics">
              <FaCalendarCheck aria-hidden="true" />
              <span>Book Appointment</span>
            </a>

            <a className={styles.secondaryButton} href="tel:+918618528975">
              <FaPhoneAlt aria-hidden="true" />
              <span>Call Now</span>
            </a>

            <a
              className={styles.whatsappButton}
              href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 38 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
        >
          <div className={styles.imageFrame}>
            <Image
              src="/images/working-area.jpg"
              alt="Treatment room at Family Dental Clinic and Implant Center"
              fill
              priority
              sizes="(max-width: 1000px) 90vw, 650px"
              className={styles.clinicImage}
            />
          </div>

          <div className={styles.floatingLogo}>
            <img
              src="/images/clinic-logo-new.png"
              alt="Family Dental Clinic and Implant Center logo"
            />
          </div>

          <div className={styles.ratingCard}>
            <div className={styles.stars}>
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <strong>Patient-Focused Care</strong>
          </div>

          <div className={`${styles.infoBadge} ${styles.xrayBadge}`}>
            <FaXRay aria-hidden="true" />
            <div>
              <strong>Dental X-Ray</strong>
            </div>
          </div>

          <div className={`${styles.infoBadge} ${styles.safetyBadge}`}>
            <FaShieldAlt aria-hidden="true" />
            <div>
              <strong>Sterilized &amp; Safe</strong>
            </div>
          </div>

          <div className={styles.hoursCard}>
            <div className={styles.cardTitle}>
              <FaClock aria-hidden="true" />
              Clinic Hours
            </div>
            <span>Open Every Day</span>
            <strong>9:00 AM – 8:00 PM</strong>
          </div>
        </motion.div>
      </div>
    </section>
  );
}