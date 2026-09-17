import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaBold, FaEye, FaEyeSlash, FaFloppyDisk, FaImage, FaItalic, FaPen, FaTrash, FaXmark } from "react-icons/fa6";
import { createArticle, deleteArticle, getArticles, updateArticle, WebsiteArticle, WebsiteArticleInput } from "@/lib/articles";
import { uploadToCloudinary } from "@/lib/cloudinary";
import styles from "./ArticleAdmin.module.css";

const emptyForm: WebsiteArticleInput = { title: "", summary: "", author: "Dr. Pankaj & Dr. Anita", contentHtml: "", coverImageUrl: "", blocks: [], published: true };
const messageFrom = (error: unknown) => error instanceof Error ? error.message : "An unexpected error occurred.";

function legacyHtml(article: WebsiteArticle) {
  if (article.contentHtml) return article.contentHtml;
  return article.blocks.map((block) => block.type === "heading" ? `<h2>${block.text}</h2>` : block.type === "paragraph" ? `<p>${block.text}</p>` : `<figure><img src="${block.url}" alt="${block.alt}">${block.caption ? `<figcaption>${block.caption}</figcaption>` : ""}</figure>`).join("");
}

function cleanHtml(html: string) {
  const copy = new DOMParser().parseFromString(html, "text/html");
  copy.querySelectorAll("script,style,iframe,object,embed").forEach((node) => node.remove());
  copy.body.querySelectorAll("*").forEach((node) => [...node.attributes].forEach((attribute) => {
    if (attribute.name.toLowerCase().startsWith("on") || attribute.value.trim().toLowerCase().startsWith("javascript:")) node.removeAttribute(attribute.name);
  }));
  return copy.body.innerHTML;
}

export default function ArticleAdmin() {
  const [articles, setArticles] = useState<WebsiteArticle[]>([]);
  const [form, setForm] = useState<WebsiteArticleInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);

  async function load() { try { setArticles(await getArticles()); } catch (err) { setError(messageFrom(err)); } }
  useEffect(() => {
    // Initial synchronization with the secured article collection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  function setEditor(html: string) { if (editorRef.current) editorRef.current.innerHTML = html; }
  function syncEditor() { setForm((current) => ({ ...current, contentHtml: editorRef.current?.innerHTML ?? "" })); }
  function rememberCursor() { const selection = window.getSelection(); if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) savedRange.current = selection.getRangeAt(0).cloneRange(); }
  function restoreCursor() { const selection = window.getSelection(); if (!selection || !savedRange.current) { editorRef.current?.focus(); return; } selection.removeAllRanges(); selection.addRange(savedRange.current); }
  function format(command: "bold" | "italic") { restoreCursor(); document.execCommand(command); syncEditor(); rememberCursor(); }
  function reset() { setForm(emptyForm); setEditingId(null); setError(""); setMessage(""); setEditor(""); }
  function edit(article: WebsiteArticle) {
    const html = legacyHtml(article);
    setEditingId(article.id); setForm({ title: article.title, summary: article.summary, author: article.author, contentHtml: html, coverImageUrl: article.coverImageUrl || article.blocks.find((b) => b.type === "image")?.url || "", blocks: article.blocks, published: article.published });
    requestAnimationFrame(() => setEditor(html)); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function insertPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    try { setUploading(true); setError(""); const result = await uploadToCloudinary(file); restoreCursor(); document.execCommand("insertHTML", false, `<figure><img src="${result.secure_url}" alt="Dental article photograph"><figcaption></figcaption></figure><p><br></p>`); setForm((current) => ({ ...current, contentHtml: editorRef.current?.innerHTML ?? current.contentHtml, coverImageUrl: current.coverImageUrl || result.secure_url })); setMessage("Photo inserted at the cursor position."); }
    catch (err) { setError(messageFrom(err)); } finally { event.target.value = ""; setUploading(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); const html = cleanHtml(editorRef.current?.innerHTML ?? ""); const plainText = editorRef.current?.innerText.trim() ?? "";
    if (!form.title.trim() || !form.summary.trim()) { setError("Article title and short summary are required."); return; }
    if (!plainText && !html.includes("<img")) { setError("Please write the article before publishing it."); return; }
    const payload = { ...form, contentHtml: html };
    try { setSaving(true); setError(""); if (editingId) { await updateArticle(editingId, payload); setMessage("Article updated successfully."); } else { await createArticle(payload); setMessage("Article published successfully."); } reset(); await load(); }
    catch (err) { setError(messageFrom(err)); } finally { setSaving(false); }
  }
  async function toggle(article: WebsiteArticle) { await updateArticle(article.id, { title: article.title, summary: article.summary, author: article.author, contentHtml: legacyHtml(article), coverImageUrl: article.coverImageUrl, blocks: article.blocks, published: !article.published }); await load(); }
  async function remove(article: WebsiteArticle) { if (!window.confirm(`Delete “${article.title}” permanently?`)) return; await deleteArticle(article.id); if (editingId === article.id) reset(); await load(); }

  return <div className={styles.root}><section className={styles.paperPanel}>
    <div className={styles.topline}><div><span>Word-style article editor</span><h2>{editingId ? "Edit article" : "Write a new article"}</h2></div>{editingId && <button className={styles.secondary} type="button" onClick={reset}><FaXmark/> Cancel</button>}</div>
    {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}{message && <div className={`${styles.alert} ${styles.success}`}>{message}</div>}
    <form onSubmit={save}><div className={styles.details}><label>Article title *<input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Write the article title"/></label><label>Author<input value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})}/></label><label className={styles.wide}>Short summary *<textarea value={form.summary} onChange={(e)=>setForm({...form,summary:e.target.value})} placeholder="A short introduction shown on the homepage"/></label></div>
      <div className={styles.toolbar}><button type="button" onMouseDown={(e)=>{e.preventDefault();format("bold");}}><FaBold/> Bold</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("italic");}}><FaItalic/> Italic</button><button type="button" onMouseDown={(e)=>{e.preventDefault();rememberCursor();imageInputRef.current?.click();}} disabled={uploading}><FaImage/> {uploading ? "Uploading…" : "Insert photo"}</button><input ref={imageInputRef} className={styles.hiddenInput} type="file" accept="image/*" onChange={insertPhoto}/></div>
      <div ref={editorRef} className={styles.editor} contentEditable suppressContentEditableWarning onInput={syncEditor} onKeyUp={rememberCursor} onMouseUp={rememberCursor} data-placeholder="Start writing your article here…" />
      <div className={styles.footer}><label><input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form,published:e.target.checked})}/> Publish on website</label><button className={styles.primary} disabled={saving}><FaFloppyDisk/> {saving ? "Saving…" : editingId ? "Update article" : "Publish article"}</button></div>
    </form></section>
    <section className={styles.listPanel}><h2>Saved articles</h2>{!articles.length ? <p>No articles saved yet.</p> : <div className={styles.list}>{articles.map((article)=><article key={article.id}><div><strong>{article.title}</strong><span>{article.published ? "Published" : "Hidden draft"}</span></div><div className={styles.rowActions}><button type="button" onClick={()=>edit(article)}><FaPen/></button><button type="button" onClick={()=>void toggle(article)}>{article.published?<FaEyeSlash/>:<FaEye/>}</button><button type="button" onClick={()=>void remove(article)}><FaTrash/></button></div></article>)}</div>}</section>
  </div>;
}
