import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaArrowDown, FaArrowUp, FaEye, FaEyeSlash, FaFloppyDisk, FaHeading, FaImage, FaPen, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { ArticleBlock, createArticle, deleteArticle, getArticles, updateArticle, WebsiteArticle, WebsiteArticleInput } from "@/lib/articles";
import { uploadToCloudinary } from "@/lib/cloudinary";
import styles from "./ArticleAdmin.module.css";

const emptyForm: WebsiteArticleInput = { title: "", summary: "", author: "Dr. Pankaj & Dr. Anita", blocks: [], published: true };
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const messageFrom = (error: unknown) => error instanceof Error ? error.message : "An unexpected error occurred.";

export default function ArticleAdmin() {
  const [articles, setArticles] = useState<WebsiteArticle[]>([]);
  const [form, setForm] = useState<WebsiteArticleInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const published = useMemo(() => articles.filter((item) => item.published).length, [articles]);

  async function load() {
    try { setLoading(true); setArticles(await getArticles()); }
    catch (err) { setError(messageFrom(err)); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    // Initial synchronization with the secured Firestore collection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  function reset() { setForm(emptyForm); setEditingId(null); setPreview(false); setError(""); setMessage(""); }
  function addTextBlock(type: "heading" | "paragraph") {
    setForm((current) => ({ ...current, blocks: [...current.blocks, { id: newId(), type, text: "" }] }));
  }
  function updateBlock(index: number, patch: Partial<ArticleBlock>) {
    setForm((current) => ({ ...current, blocks: current.blocks.map((block, i) => i === index ? ({ ...block, ...patch } as ArticleBlock) : block) }));
  }
  function removeBlock(index: number) { setForm((current) => ({ ...current, blocks: current.blocks.filter((_, i) => i !== index) })); }
  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= form.blocks.length) return;
    setForm((current) => { const blocks = [...current.blocks]; [blocks[index], blocks[target]] = [blocks[target], blocks[index]]; return { ...current, blocks }; });
  }

  async function addImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true); setError("");
      const uploaded = await uploadToCloudinary(file);
      setForm((current) => ({ ...current, blocks: [...current.blocks, { id: newId(), type: "image", url: uploaded.secure_url, publicId: uploaded.public_id, alt: current.title || "Dental article photograph", caption: "" }] }));
      setMessage("Photo inserted at the end of the article. Use the arrows to position it.");
    } catch (err) { setError(messageFrom(err)); }
    finally { event.target.value = ""; setUploading(false); }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) { setError("Article title and short summary are required."); return; }
    const meaningful = form.blocks.filter((block) => block.type === "image" || block.text.trim());
    if (!meaningful.length) { setError("Add at least one paragraph, heading or photo inside the article."); return; }
    try {
      setSaving(true); setError("");
      const payload = { ...form, blocks: meaningful };
      if (editingId) { await updateArticle(editingId, payload); setMessage("Article updated successfully."); }
      else { await createArticle(payload); setMessage("Article saved successfully."); }
      setForm(emptyForm); setEditingId(null); setPreview(false); await load();
    } catch (err) { setError(messageFrom(err)); }
    finally { setSaving(false); }
  }

  function edit(item: WebsiteArticle) {
    setEditingId(item.id); setForm({ title: item.title, summary: item.summary, author: item.author, blocks: item.blocks, published: item.published });
    setPreview(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function toggle(item: WebsiteArticle) { await updateArticle(item.id, { title: item.title, summary: item.summary, author: item.author, blocks: item.blocks, published: !item.published }); await load(); }
  async function remove(item: WebsiteArticle) { if (!window.confirm(`Delete “${item.title}” permanently?`)) return; await deleteArticle(item.id); if (editingId === item.id) reset(); await load(); }

  return <div className={styles.root}>
    <section className={styles.stats}><article><strong>{articles.length}</strong><span>Total articles</span></article><article><strong>{published}</strong><span>Published</span></article><article><strong>{articles.length - published}</strong><span>Hidden drafts</span></article></section>
    <section className={styles.panel}>
      <div className={styles.heading}><div><span>Website article editor</span><h2>{editingId ? "Edit article" : "Write a new article"}</h2></div>{editingId && <button className={styles.button} type="button" onClick={reset}><FaXmark/> Cancel</button>}</div>
      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}{message && <div className={`${styles.alert} ${styles.success}`}>{message}</div>}
      <form onSubmit={save}>
        <div className={styles.grid}>
          <label>Article title *<input value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} placeholder="Example: Why a root canal saves your tooth"/></label>
          <label>Author<input value={form.author} onChange={(e) => setForm({...form,author:e.target.value})}/></label>
          <label className={styles.wide}>Short summary *<textarea value={form.summary} onChange={(e) => setForm({...form,summary:e.target.value})} placeholder="This appears on the website article card."/></label>
        </div>
        <div className={styles.composer}>
          <div className={styles.composerTitle}><h3>Article content</h3><div className={styles.addMenu}><button className={styles.button} type="button" onClick={() => addTextBlock("heading")}><FaHeading/> Heading</button><button className={styles.button} type="button" onClick={() => addTextBlock("paragraph")}><FaPlus/> Paragraph</button></div></div>
          {form.blocks.map((block,index) => <div className={styles.block} key={block.id}>
            <div className={styles.blockHeader}><span>{block.type === "image" ? "Photo inside article" : block.type}</span><div className={styles.blockActions}><button className={styles.iconButton} type="button" onClick={() => moveBlock(index,-1)} disabled={index===0} aria-label="Move up"><FaArrowUp/></button><button className={styles.iconButton} type="button" onClick={() => moveBlock(index,1)} disabled={index===form.blocks.length-1} aria-label="Move down"><FaArrowDown/></button><button className={`${styles.iconButton} ${styles.danger}`} type="button" onClick={() => removeBlock(index)} aria-label="Remove"><FaTrash/></button></div></div>
            {block.type === "image" ? <div className={styles.imagePreview}><Image src={block.url} alt={block.alt} width={300} height={220}/><div className={styles.imageFields}><label>Photo description (for accessibility)<input value={block.alt} onChange={(e)=>updateBlock(index,{alt:e.target.value})}/></label><label>Optional caption<input value={block.caption} onChange={(e)=>updateBlock(index,{caption:e.target.value})}/></label></div></div> : <textarea rows={block.type === "heading" ? 2 : 6} value={block.text} placeholder={block.type === "heading" ? "Section heading" : "Write the paragraph here..."} onChange={(e)=>updateBlock(index,{text:e.target.value})}/>} 
          </div>)}
          <label className={styles.upload}><FaImage/> {uploading ? "Uploading photo..." : "Insert a photo inside this article"}<input type="file" accept="image/*" onChange={addImage} disabled={uploading}/></label>
        </div>
        <div className={styles.footer}><label className={styles.publish}><input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form,published:e.target.checked})}/> Publish on website</label><div className={styles.addMenu}><button className={styles.button} type="button" onClick={()=>setPreview(!preview)}><FaEye/> {preview ? "Hide preview" : "Preview"}</button><button className={`${styles.button} ${styles.primary}`} disabled={saving}><FaFloppyDisk/> {saving ? "Saving..." : editingId ? "Update article" : "Save article"}</button></div></div>
      </form>
      {preview && <div className={styles.preview}><h1>{form.title || "Article title"}</h1><p className={styles.previewLead}>{form.summary}</p><div className={styles.previewBody}>{form.blocks.map((block) => block.type === "heading" ? <h2 key={block.id}>{block.text}</h2> : block.type === "paragraph" ? <p key={block.id}>{block.text}</p> : <figure key={block.id}><Image src={block.url} alt={block.alt} width={900} height={600}/>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>)}</div></div>}
    </section>
    <section className={styles.panel}><div className={styles.listHeader}><h2>Saved articles</h2><button className={styles.button} type="button" onClick={()=>void load()}>Refresh</button></div>{loading ? <p className={styles.empty}>Loading articles…</p> : !articles.length ? <p className={styles.empty}>No articles saved yet.</p> : <div className={styles.articleList}>{articles.map((item)=><article className={styles.articleRow} key={item.id}><div className={styles.articleInfo}><strong>{item.title}</strong><span>{item.published ? "Published" : "Hidden draft"} · {item.blocks.filter((b)=>b.type==="image").length} photo(s) inside</span></div><div className={styles.rowActions}><button className={styles.iconButton} type="button" onClick={()=>edit(item)} aria-label="Edit"><FaPen/></button><button className={styles.iconButton} type="button" onClick={()=>void toggle(item)} aria-label={item.published?"Hide":"Publish"}>{item.published?<FaEyeSlash/>:<FaEye/>}</button><button className={`${styles.iconButton} ${styles.danger}`} type="button" onClick={()=>void remove(item)} aria-label="Delete"><FaTrash/></button></div></article>)}</div>}</section>
  </div>;
}
