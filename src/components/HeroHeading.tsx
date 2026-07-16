import styles from "@/styles/Hero.module.css";

export default function HeroHeading(){
return(
<div className={styles.heroContent}>
<span className={styles.badge}>★ FAMILY DENTAL CLINIC &amp; IMPLANT CENTRE</span>
<h1 className={styles.heroTitle}>
<span className={styles.dark}>Where Healthy</span>
<span className={styles.accent}>Smiles Begin</span>
</h1>
<p className={styles.heroSubtitle}>
Modern dentistry with compassion, precision, and excellence.
</p>
</div>
);
}
