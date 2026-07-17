import styles from "@/styles/PatientJourney.module.css";

const steps = [
  {
    title: "Book Appointment",
    hindi: "अपॉइंटमेंट बुक करें",
    description: "Call or WhatsApp the clinic to request a convenient appointment time.",
    hindiDescription: "सुविधाजनक समय के लिए क्लिनिक को कॉल या व्हाट्सऐप करें।",
    image: "https://images.pexels.com/photos/6809668/pexels-photo-6809668.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Dental Examination",
    hindi: "दाँतों की जाँच",
    description: "A careful examination identifies the main dental concern.",
    hindiDescription: "सावधानीपूर्वक जाँच से दाँतों की मुख्य समस्या पहचानी जाती है।",
    image: "https://images.pexels.com/photos/5355727/pexels-photo-5355727.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Diagnosis",
    hindi: "रोग की पहचान",
    description: "Clinical findings and investigations are reviewed clearly.",
    hindiDescription: "जाँच एवं रिपोर्ट के आधार पर समस्या समझाई जाती है।",
    image: "https://images.pexels.com/photos/6812508/pexels-photo-6812508.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Treatment Plan",
    hindi: "उपचार योजना",
    description: "Treatment options, expected visits, and costs are discussed.",
    hindiDescription: "उपचार विकल्प, संभावित विज़िट और खर्च समझाया जाता है।",
    image: "https://images.pexels.com/photos/6627347/pexels-photo-6627347.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Treatment",
    hindi: "उपचार",
    description: "The selected procedure is performed with attention to safety and comfort.",
    hindiDescription: "चुना गया उपचार सुरक्षा और आराम का ध्यान रखते हुए किया जाता है।",
    image: "https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    title: "Follow-up Care",
    hindi: "पुनः जाँच एवं देखभाल",
    description: "Review appointments and post-treatment guidance support healing.",
    hindiDescription: "फॉलो-अप और उपचार के बाद की सलाह बेहतर स्वास्थ्य लाभ में मदद करती है।",
    image: "https://images.pexels.com/photos/6627289/pexels-photo-6627289.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export default function PatientJourney() {
  return (
    <section className={styles.section} id="patient-journey">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>Your Visit — आपकी विज़िट</span>
          <h2>
            A simple and transparent
            <span> patient journey</span>
          </h2>
          <p>
            पहले अपॉइंटमेंट से फॉलो-अप तक हर चरण स्पष्ट रूप से समझाया जाता है।
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, index) => (
            <article className={styles.step} key={step.title}>
              <div className={styles.imageWrap}>
                <img
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                  className={styles.image}
                />
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3>
                  {step.title}
                  <span className={styles.hindiTitle}>{step.hindi}</span>
                </h3>
                <p>{step.description}</p>
                <p className={styles.hindiDescription}>
                  {step.hindiDescription}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
