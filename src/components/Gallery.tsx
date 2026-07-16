import { FaCamera, FaImages, FaTooth } from "react-icons/fa";
import styles from "@/styles/Gallery.module.css";

const galleryItems = [
  { title: "Clinic Reception", type: "Clinic Interior" },
  { title: "Treatment Area", type: "Dental Facility" },
  { title: "Sterilization Zone", type: "Safety & Hygiene" },
  { title: "Dental Equipment", type: "Modern Setup" },
  { title: "Smile Transformation", type: "Treatment Result" },
  { title: "Patient Care", type: "Clinical Experience" },
];

export default function Gallery() {
  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div>
            <span className={styles.eyebrow}>
              <FaImages />
              Clinic Gallery
            </span>

            <h2>
              A closer look at our
              <span> clinic and patient care</span>
            </h2>
          </div>

          <p>
            Replace these premium placeholders with photographs of the clinic,
            equipment, team, and approved treatment results.
          </p>
        </div>

        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <article
              className={`${styles.item} ${
                index === 0 || index === 3 ? styles.largeItem : ""
              }`}
              key={item.title}
            >
              <div className={styles.placeholder}>
                {index % 2 === 0 ? <FaCamera /> : <FaTooth />}
              </div>

              <div className={styles.overlay}>
                <span>{item.type}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
