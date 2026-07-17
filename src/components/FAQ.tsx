"use client";

import { useState } from "react";
import { FaChevronDown, FaQuestionCircle, FaWhatsapp } from "react-icons/fa";
import styles from "@/styles/FAQ.module.css";

const faqs = [
  {
    question: "Is root canal treatment painful?",
    hindiQuestion: "क्या रूट कैनाल उपचार दर्दनाक होता है?",
    answer:
      "Root canal treatment is performed under local anaesthesia. Most patients feel pressure rather than pain.",
    hindiAnswer:
      "रूट कैनाल उपचार दाँत को सुन्न करने के बाद किया जाता है। अधिकतर मरीजों को दर्द की बजाय हल्का दबाव महसूस होता है।",
  },
  {
    question: "How do I know whether I need a dental implant?",
    hindiQuestion: "मुझे डेंटल इम्प्लांट की आवश्यकता है या नहीं, यह कैसे पता चलेगा?",
    answer:
      "A clinical examination and appropriate radiographs are required before implant treatment can be planned.",
    hindiAnswer:
      "इम्प्लांट की योजना बनाने से पहले क्लिनिकल जाँच और आवश्यक एक्स-रे जरूरी होते हैं।",
  },
  {
    question: "How often should I have a dental check-up?",
    hindiQuestion: "दाँतों की जाँच कितने समय में करानी चाहिए?",
    answer:
      "Many patients benefit from a dental examination every six months, although the interval may vary.",
    hindiAnswer:
      "अधिकतर मरीजों के लिए छह महीने में जाँच उपयोगी होती है, लेकिन आपकी स्थिति के अनुसार समय अलग हो सकता है।",
  },
  {
    question: "Do you provide dental care for children?",
    hindiQuestion: "क्या बच्चों का दंत उपचार उपलब्ध है?",
    answer:
      "Yes. Examination, preventive care, fillings, and oral-habit advice are available for children.",
    hindiAnswer:
      "हाँ। बच्चों की जाँच, फिलिंग, रोकथाम संबंधी देखभाल और आदतों से जुड़ी सलाह उपलब्ध है।",
  },
  {
    question: "What should I do during a dental emergency?",
    hindiQuestion: "दंत आपातकाल में क्या करना चाहिए?",
    answer:
      "Call the clinic as soon as possible for severe pain, swelling, bleeding, trauma, or a knocked-out tooth.",
    hindiAnswer:
      "तेज दर्द, सूजन, खून बहना, चोट या दाँत निकल जाने पर तुरंत क्लिनिक से संपर्क करें।",
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
            Frequently Asked Questions — सामान्य प्रश्न
          </span>

          <h2>
            Helpful answers before
            <span> your dental visit</span>
          </h2>

          <p>
            दंत चिकित्सक से मिलने से पहले उपयोगी जानकारी। व्यक्तिगत सलाह के लिए
            क्लिनिकल जाँच आवश्यक है।
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
                    <span>
                      {faq.question}
                      <small>{faq.hindiQuestion}</small>
                    </span>
                    <FaChevronDown />
                  </button>

                  {isOpen && (
                    <div className={styles.answer}>
                      <p>{faq.answer}</p>
                      <p className={styles.hindiAnswer}>{faq.hindiAnswer}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <aside className={styles.helpCard}>
            <div className={styles.helpIcon}><FaQuestionCircle /></div>
            <span>Still have a question? — कोई प्रश्न है?</span>
            <h3>Talk directly with our clinic team.</h3>
            <p>
              अपनी दंत समस्या के बारे में व्हाट्सऐप करें या क्लिनिक को कॉल करें।
            </p>

            <a
              href="https://wa.me/918618528975?text=Hello%2C%20I%20have%20a%20question%20about%20dental%20treatment."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
            >
              <FaWhatsapp />
              Ask on WhatsApp — व्हाट्सऐप करें
            </a>

            <a href="tel:+918618528975" className={styles.callLink}>
              Call +91 86185 28975 — अभी कॉल करें
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
