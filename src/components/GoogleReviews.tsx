import { FaGoogle, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import styles from "@/styles/GoogleReviews.module.css";

const GOOGLE_BUSINESS_PROFILE_URL =
  "https://google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/data=!4m2!3m1!1s0x0:0xf214d56c0ebefe53?sa=X&ved=1t:2428&ictx=111";

export default function GoogleReviews() {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.container}>
        <div className={styles.iconBox}>
          <FaGoogle />
        </div>

        <div className={styles.content}>
          <span>Google Business Profile</span>
          <h2>View our clinic on Google</h2>
          <p>
            Open the verified Google Business Profile to view the clinic
            location, directions, photographs, updates, and genuine patient
            reviews.
          </p>

          <div className={styles.stars} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar key={index} />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <a
            href={GOOGLE_BUSINESS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryButton}
          >
            <FaGoogle />
            View Google Profile
          </a>

          <a
            href={GOOGLE_BUSINESS_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}
          >
            <FaMapMarkerAlt />
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
