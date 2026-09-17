import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarCheck, FaTooth } from "react-icons/fa6";
import { getArticle, WebsiteArticle } from "@/lib/articles";
import styles from "@/styles/ArticlePage.module.css";
import richStyles from "@/styles/ArticleRichText.module.css";

export default function ArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState<WebsiteArticle | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!router.isReady || typeof router.query.id !== "string") return;
    getArticle(router.query.id).then((item) => setArticle(item?.published ? item : null)).catch(() => setArticle(null)).finally(() => setLoading(false));
  }, [router.isReady, router.query.id]);
  if (loading) return <main className={styles.state}>Loading article…</main>;
  if (!article) return <main className={styles.state}><FaTooth/><h1>Article not found</h1><Link href="/#from-the-doctors">Return to the website</Link></main>;
  return <><Head><title>{article.title} | Family Dental Clinic Siwan</title><meta name="description" content={article.summary}/></Head><main className={styles.page}>
    <header className={styles.topbar}><Link href="/#from-the-doctors"><FaArrowLeft/> All articles</Link><Link className={styles.book} href="/#appointment"><FaCalendarCheck/> Book appointment</Link></header>
    <article className={styles.article}><div className={styles.intro}><span>From the Doctors</span><h1>{article.title}</h1><p>{article.summary}</p><strong>{article.author}</strong></div>
      {article.contentHtml ? <div className={`${styles.body} ${richStyles.content}`} dangerouslySetInnerHTML={{ __html: article.contentHtml }} /> : <div className={styles.body}>{article.blocks.map((block) => block.type === "heading" ? <h2 key={block.id}>{block.text}</h2> : block.type === "paragraph" ? <p key={block.id}>{block.text}</p> : <figure key={block.id}><div className={styles.image}><Image src={block.url} alt={block.alt || article.title} fill sizes="(max-width: 760px) 100vw, 820px"/></div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>)}</div>}
      <footer className={styles.footer}><FaTooth/><div><strong>Family Dental Clinic &amp; Implant Center</strong><span>Trusted dental care in Siwan</span></div><Link href="/#appointment">Book an appointment</Link></footer>
    </article></main></>;
}
