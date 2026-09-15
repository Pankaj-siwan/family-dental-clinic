import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FaRegStar } from "react-icons/fa";
import { db } from "@/lib/firebase";
import styles from "@/styles/ContentRibbon.module.css";

const fallbackMessages = [
  "Complete family dental care",
  "Three convenient clinic locations",
  "Dental implants and advanced treatment planning",
  "Book an appointment online",
];

export default function ContentRibbon() {
  const [messages, setMessages] = useState(fallbackMessages);

  useEffect(() => {
    const ribbonQuery = query(collection(db, "website_ribbon"), where("active", "==", true));
    return onSnapshot(ribbonQuery, (snapshot) => {
      const liveMessages = snapshot.docs
        .map((item) => String(item.data().text ?? item.data().message ?? "").trim())
        .filter(Boolean);
      if (liveMessages.length) setMessages(liveMessages);
    }, () => undefined);
  }, []);

  const repeated = [...messages, ...messages];

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
