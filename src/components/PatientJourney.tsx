import styles from "@/styles/PatientJourney.module.css";

const steps = [
  {
    title: "Book Appointment",
    description:
      "Call or WhatsApp the clinic to request a convenient appointment time.",
    image:
      "https://images.pexels.com/photos/6809668/pexels-photo-6809668.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Patient scheduling an appointment at a dental clinic reception",
  },
  {
    title: "Dental Examination",
    description:
      "A careful clinical examination identifies the main dental concern.",
    image:
      "https://images.pexels.com/photos/5355727/pexels-photo-5355727.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist examining a patient's teeth",
  },
  {
    title: "Diagnosis",
    description:
      "Clinical findings and required investigations are reviewed clearly.",
    image:
      "https://images.pexels.com/photos/6812508/pexels-photo-6812508.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist reviewing dental images on a computer screen",
  },
  {
    title: "Treatment Plan",
    description:
      "Suitable treatment options, expected visits, and costs are discussed.",
    image:
      "https://images.pexels.com/photos/6627347/pexels-photo-6627347.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist discussing a treatment plan with a patient",
  },
  {
    title: "Treatment",
    description:
      "The selected procedure is performed with attention to safety and comfort.",
    image:
      "https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist performing treatment in a modern clinic",
  },
  {
    title: "Follow-up Care",
    description:
      "Post-treatment guidance and review appointments support healing.",
    image:
      "https://images.pexels.com/photos/6627289/pexels-photo-6627289.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Dentist discussing follow-up care with a patient",
  },
];

export default function PatientJourney() {
  return (
    <section className={styles.section} id="patient-journey">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>Your Visit</span>

          <h2>
            A simple and transparent
            <span> patient journey</span>
          </h2>

          <p>
            From the first appointment to follow-up care, every step is explained
            so patients can make informed decisions with confidence.
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <article className={styles.step} key={step.title}>
              <div className={styles.imageWrap}>
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  className={styles.image}
                />

                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.photoNote}>
          These are professional stock photographs. Replace them later with
          photographs from your own clinic for maximum authenticity.
        </p>
      </div>
    </section>
  );
}
