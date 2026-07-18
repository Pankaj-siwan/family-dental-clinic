import Image from "next/image";
import { FaImages } from "react-icons/fa";
import styles from "@/styles/Gallery.module.css";

const galleryItems = [
  { title: "Siwan Treatment Room", type: "Main Clinic", image: "/images/siwan-clinic.jpg" },
  { title: "Reception & Waiting Area", type: "Patient Comfort", image: "/images/reception.jpg" },
  { title: "Clinical Treatment Area", type: "Modern Dental Care", image: "/images/hero-treatment-room.jpg" },
  { title: "Andar Clinic", type: "Andar Branch", image: "/images/andar-clinic.webp" },
  { title: "Dr. Anita Clinic", type: "Gaushala Road", image: "/images/dr-anita-clinic.jpeg" },
  { title: "Clinic Interior", type: "Family Dental Care", image: "/images/gallery-clinic-1.jpeg" },
];

export default function Gallery() {
  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <div className={styles.headingRow}>
          <div>
            <span className={styles.eyebrow}><FaImages /> Clinic Gallery</span>
            <h2>A closer look at our <span>real clinic spaces</span></h2>
          </div>
          <p>Explore genuine photographs from our clinics, treatment rooms and patient waiting areas.</p>
        </div>

        <div className={styles.grid}>
          {galleryItems.map((item, index) => (
            <article className={`${styles.item} ${index === 0 || index === 3 ? styles.largeItem : ""}`} key={item.title}>
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 600px) 100vw, (max-width: 850px) 50vw, 33vw" className={styles.image} />
              <div className={styles.overlay}><span>{item.type}</span><h3>{item.title}</h3></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
