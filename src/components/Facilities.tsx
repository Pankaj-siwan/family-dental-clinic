import styles from "@/styles/Facilities.module.css";

const facilities = [
  {
    title: "Modern Dental Setup",
    description:
      "A thoughtfully designed clinical environment for efficient, comfortable, and dependable dental care.",
    image:
      "https://images.pexels.com/photos/6812461/pexels-photo-6812461.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Modern dental chair and clinical setup",
  },
  {
    title: "Sterilization Protocols",
    description:
      "Strict instrument sterilization and infection-control practices are followed for every patient.",
    image:
      "https://images.pexels.com/photos/6627477/pexels-photo-6627477.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist preparing sterilized dental instruments",
  },
  {
    title: "Advanced Dental Equipment",
    description:
      "Modern dental instruments support accurate examination, treatment planning, and clinical procedures.",
    image:
      "https://images.pexels.com/photos/6502336/pexels-photo-6502336.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Advanced dental equipment in a modern clinic",
  },
  {
    title: "Comfortable Patient Area",
    description:
      "A bright and welcoming waiting environment helps patients and accompanying family members feel relaxed.",
    image:
      "https://images.pexels.com/photos/8459996/pexels-photo-8459996.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Bright and comfortable clinic waiting area",
  },
  {
    title: "Clinical Documentation",
    description:
      "Dental photographs and treatment records support diagnosis, patient education, and follow-up care.",
    image:
      "https://images.pexels.com/photos/15771809/pexels-photo-15771809.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dental instruments and clinical documentation setup",
  },
  {
    title: "Complete Dental Services",
    description:
      "Preventive, restorative, surgical, cosmetic, paediatric, and implant services are available under one roof.",
    image:
      "https://unsplash.com/photos/aCJ2jt9yvoA/download?force=true",
    alt: "Dental team providing treatment to a patient",
  },
];

export default function Facilities() {
  return (
    <section className={styles.section} id="facilities">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>Clinic Facilities</span>

          <h2>
            A modern clinic designed for
            <span> safe and comfortable care</span>
          </h2>

          <p>
            Our clinical setup supports efficient treatment, patient comfort,
            careful documentation, and high standards of hygiene.
          </p>
        </div>

        <div className={styles.grid}>
          {facilities.map((facility, index) => (
            <article className={styles.card} key={facility.title}>
              <div className={styles.imageWrap}>
                <img
                  src={facility.image}
                  alt={facility.alt}
                  loading="lazy"
                  className={styles.image}
                />

                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3>{facility.title}</h3>
                <p>{facility.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.photoNote}>
          These are professional stock photographs. Replace them later with
          photographs of your own clinic for maximum authenticity.
        </p>
      </div>
    </section>
  );
}
