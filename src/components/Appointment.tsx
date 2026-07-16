import {
  FaCalendarCheck,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/Appointment.module.css";

export default function Appointment() {
  return (
    <section className={styles.section} id="appointment">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <FaCalendarCheck />
            Book an Appointment
          </span>

          <h2>
            Take the next step toward a
            <span> healthier smile</span>
          </h2>

          <p>
            Contact Family Dental Clinic &amp; Implant Center to schedule a
            dental consultation. For urgent dental concerns, calling the clinic
            directly is recommended.
          </p>

          <div className={styles.details}>
            <div className={styles.detail}>
              <FaPhoneAlt />
              <div>
                <span>Call the clinic</span>
                <a href="tel:+918618528975">+91 86185 28975</a>
              </div>
            </div>

            <div className={styles.detail}>
              <FaMapMarkerAlt />
              <div>
                <span>Clinic location</span>
                <strong>Fatehpur Bypass Road, Siwan, Bihar</strong>
              </div>
            </div>

            <div className={styles.detail}>
              <FaClock />
              <div>
                <span>Clinic timings</span>
                <strong>Contact the clinic for available slots</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.cardIcon}>
            <FaWhatsapp />
          </div>

          <h3>Quick appointment assistance</h3>

          <p>
            Send a WhatsApp message with the patient’s name, dental concern,
            and preferred appointment time.
          </p>

          <a
            href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment.%20Patient%20name%3A%20%20Dental%20concern%3A%20%20Preferred%20time%3A"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <FaWhatsapp />
            Book on WhatsApp
          </a>

          <a href="tel:+918618528975" className={styles.callButton}>
            <FaPhoneAlt />
            Call Now
          </a>

          <small>
            Appointment confirmation depends on the availability of the
            selected time slot.
          </small>
        </div>
      </div>
    </section>
  );
}
