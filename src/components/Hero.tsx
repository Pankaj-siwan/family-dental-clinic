import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaClock, FaPhoneAlt, FaShieldAlt, FaStar, FaWhatsapp, FaXRay } from "react-icons/fa";
import styles from "@/styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.container}>
        <motion.div className={styles.content} initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className={styles.eyebrow}>
            <FaShieldAlt />
            Trusted dental clinic in Siwan
            <span className={styles.hindiInline}>सीवान का विश्वसनीय दंत क्लिनिक</span>
          </div>

          <h1 className={styles.title}>
            Where Healthy
            <span>Smiles Begin</span>
          </h1>

          <p className={styles.hindiHeadline}>स्वस्थ मुस्कान की शुरुआत यहाँ से</p>

          <p className={styles.tagline}>
            Modern dentistry with compassion, precision, and excellence.
            <span className={styles.hindiLine}>
              आधुनिक दंत चिकित्सा—सहानुभूति, सटीकता और उत्कृष्टता के साथ।
            </span>
          </p>

          <div className={styles.actions}>
            <a className={styles.primaryButton} href="#appointment">
              <FaCalendarCheck />
              <span>Book Appointment<small>अपॉइंटमेंट बुक करें</small></span>
            </a>
            <a className={styles.secondaryButton} href="tel:+918618528975">
              <FaPhoneAlt />
              <span>Call Now<small>अभी कॉल करें</small></span>
            </a>
            <a className={styles.whatsappButton} href="https://wa.me/918618528975" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
              <span>WhatsApp<small>व्हाट्सऐप करें</small></span>
            </a>
          </div>
        </motion.div>

        <motion.div className={styles.visual} initial={{ opacity: 0, x: 38 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75 }}>
          <div className={styles.imageFrame}>
            <Image src="/images/working-area.jpg" alt="Treatment room" fill priority className={styles.clinicImage} />
          </div>

          <div className={styles.floatingLogo}>
            <img src="/images/clinic-logo-new.png" alt="Clinic logo" />
          </div>

          <div className={styles.ratingCard}>
            <div className={styles.stars}><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
            <strong>Patient-Focused Care</strong>
            <span>मरीज-केंद्रित एवं नैतिक उपचार</span>
          </div>

          <div className={`${styles.infoBadge} ${styles.xrayBadge}`}>
            <FaXRay />
            <div><strong>Dental X-Ray</strong><span>दंत एक्स-रे सुविधा</span></div>
          </div>

          <div className={`${styles.infoBadge} ${styles.safetyBadge}`}>
            <FaShieldAlt />
            <div><strong>Sterilized & Safe</strong><span>स्वच्छ एवं सुरक्षित उपचार</span></div>
          </div>

          <div className={styles.hoursCard}>
            <div className={styles.cardTitle}><FaClock />Clinic Hours — क्लिनिक समय</div>
            <span>Open Every Day — प्रतिदिन खुला</span>
            <strong>9:00 AM–8:00 PM</strong>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
