import {
  FaClock,
  FaHandHoldingHeart,
  FaShieldAlt,
  FaSmileBeam,
  FaTooth,
  FaUserMd,
} from "react-icons/fa";
import styles from "@/styles/WhyChooseUs.module.css";

const features = [
  {
    title: "Experienced Dental Care",
    description:
      "Every patient receives careful examination, clear guidance, and treatment planning focused on long-term oral health.",
    icon: FaUserMd,
  },
  {
    title: "Modern Treatment Approach",
    description:
      "Contemporary techniques and clinically appropriate materials are used to make treatment precise, comfortable, and reliable.",
    icon: FaTooth,
  },
  {
    title: "Patient-First Experience",
    description:
      "We explain each step, answer your questions, and ensure that you feel comfortable before starting any procedure.",
    icon: FaHandHoldingHeart,
  },
  {
    title: "Safety & Sterilization",
    description:
      "Strict hygiene, sterilization, and infection-control protocols are followed throughout the clinic.",
    icon: FaShieldAlt,
  },
  {
    title: "Convenient Appointments",
    description:
      "Flexible appointment support helps reduce waiting time and makes dental visits easier for families and working patients.",
    icon: FaClock,
  },
  {
    title: "Complete Family Dentistry",
    description:
      "Preventive, restorative, cosmetic, surgical, implant, and children’s dental services are available under one roof.",
    icon: FaSmileBeam,
  },
];

export default function WhyChooseUs() {
  return (
    <section className={styles.section} id="why-choose-us">
      <div className={styles.container}>
        <div className={styles.introCard}>
          <div className={styles.badge}>
            <FaTooth />
            Why Choose Us
          </div>

          <h2>
            Dental care built around
            <span> trust, comfort, and precision</span>
          </h2>

          <p>
            At Family Dental Clinic &amp; Implant Center, our goal is to make
            every visit reassuring, transparent, and clinically dependable.
          </p>

          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <strong>Complete</strong>
              <span>Family Dental Care</span>
            </div>

            <div className={styles.statCard}>
              <strong>Modern</strong>
              <span>Treatment Planning</span>
            </div>

            <div className={styles.statCard}>
              <strong>Personal</strong>
              <span>Patient Attention</span>
            </div>
          </div>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article className={styles.featureCard} key={feature.title}>
                <div className={styles.iconBox}>
                  <Icon />
                </div>

                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
