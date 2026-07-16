import { FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import styles from "@/styles/Testimonials.module.css";

const testimonials = [
  {
    name: "Patient Review",
    treatment: "General Dental Care",
    text:
      "The clinic experience was comfortable and the treatment was explained clearly before the procedure.",
  },
  {
    name: "Patient Review",
    treatment: "Root Canal Treatment",
    text:
      "The consultation was reassuring, and the entire treatment process was handled with care and patience.",
  },
  {
    name: "Patient Review",
    treatment: "Family Dentistry",
    text:
      "A clean and welcoming clinic with attentive dental care for the whole family.",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaStar />
            Patient Experiences
          </span>

          <h2>
            Care that patients can
            <span> feel confident about</span>
          </h2>

          <p>
            These sample cards can later be replaced with genuine patient
            reviews after receiving permission to publish them.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial) => (
            <article className={styles.card} key={testimonial.treatment}>
              <FaQuoteLeft className={styles.quoteIcon} />

              <div className={styles.stars} aria-label="Five-star review">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar key={index} />
                ))}
              </div>

              <p className={styles.review}>“{testimonial.text}”</p>

              <div className={styles.patient}>
                <FaUserCircle />

                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.treatment}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
