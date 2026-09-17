import {
  FaCheckCircle,
  FaHeartbeat,
  FaShieldAlt,
  FaSmile,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";
import styles from "@/styles/AboutClinic.module.css";
import { useSiteContent } from "@/lib/siteContent";

const expertise = [
  {
    title: "Preventive Dentistry",
    description: "Routine check-ups, scaling, polishing, and oral-health guidance.",
    icon: FaShieldAlt,
  },
  {
    title: "Restorative Dentistry",
    description: "Fillings, root canal treatment, crowns, bridges, and tooth preservation.",
    icon: FaTooth,
  },
  {
    title: "Implant Dentistry",
    description: "Carefully planned replacement of missing teeth with dental implants.",
    icon: FaHeartbeat,
  },
  {
    title: "Smile Care",
    description: "Aesthetic and functional treatment focused on confidence and comfort.",
    icon: FaSmile,
  },
];

export default function AboutClinic() {
  const content = useSiteContent();
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.visualColumn}>
          <div className={styles.imageFrame}>
            <div className={styles.imagePlaceholder}>
              <FaUserMd />
              <span>Doctor / Clinic Photo</span>
            </div>

            <div className={styles.experienceCard}>
              <FaTooth />
              <div>
                <strong>Complete Dental Care</strong>
                <span>For individuals and families</span>
              </div>
            </div>

            <div className={styles.trustCard}>
              <FaShieldAlt />
              <div>
                <strong>Safe & Hygienic</strong>
                <span>Patient-focused clinical protocols</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.eyebrow}>
            <FaUserMd />
            {content.aboutEyebrow}
          </div>

          <h2>
            {content.aboutTitle}
            <span> {content.aboutAccent}</span>
          </h2>

          <p className={styles.lead}>
            {content.aboutLead}
          </p>

          <p className={styles.bodyText}>
            {content.aboutBody}
          </p>

          <div className={styles.checkList}>
            {content.aboutHighlights.map((item) => (
              <div className={styles.checkItem} key={item}>
                <FaCheckCircle />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className={styles.expertiseGrid}>
            {expertise.map((item) => {
              const Icon = item.icon;

              return (
                <article className={styles.expertiseCard} key={item.title}>
                  <div className={styles.iconBox}>
                    <Icon />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
