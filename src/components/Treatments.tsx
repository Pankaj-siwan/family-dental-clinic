import Link from "next/link";
import {
  FaArrowRight,
  FaChild,
  FaHeartbeat,
  FaMagic,
  FaShieldAlt,
  FaSmile,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";
import styles from "@/styles/Treatments.module.css";

const treatments = [
  {
    title: "Root Canal Treatment",
    shortTitle: "RCT",
    description:
      "Modern root canal treatment designed to relieve pain, control infection, and preserve the natural tooth.",
    icon: FaHeartbeat,
    featured: true,
  },
  {
    title: "Dental Implants",
    shortTitle: "Implant Dentistry",
    description:
      "Strong and natural-looking replacement for missing teeth with carefully planned dental implant treatment.",
    icon: FaShieldAlt,
    featured: true,
  },
  {
    title: "Crowns & Bridges",
    shortTitle: "Fixed Teeth",
    description:
      "Restore damaged or missing teeth with aesthetic crowns and bridges planned for comfort and function.",
    icon: FaSmile,
  },
  {
    title: "Tooth Extraction",
    shortTitle: "Painless Extraction",
    description:
      "Gentle tooth removal, root-stump extraction, surgical extraction, and wisdom-tooth procedures.",
    icon: FaTooth,
  },
  {
    title: "Dental Fillings",
    shortTitle: "Tooth Restoration",
    description:
      "Tooth-coloured composite, flowable composite, GIC, fluoride-releasing, and premium restorations.",
    icon: FaMagic,
  },
  {
    title: "Teeth Cleaning",
    shortTitle: "Scaling & Polishing",
    description:
      "Professional oral prophylaxis, scaling, and polishing for healthier gums and a fresher smile.",
    icon: FaSmile,
  },
  {
    title: "Oral Surgery",
    shortTitle: "Surgical Care",
    description:
      "Treatment for impacted teeth, dental abscess, cysts, tissue lesions, suturing, and other surgical conditions.",
    icon: FaUserMd,
  },
  {
    title: "Children’s Dentistry",
    shortTitle: "Paediatric Dental Care",
    description:
      "Comfortable and compassionate dental care designed especially for children and young patients.",
    icon: FaChild,
  },
];

export default function Treatments() {
  return (
    <section className={styles.section} id="treatments">
      <div className={styles.backgroundGlowOne} />
      <div className={styles.backgroundGlowTwo} />

      <div className={styles.container}>
        <div className={styles.headingArea}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowIcon}>
              <FaTooth />
            </span>
            Comprehensive Dental Care
          </div>

          <h2 className={styles.heading}>
            Advanced treatments for a
            <span> healthy, confident smile</span>
          </h2>

          <p className={styles.introduction}>
            From preventive dental care to advanced implant and surgical
            procedures, every treatment is carefully planned around your
            comfort, safety, and long-term oral health.
          </p>
        </div>

        <div className={styles.grid}>
          {treatments.map((treatment, index) => {
            const Icon = treatment.icon;

            return (
              <article
                className={`${styles.card} ${
                  treatment.featured ? styles.featuredCard : ""
                }`}
                key={treatment.title}
              >
                {treatment.featured && (
                  <span className={styles.popularBadge}>
                    Advanced Treatment
                  </span>
                )}

                <div className={styles.cardTopRow}>
                  <div className={styles.iconWrapper}>
                    <Icon />
                  </div>

                  <span className={styles.cardNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <span className={styles.shortTitle}>
                  {treatment.shortTitle}
                </span>

                <h3>{treatment.title}</h3>
                <p>{treatment.description}</p>

                <Link
                  href="#appointment"
                  className={styles.cardLink}
                  aria-label={`Book an appointment for ${treatment.title}`}
                >
                  Book consultation
                  <FaArrowRight />
                </Link>
              </article>
            );
          })}
        </div>

        <div className={styles.bottomPanel}>
          <div className={styles.bottomPanelIcon}>
            <FaTooth />
          </div>

          <div className={styles.bottomPanelContent}>
            <span>Not sure which treatment you need?</span>
            <h3>Visit us for a complete dental examination.</h3>
            <p>
              We will examine your dental condition and explain the suitable
              treatment options before beginning any procedure.
            </p>
          </div>

          <div className={styles.actions}>
            <a href="tel:+918618528975" className={styles.secondaryButton}>
              Call Clinic
            </a>

            <a
              href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Book Appointment
              <FaArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
