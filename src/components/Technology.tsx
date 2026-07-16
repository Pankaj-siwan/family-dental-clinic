import {
  FaCamera,
  FaMicroscope,
  FaShieldVirus,
  FaSyringe,
  FaTooth,
  FaTools,
} from "react-icons/fa";
import styles from "@/styles/Technology.module.css";

const items = [
  {
    title: "Modern Dental Chair",
    description: "A well-equipped clinical setup supports comfortable treatment.",
    icon: FaTooth,
  },
  {
    title: "Clinical Imaging Support",
    description: "Dental photographs can assist documentation and treatment review.",
    icon: FaCamera,
  },
  {
    title: "Sterilization Systems",
    description: "Instrument processing and infection-control protocols are prioritized.",
    icon: FaShieldVirus,
  },
  {
    title: "Precision Instruments",
    description: "Appropriate dental instruments support accurate and efficient procedures.",
    icon: FaTools,
  },
  {
    title: "Endodontic Care",
    description: "Root canal procedures are planned with attention to tooth preservation.",
    icon: FaMicroscope,
  },
  {
    title: "Surgical & Implant Support",
    description: "Clinical planning supports extractions, oral surgery, and implant care.",
    icon: FaSyringe,
  },
];

export default function Technology() {
  return (
    <section className={styles.section} id="technology">
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div>
            <span className={styles.eyebrow}>
              <FaTools />
              Clinic Technology
            </span>

            <h2>
              Thoughtful technology for
              <span> dependable dental care</span>
            </h2>
          </div>

          <p>
            The clinic uses appropriate equipment and clinical protocols to
            support accurate diagnosis, safe procedures, and patient comfort.
          </p>
        </div>

        <div className={styles.grid}>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article className={styles.card} key={item.title}>
                <div className={styles.iconBox}>
                  <Icon />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
