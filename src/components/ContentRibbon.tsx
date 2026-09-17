import { FaRegStar } from "react-icons/fa";
import styles from "@/styles/ContentRibbon.module.css";
import { useSiteContent } from "@/lib/siteContent";

export default function ContentRibbon() {
  const content = useSiteContent();
  const repeated = [...content.ribbonMessages, ...content.ribbonMessages];

  return (
    <aside className={styles.ribbon} aria-label="Clinic updates">
      <div className={styles.track}>
        {repeated.map((message, index) => (
          <span key={`${message}-${index}`}>
            <FaRegStar aria-hidden="true" /> {message}
          </span>
        ))}
      </div>
    </aside>
  );
}
