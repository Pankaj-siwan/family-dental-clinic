"use client";

import { useState } from "react";
import { FaChevronDown, FaQuestionCircle, FaWhatsapp } from "react-icons/fa";
import styles from "@/styles/FAQ.module.css";

const faqs = [
  {
    question: "Is root canal treatment painful?",
    answer:
      "Root canal treatment is performed under local anaesthesia. Most patients feel pressure rather than pain during the procedure. Mild tenderness afterward can usually be managed with the medicines and instructions advised by the dentist.",
  },
  {
    question: "How do I know whether I need a dental implant?",
    answer:
      "Dental implants may be considered when one or more teeth are missing and the jawbone and general health are suitable. A clinical examination and appropriate radiographs are required before implant treatment can be planned.",
  },
  {
    question: "How often should I have a dental check-up?",
    answer:
      "Many patients benefit from a dental examination every six months, but the interval may differ depending on gum health, decay risk, medical history, and ongoing treatment.",
  },
  {
    question: "Do you provide dental care for children?",
    answer:
      "Yes. Children can receive preventive care, examination, fillings, advice for oral habits, and other treatment based on their age and clinical needs.",
  },
  {
    question: "What should I do during a dental emergency?",
    answer:
      "Call the clinic as soon as possible. Severe toothache, facial swelling, bleeding, trauma, or a knocked-out tooth may require urgent evaluation. Emergency availability depends on the clinic schedule.",
  },
  {
    question: "Are dental X-rays safe?",
    answer:
      "Dental radiographs use a low dose of radiation and are advised only when clinically required. Appropriate protective and safety measures are followed during imaging.",
  },
  {
    question: "How long does dental implant treatment take?",
    answer:
      "The duration varies with the number of implants, bone condition, healing, and whether additional procedures are required. Implant treatment is usually completed in planned stages over several weeks or months.",
  },
  {
    question: "Can I book an appointment through WhatsApp?",
    answer:
      "Yes. You can send the patient name, dental concern, and preferred appointment time through WhatsApp. The appointment is confirmed according to slot availability.",
  },
  {
    question: "Which payment methods are available?",
    answer:
      "Available payment methods may include cash, UPI, QR payment, or other methods supported by the clinic. Please confirm the currently available options at reception.",
  },
  {
    question: "Will the treatment cost be discussed beforehand?",
    answer:
      "After examination and diagnosis, the dentist can explain suitable treatment options and the estimated cost. The final cost may change if additional clinical findings or procedures are identified.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section} id="faq">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaQuestionCircle />
            Frequently Asked Questions
          </span>

          <h2>
            Helpful answers before
            <span> your dental visit</span>
          </h2>

          <p>
            Clear information can make dental care feel easier. These answers
            provide general guidance; a clinical examination is needed for
            individual advice.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.list}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <article
                  className={`${styles.item} ${isOpen ? styles.openItem : ""}`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className={styles.question}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <FaChevronDown />
                  </button>

                  <div className={styles.answerWrap}>
                    {isOpen && <p className={styles.answer}>{faq.answer}</p>}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className={styles.helpCard}>
            <div className={styles.helpIcon}>
              <FaQuestionCircle />
            </div>

            <span>Still have a question?</span>
            <h3>Talk directly with our clinic team.</h3>

            <p>
              Send your dental concern through WhatsApp or call the clinic for
              appointment and treatment-related guidance.
            </p>

            <a
              href="https://wa.me/918618528975?text=Hello%2C%20I%20have%20a%20question%20about%20dental%20treatment."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <FaWhatsapp />
              Ask on WhatsApp
            </a>

            <a href="tel:+918618528975" className={styles.callLink}>
              Call +91 86185 28975
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
