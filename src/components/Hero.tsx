import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
  FaTooth,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/Hero.module.css";

const highlights = [
  "Complete family dental care",
  "Modern treatment planning",
  "Patient-first clinical approach",
];

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className={styles.eyebrow}>
            <FaShieldAlt /> Trusted dental care in Siwan
          </div>

          <h1 className={styles.title}>
            <motion.span
              className={styles.primaryTitleLine}
              initial={{ opacity: 0, x: -34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: "easeOut" }}
            >
              Family Dental Clinic
            </motion.span>
            <motion.span
              className={styles.accentTitleLine}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42, ease: "easeOut" }}
            >
              &amp; Implant Center
            </motion.span>
          </h1>

          <p className={styles.tagline}>
            Fulfilling your dental needs in and around Siwan with thoughtful,
            modern and dependable dental care for every member of your family.
          </p>

          <div className={styles.highlights}>
            {highlights.map((item) => (
              <span key={item}>
                <FaCheckCircle /> {item}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#appointment">
              <FaCalendarCheck /> Book Appointment
            </a>
            <a className={styles.secondaryButton} href="tel:+918618528975">
              <FaPhoneAlt /> Call Now
            </a>
            <a
              className={styles.whatsappButton}
              href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <div className={styles.locationStrip}>
            <FaMapMarkerAlt />
            <div>
              <strong>Three convenient clinic locations</strong>
              <span>Siwan · Andar · Gaushala Road</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.12 }}
        >
          <div className={styles.imageShell}>
            <Image
              src="/images/hero-treatment-room.jpg"
              alt="Modern treatment area at Family Dental Clinic and Implant Center"
              fill
              priority
              sizes="(max-width: 1000px) 92vw, 620px"
              className={styles.clinicImage}
            />
            <div className={styles.imageOverlay} />
            <div className={styles.imageCaption}>
              <span>Modern, clean and comfortable</span>
              <strong>Dental care you can trust</strong>
            </div>
          </div>

          <div className={styles.logoCard}>
            <Image
              src="/images/clinic-logo-official.png"
              alt="Clinic logo"
              width={90}
              height={90}
            />
          </div>

          <div className={styles.ratingCard}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, index) => (
                <FaStar key={index} />
              ))}
            </div>
            <strong>Patient-focused care</strong>
            <span>Clear guidance at every step</span>
          </div>

          <div className={styles.hoursCard}>
            <FaClock />
            <div>
              <span>Siwan clinic hours</span>
              <strong>9:00 AM – 8:00 PM</strong>
            </div>
          </div>

          <div className={styles.treatmentCard}>
            <FaTooth />
            <div>
              <strong>Complete dentistry</strong>
              <span>Preventive to implant care</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}