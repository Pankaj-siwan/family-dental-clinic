import { FormEvent, useEffect, useState } from "react";
import { DEFAULT_SITE_CONTENT, getSiteContent, saveSiteContent, SiteContent } from "@/lib/siteContent";
import styles from "./SiteContentAdmin.module.css";

type ArrayKey = "ribbonMessages" | "heroHighlights" | "aboutHighlights";
const lines = (items: string[]) => items.join("\n");
const split = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

export default function SiteContentAdmin() {
  const [form, setForm] = useState(DEFAULT_SITE_CONTENT);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("Loading current website content…");
  const [failed, setFailed] = useState(false);
  useEffect(() => { getSiteContent().then((value) => { setForm(value); setStatus(""); }).catch(() => { setFailed(true); setStatus("Could not load saved content. The website defaults are shown."); }); }, []);
  const field = (key: keyof SiteContent, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const arrayField = (key: ArrayKey, value: string) => setForm((current) => ({ ...current, [key]: split(value) }));
  async function save(event: FormEvent) { event.preventDefault(); try { setSaving(true); setFailed(false); setStatus(""); await saveSiteContent(form); setStatus("Website content published successfully."); } catch (error) { console.error(error); setFailed(true); setStatus("Content could not be saved. Please check your administrator login and try again."); } finally { setSaving(false); } }
  return <div className={styles.root}><header className={styles.intro}><small>Live website editor</small><h2>Edit website content</h2><p>Update the main website wording here. Each line in a list becomes a separate item.</p></header>
    <form className={styles.form} onSubmit={save}>
      <ContentSection title="Moving ribbon"><Area label="Ribbon messages — one per line" value={lines(form.ribbonMessages)} onChange={(v)=>arrayField("ribbonMessages",v)}/></ContentSection>
      <ContentSection title="Homepage hero"><Input label="Small heading" value={form.heroEyebrow} onChange={(v)=>field("heroEyebrow",v)}/><Input label="Main title" value={form.heroTitle} onChange={(v)=>field("heroTitle",v)}/><Input label="Accent title" value={form.heroAccent} onChange={(v)=>field("heroAccent",v)}/><Area label="Introduction" value={form.heroTagline} onChange={(v)=>field("heroTagline",v)}/><Area label="Highlights — one per line" value={lines(form.heroHighlights)} onChange={(v)=>arrayField("heroHighlights",v)}/></ContentSection>
      <ContentSection title="About our clinic"><Input label="Small heading" value={form.aboutEyebrow} onChange={(v)=>field("aboutEyebrow",v)}/><Input label="Heading" value={form.aboutTitle} onChange={(v)=>field("aboutTitle",v)}/><Input label="Highlighted heading" value={form.aboutAccent} onChange={(v)=>field("aboutAccent",v)}/><Area label="Main paragraph" value={form.aboutLead} onChange={(v)=>field("aboutLead",v)}/><Area label="Second paragraph" value={form.aboutBody} onChange={(v)=>field("aboutBody",v)}/><Area label="Clinic highlights — one per line" value={lines(form.aboutHighlights)} onChange={(v)=>arrayField("aboutHighlights",v)}/></ContentSection>
      <ContentSection title="From the Doctors"><Input label="Small heading" value={form.doctorsEyebrow} onChange={(v)=>field("doctorsEyebrow",v)}/><Input label="Section heading" value={form.doctorsTitle} onChange={(v)=>field("doctorsTitle",v)}/><Area label="Introduction" value={form.doctorsIntro} onChange={(v)=>field("doctorsIntro",v)}/></ContentSection>
      <ContentSection title="Contact section"><Input label="Small heading" value={form.contactEyebrow} onChange={(v)=>field("contactEyebrow",v)}/><Input label="Heading" value={form.contactTitle} onChange={(v)=>field("contactTitle",v)}/><Input label="Highlighted heading" value={form.contactAccent} onChange={(v)=>field("contactAccent",v)}/><Area label="Introduction" value={form.contactIntro} onChange={(v)=>field("contactIntro",v)}/></ContentSection>
      <div className={styles.actions}><span className={`${styles.status} ${failed ? styles.error : ""}`}>{status}</span><button className={styles.save} disabled={saving}>{saving ? "Publishing…" : "Publish website changes"}</button></div>
    </form></div>;
}

function ContentSection({title,children}:{title:string;children:React.ReactNode}) { return <section className={styles.section}><h3>{title}</h3><div className={styles.grid}>{children}</div></section>; }
function Input({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}) { return <label>{label}<input value={value} onChange={(e)=>onChange(e.target.value)}/></label>; }
function Area({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}) { return <label className={styles.wide}>{label}<textarea value={value} onChange={(e)=>onChange(e.target.value)}/></label>; }
