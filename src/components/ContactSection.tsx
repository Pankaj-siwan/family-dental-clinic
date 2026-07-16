import {
  FaClock,
  FaDirections,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import styles from "@/styles/ContactSection.module.css";

const GOOGLE_MAP_URL =
  "https://google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/data=!4m2!3m1!1s0x0:0xf214d56c0ebefe53?sa=X&ved=1t:2428&ictx=111";

const GOOGLE_MAP_EMBED_URL =
  "https://www.google.com/maps?q=FAMILY%20DENTAL%20CLINIC%20%26%20IMPLANT%20CENTRE%20%5BDr.%20Pankaj%20%28MDS%29%3B%20Dr.%20Anita%20Kumari%20%28BDS%29%5D%20%28SIWAN%29&output=embed";

export default function ContactSection() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaMapMarkerAlt />
            Visit Our Clinic
          </span>

          <h2>
            Find Family Dental Clinic
            <span> &amp; Implant Centre</span>
          </h2>

          <p>
            Use the interactive Google Map for the clinic location, directions,
            and nearby landmarks. Please call before visiting to confirm the
            available appointment time.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.mapCard}>
            <iframe
              className={styles.map}
              src={GOOGLE_MAP_EMBED_URL}
              title="Family Dental Clinic and Implant Centre location on Google Maps"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className={styles.mapActions}>
              <a
                href={GOOGLE_MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsButton}
              >
                <FaDirections />
                Get Directions
              </a>

              <a href="tel:+918618528975" className={styles.callButton}>
                <FaPhoneAlt />
                Call Clinic
              </a>
            </div>
          </div>

          <div className={styles.infoPanel}>
            <div className={styles.clinicName}>
              <span>Family Dental Clinic &amp; Implant Centre</span>
              <strong>
                Dr. Pankaj (MDS) &amp; Dr. Anita Kumari (BDS)
              </strong>
            </div>

            <article className={styles.infoCard}>
              <FaMapMarkerAlt />
              <div>
                <span>Clinic Address</span>
                <strong>
                  Fatehpur Bypass Road, in front of RC Complex, Siwan, Bihar
                </strong>
              </div>
            </article>

            <article className={styles.infoCard}>
              <FaPhoneAlt />
              <div>
                <span>Call</span>
                <a href="tel:+918618528975">+91 86185 28975</a>
              </div>
            </article>

            <article className={styles.infoCard}>
              <FaWhatsapp />
              <div>
                <span>WhatsApp</span>
                <a
                  href="https://wa.me/918618528975?text=Hello%2C%20I%20would%20like%20to%20book%20a%20dental%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book an appointment
                </a>
              </div>
            </article>

            <article className={styles.infoCard}>
              <FaClock />
              <div>
                <span>Clinic Timing</span>
                <strong>Call the clinic for current appointment slots</strong>
              </div>
            </article>

            <a
              href={GOOGLE_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileDirections}
            >
              <FaDirections />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
