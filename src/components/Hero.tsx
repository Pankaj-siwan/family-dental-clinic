import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaClock,
  FaPhoneAlt,
  FaShieldAlt,
  FaStar,
  FaTooth,
  FaWhatsapp,
  FaXRay,
} from "react-icons/fa";
import styles from "@/styles/Hero.module.css";

const treatments = [
  "Dental Implants",
  "Root Canal Treatment (RCT)",
  "GIC Restorations",
  "Composite Restorations",
  "Inlays",
  "Onlays",
  "Veneers",
  "Dental Crowns",
  "Dental Bridges",
  "Fixed Partial Dentures",
  "Removable Partial Dentures",
  "Complete Dentures",
  "Implant-Supported Overdentures",
  "Tooth Extraction",
  "Impaction Surgery",
  "Wisdom Tooth Extraction",
  "Tooth Polishing",
  "Teeth Whitening",
  "Dental Radiographs",
  "Biopsies",
  "Dental Surgeries",
  "Locked Jaw Reduction",
  "Comprehensive Dental Care",
];

const statistics = [
  {
    value: "Since 2020",
    label: "Serving Families",
  },
  {
    value: "2 Doctors",
    label: "Dedicated Dental Team",
  },
  {
    value: "Modern",
    label: "Diagnostic Facilities",
  },
  {
    value: "7 Days",
    label: "Clinic Availability",
  },
];

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
            Trusted dental clinic in Siwan
          </div>

          <h1 className={styles.title}>
            Where Healthy
            <span>Smiles Begin</span>
          </h1>

          <p className={styles.tagline}>
            Modern dentistry with compassion, precision, and excellence.
          </p>

          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#appointment">
              <FaCalendarCheck aria-hidden="true" />
              Book Appointment
            </a>

            <a className={styles.secondaryButton} href="tel:+918618528975">
              <FaPhoneAlt aria-hidden="true" />
              Call Now
            </a>

            <a
              className={styles.whatsappButton}
              href="https://wa.me/918618528975?text=Hello%20Family%20Dental%20Clinic%20and%20Implant%20Center%2C%20I%20would%20like%20to%20book%20an%20appointment."
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              WhatsApp
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
            <span>Ethical treatment planning in Siwan</span>
          </div>

          <div className={`${styles.infoBadge} ${styles.xrayBadge}`}>
            <FaXRay aria-hidden="true" />

            <div>
              <strong>Dental X-Ray</strong>
              <span>Diagnostic support</span>
            </div>
          </div>

          <div className={`${styles.infoBadge} ${styles.safetyBadge}`}>
            <FaShieldAlt aria-hidden="true" />

            <div>
              <strong>Sterilized &amp; Safe</strong>
              <span>Infection-control focused</span>
            </div>
          </div>

          <div className={styles.hoursCard}>
            <div className={styles.cardTitle}>
              <FaClock aria-hidden="true" />
              Clinic Hours
            </div>

            <span>Monday–Saturday</span>
            <strong>9:00 AM–7:00 PM</strong>

            <hr />

            <span>Sunday</span>
            <strong>10:30 AM–5:30 PM</strong>
          </div>

          <div className={styles.doctorsCard}>
            <div className={styles.doctorPhotos}>
              <Image
                src="/images/dr-pankaj.png"
                alt="Dr. Pankaj"
                width={66}
                height={66}
              />

              <Image
                src="/images/dr-anita.jpg"
                alt="Dr. Anita Kumari"
                width={66}
                height={66}
              />
            </div>

            <div className={styles.doctorDetails}>
              <h3>Experienced Dental Team</h3>

              <p>
                <strong>Dr. Pankaj, MDS</strong>
                <span>Oral Medicine &amp; Maxillofacial Radiology</span>
              </p>

              <p>
                <strong>Dr. Anita Kumari, BDS</strong>
                <span>Dental Surgeon</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className={styles.treatmentsSection}>
        <div className={styles.treatmentsHeading}>
          <span>Comprehensive Dental Services</span>

          <h3>Dental treatments available at our clinic</h3>

          <p>
            Treatment is advised after clinical examination, diagnosis and
            discussion of appropriate options.
          </p>
        </div>

        <div className={styles.treatments}>
          {treatments.map((treatment) => (
            <div className={styles.treatmentCard} key={treatment}>
              <span className={styles.treatmentIcon}>
                <FaTooth aria-hidden="true" />
              </span>

              <span>{treatment}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.statistics}>
        {statistics.map((item) => (
          <div className={styles.statItem} key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
