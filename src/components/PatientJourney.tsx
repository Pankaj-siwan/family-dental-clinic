import styles from "@/styles/PatientJourney.module.css";

const steps = [
  ["Book Appointment","अपॉइंटमेंट बुक करें","Call or WhatsApp the clinic to request a convenient appointment time.","सुविधाजनक समय के लिए क्लिनिक को कॉल या व्हाट्सऐप करें।","https://images.pexels.com/photos/6809668/pexels-photo-6809668.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  ["Dental Examination","दाँतों की जाँच","A careful examination identifies the main concern.","सावधानीपूर्वक जाँच से मुख्य समस्या पहचानी जाती है।","https://images.pexels.com/photos/5355727/pexels-photo-5355727.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  ["Diagnosis","रोग की पहचान","Clinical findings and investigations are reviewed clearly.","जाँच और रिपोर्ट के आधार पर समस्या समझाई जाती है।","https://images.pexels.com/photos/6812508/pexels-photo-6812508.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  ["Treatment Plan","उपचार योजना","Treatment options, visits, and costs are discussed.","उपचार विकल्प, विज़िट और खर्च समझाया जाता है।","https://images.pexels.com/photos/6627347/pexels-photo-6627347.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  ["Treatment","उपचार","The selected procedure is performed with attention to comfort.","चुना गया उपचार आराम और सुरक्षा के साथ किया जाता है।","https://images.pexels.com/photos/6812561/pexels-photo-6812561.jpeg?auto=compress&cs=tinysrgb&w=1200"],
  ["Follow-up Care","पुनः जाँच एवं देखभाल","Review appointments support healing.","फॉलो-अप बेहतर स्वास्थ्य लाभ में मदद करता है।","https://images.pexels.com/photos/6627289/pexels-photo-6627289.jpeg?auto=compress&cs=tinysrgb&w=1200"]
];

export default function PatientJourney() {
  return (
    <section className={styles.section} id="patient-journey">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>Your Visit — आपकी विज़िट</span>
          <h2>A simple and transparent<span> patient journey</span></h2>
          <p>पहले अपॉइंटमेंट से फॉलो-अप तक हर चरण स्पष्ट रूप से समझाया जाता है।</p>
        </div>
        <div className={styles.timeline}>
          {steps.map((s, i) => (
            <article className={styles.step} key={s[0]}>
              <div className={styles.imageWrap}>
                <img src={s[4]} alt={s[0]} loading="lazy" className={styles.image} />
                <span className={styles.number}>{String(i + 1).padStart(2,"0")}</span>
              </div>
              <div className={styles.cardBody}>
                <h3>{s[0]}<span className={styles.hindiTitle}>{s[1]}</span></h3>
                <p>{s[2]}</p>
                <p className={styles.hindiDescription}>{s[3]}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
