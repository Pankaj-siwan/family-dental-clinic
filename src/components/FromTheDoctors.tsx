import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FaBookOpen, FaCamera, FaExternalLinkAlt, FaQuoteLeft } from "react-icons/fa";
import DoctorVideos from "@/components/DoctorVideos";
import { db } from "@/lib/firebase";
import styles from "@/styles/FromTheDoctors.module.css";
import { useSiteContent } from "@/lib/siteContent";

type Article = { id: string; title: string; summary: string; doctor: string; imageUrl: string; dynamic?: boolean };
type GalleryItem = { id: string; title: string; caption: string; imageUrl: string };

const fallbackArticles: Article[] = [
  { id: "prevention", title: "Prevention begins with daily habits", summary: "Simple brushing, cleaning between teeth and timely check-ups can prevent many common dental problems.", doctor: "Dr. Pankaj", imageUrl: "/images/dr-pankaj-official.png" },
  { id: "family-care", title: "Building healthy smiles as a family", summary: "Children learn oral-health habits by watching adults. A calm, regular routine makes dental care easier for everyone.", doctor: "Dr. Anita", imageUrl: "/images/dr-anita-official.jpg" },
];

export default function FromTheDoctors() {
  const content = useSiteContent();
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const articleQuery = query(collection(db, "website_articles"), where("published", "==", true));
    const galleryQuery = query(collection(db, "website_gallery"), where("published", "==", true));
    const unsubscribeArticles = onSnapshot(articleQuery, (snapshot) => {
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        const firstImage = Array.isArray(data.blocks) ? data.blocks.find((block: { type?: unknown; url?: unknown }) => block?.type === "image" && block?.url) : null;
        return { id: doc.id, title: String(data.title ?? "Dental guidance"), summary: String(data.summary ?? data.excerpt ?? data.content ?? "").slice(0, 260), doctor: String(data.doctor ?? data.author ?? "From our doctors"), imageUrl: String(data.coverImageUrl ?? firstImage?.url ?? data.imageUrl ?? data.photoUrl ?? ""), dynamic: true };
      });
      if (items.length) setArticles(items.slice(0, 4));
    }, () => undefined);
    const unsubscribeGallery = onSnapshot(galleryQuery, (snapshot) => {
      setGallery(snapshot.docs.map((doc) => { const data = doc.data(); return { id: doc.id, title: String(data.title ?? "From our clinic"), caption: String(data.caption ?? data.description ?? ""), imageUrl: String(data.imageUrl ?? data.photoUrl ?? data.url ?? "") }; }).filter((item) => item.imageUrl).slice(0, 6));
    }, () => undefined);
    return () => { unsubscribeArticles(); unsubscribeGallery(); };
  }, []);

  return (
    <section className={styles.section} id="from-the-doctors">
      <div className={styles.container}>
        <header className={styles.heading}>
          <div><span className={styles.eyebrow}><FaQuoteLeft /> {content.doctorsEyebrow}</span><h2>{content.doctorsTitle}</h2></div>
          <p>{content.doctorsIntro}</p>
        </header>

        <div className={styles.articleGrid}>
          {articles.map((article) => (
            <article className={styles.article} key={article.id}>
              <div className={styles.articleImage}><Image src={article.imageUrl || "/images/clinic-front.jpg"} alt="" fill sizes="(max-width: 760px) 100vw, 340px" /></div>
              <div><span><FaBookOpen /> Doctor&apos;s article</span><h3>{article.title}</h3>{article.summary && <p>{article.summary}</p>}<strong>{article.doctor}</strong>{article.dynamic && <Link href={`/articles/${article.id}`}>Read full article <FaExternalLinkAlt /></Link>}</div>
            </article>
          ))}
        </div>

        <DoctorVideos />

        <div className={styles.galleryBlock}>
          <div className={styles.galleryHeading}><span><FaCamera /> Photo journal</span><h3>A closer look at our clinical work</h3><p>Photographs and updates published from the Website Admin app appear here automatically.</p></div>
          {gallery.length ? (
            <div className={styles.galleryGrid}>{gallery.map((item) => <figure key={item.id}><div><Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 700px) 100vw, 28vw" /></div><figcaption><strong>{item.title}</strong>{item.caption && <span>{item.caption}</span>}</figcaption></figure>)}</div>
          ) : (
            <a className={styles.galleryFallback} href="https://www.google.com/maps?cid=17443801916793355859" target="_blank" rel="noopener noreferrer"><FaCamera /><div><strong>Clinic photographs & updates</strong><span>View our latest public photographs on Google</span></div><FaExternalLinkAlt /></a>
          )}
        </div>
      </div>
    </section>
  );
}
