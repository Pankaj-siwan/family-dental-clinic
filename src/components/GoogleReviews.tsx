import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { FaExternalLinkAlt, FaGoogle, FaQuoteLeft, FaStar } from "react-icons/fa";
import { db } from "@/lib/firebase";
import styles from "@/styles/GoogleReviews.module.css";

const GOOGLE_PROFILE = "https://google.com/maps/place/FAMILY+DENTAL+CLINIC+%26+IMPLANT+CENTRE+%5BDr.+Pankaj+(MDS);+Dr.+Anita+Kumari(BDS)%5D+(SIWAN)/data=!4m2!3m1!1s0x0:0xf214d56c0ebefe53?sa=X&ved=1t:2428&ictx=111";
type Review = { name: string; text: string; rating: number };

export default function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => onSnapshot(doc(db, "website_settings", "google_reviews"), (snapshot) => {
    const value = snapshot.data()?.items;
    if (!Array.isArray(value)) return;
    setReviews(value.map((item) => ({ name: String(item.name ?? "Google reviewer"), text: String(item.text ?? ""), rating: Math.min(5, Math.max(1, Number(item.rating ?? 5))) })).filter((item) => item.text));
  }, () => undefined), []);

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.container}>
        <header className={styles.heading}>
          <div><span><FaGoogle /> Google Reviews</span><h2>Experiences shared by our patients</h2></div>
          <p>We display only selected feedback copied from our genuine Google Business Profile. Open Google to read the complete, current review history.</p>
        </header>
        {reviews.length > 0 && <div className={styles.reviewGrid}>{reviews.slice(0, 3).map((review, index) => <article key={`${review.name}-${index}`}><FaQuoteLeft className={styles.quote} /><div className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }).map((_, star) => <FaStar key={star} />)}</div><p>{review.text}</p><strong>{review.name}</strong><span>Google review</span></article>)}</div>}
        <div className={styles.googleCard}>
          <div className={styles.googleMark}><FaGoogle /></div>
          <div><strong>{reviews.length ? "See every review on Google" : "Read genuine patient reviews on Google"}</strong><span>Ratings and review counts can change; Google is the authoritative source.</span></div>
          <a href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer">Open Google Reviews <FaExternalLinkAlt /></a>
          <a className={styles.writeButton} href={GOOGLE_PROFILE} target="_blank" rel="noopener noreferrer">Write a Review</a>
        </div>
      </div>
    </section>
  );
}
