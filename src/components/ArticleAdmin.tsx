import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaBold, FaEye, FaEyeSlash, FaFloppyDisk, FaImage, FaItalic, FaPen, FaTrash, FaXmark, FaWandMagicSparkles } from "react-icons/fa6";
import { createArticle, deleteArticle, getArticles, updateArticle, WebsiteArticle, WebsiteArticleInput } from "@/lib/articles";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { auth } from "@/lib/firebase";
import styles from "./ArticleAdmin.module.css";
import advanced from "./ArticleAdvanced.module.css";

const emptyForm: WebsiteArticleInput = { title: "", summary: "", author: "Dr. Pankaj & Dr. Anita", contentHtml: "", coverImageUrl: "", blocks: [], published: true };
const messageFrom = (error: unknown) => error instanceof Error ? error.message : "An unexpected error occurred.";
type AiArrangement = { name: string; description: string; html: string };
type AiReview = { issues: string[]; arrangements: AiArrangement[] };

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
  const [aiReview, setAiReview] = useState<AiReview | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const savedRange = useRef<Range | null>(null);
  const drawStart = useRef<{x:number;y:number}|null>(null);
  const draftBox = useRef<{left:number;top:number;width:number;height:number}|null>(null);
  const drawPreview = useRef<HTMLSpanElement|null>(null);
  const draggingBox = useRef<{element:HTMLElement;offsetX:number;offsetY:number}|null>(null);

  async function load() { try { setArticles(await getArticles()); } catch (err) { setError(messageFrom(err)); } }
  useEffect(() => {
    // Initial synchronization with the secured article collection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);
  function addDragHandles() { editorRef.current?.querySelectorAll<HTMLElement>(".article-drawn-textbox").forEach((box) => { if (!box.querySelector(".textbox-drag-handle")) { const handle=document.createElement("span"); handle.className="textbox-drag-handle"; handle.contentEditable="false"; handle.textContent="✥ Drag text box"; box.prepend(handle); } }); }
  function setEditor(html: string) { if (editorRef.current) { editorRef.current.innerHTML = html; addDragHandles(); } }
  function syncEditor() { setForm((current) => ({ ...current, contentHtml: editorRef.current?.innerHTML ?? "" })); }
  function rememberCursor() { const selection = window.getSelection(); if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) savedRange.current = selection.getRangeAt(0).cloneRange(); }
  function restoreCursor() { const selection = window.getSelection(); if (!selection || !savedRange.current) { editorRef.current?.focus(); return; } selection.removeAllRanges(); selection.addRange(savedRange.current); }
  function format(command: string, value?: string) { restoreCursor(); document.execCommand(command, false, value); syncEditor(); rememberCursor(); }
  function startBox(event: React.MouseEvent<HTMLDivElement>) { if (!editorRef.current) return; const target=event.target as HTMLElement,handle=target.closest(".textbox-drag-handle"),existing=target.closest<HTMLElement>(".article-drawn-textbox"); if(handle&&existing){event.preventDefault();const boxBounds=existing.getBoundingClientRect();draggingBox.current={element:existing,offsetX:event.clientX-boxBounds.left,offsetY:event.clientY-boxBounds.top};existing.classList.add("is-dragging");return;} if (!drawMode) return; event.preventDefault(); const bounds=editorRef.current.getBoundingClientRect(); drawStart.current={x:event.clientX-bounds.left,y:event.clientY-bounds.top}; draftBox.current={left:drawStart.current.x,top:drawStart.current.y,width:0,height:0}; const preview=document.createElement("span"); preview.className=advanced.draftBox; editorRef.current.appendChild(preview); drawPreview.current=preview; }
  function sizeBox(event: React.MouseEvent<HTMLDivElement>) { if(!editorRef.current)return; if(draggingBox.current){event.preventDefault();const bounds=editorRef.current.getBoundingClientRect(),drag=draggingBox.current;const left=Math.max(0,Math.min(editorRef.current.clientWidth-drag.element.offsetWidth,event.clientX-bounds.left-drag.offsetX));const top=Math.max(0,event.clientY-bounds.top-drag.offsetY);drag.element.style.left=`${left/editorRef.current.clientWidth*100}%`;drag.element.style.top=`${top}px`;return;} if (!drawMode || !drawStart.current) return; const bounds=editorRef.current.getBoundingClientRect(); const x=event.clientX-bounds.left,y=event.clientY-bounds.top; const next={left:Math.min(x,drawStart.current.x),top:Math.min(y,drawStart.current.y),width:Math.abs(x-drawStart.current.x),height:Math.abs(y-drawStart.current.y)}; draftBox.current=next; if(drawPreview.current) Object.assign(drawPreview.current.style,{left:`${next.left}px`,top:`${next.top}px`,width:`${next.width}px`,height:`${next.height}px`}); }
  function finishDragging(){if(!draggingBox.current)return false;draggingBox.current.element.classList.remove("is-dragging");draggingBox.current=null;syncEditor();return true;}
  function finishBox() { const drawn=draftBox.current; if (!drawMode || !drawn || !editorRef.current) return; drawPreview.current?.remove(); const box=document.createElement("div"); const editorWidth=editorRef.current.clientWidth; box.className="article-drawn-textbox"; box.contentEditable="true"; box.innerHTML='<span class="textbox-drag-handle" contenteditable="false">✥ Drag text box</span><p>Type here…</p>'; box.style.cssText=`position:absolute;left:${Math.max(0,drawn.left/editorWidth*100)}%;top:${Math.max(0,drawn.top)}px;width:${Math.max(120,drawn.width)/editorWidth*100}%;min-height:${Math.max(70,drawn.height)}px;border:2px solid #0f766e;border-radius:10px;padding:12px;background:#f4fffc;resize:both;overflow:auto;z-index:2;`; editorRef.current.appendChild(box); syncEditor(); drawStart.current=null; draftBox.current=null; drawPreview.current=null; setDrawMode(false); box.querySelector<HTMLElement>("p")?.focus(); }
  function addLink() { const url = window.prompt("Paste the web link"); if (url) format("createLink", url); }
  async function reviewWithAi() {
    const html = cleanHtml(editorRef.current?.innerHTML ?? "");
    if (!editorRef.current?.innerText.trim()) { setError("Write some article content before asking AI to review it."); return; }
    try {
      setReviewing(true); setError(""); setAiReview(null);
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/article-ai", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` }, body: JSON.stringify({ title: form.title, html }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "AI review failed."); setAiReview(data);
    } catch (err) { setError(messageFrom(err)); } finally { setReviewing(false); }
  }
  function applyAiVersion(arrangement: AiArrangement) { setEditor(arrangement.html); setForm((current) => ({ ...current, contentHtml: arrangement.html })); setMessage(`“${arrangement.name}” applied. Review it before publishing.`); }
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
    if (!form.title.trim()) { setError("Article title is required."); return; }
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
    <form onSubmit={save}><div className={styles.details}><label>Article title *<input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="Write the article title"/></label><label>Author<input value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})}/></label><label className={styles.wide}>Short summary (optional)<textarea value={form.summary} onChange={(e)=>setForm({...form,summary:e.target.value})} placeholder="Add only if you want a short introduction on the homepage"/></label></div>
      <div className={`${styles.toolbar} ${advanced.toolbar}`}>
        <select aria-label="Text style" onChange={(e)=>format("formatBlock",e.target.value)} defaultValue="p"><option value="p">Paragraph</option><option value="h2">Heading</option><option value="h3">Subheading</option><option value="blockquote">Quote</option></select>
        <select aria-label="Font" onChange={(e)=>format("fontName",e.target.value)} defaultValue="Arial"><option>Arial</option><option>Georgia</option><option>Verdana</option><option>Tahoma</option><option>Times New Roman</option></select>
        <select aria-label="Text size" onChange={(e)=>format("fontSize",e.target.value)} defaultValue="3"><option value="2">Small</option><option value="3">Normal</option><option value="4">Large</option><option value="5">Extra large</option><option value="6">Title</option></select>
        <button type="button" onMouseDown={(e)=>{e.preventDefault();format("bold");}}><FaBold/></button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("italic");}}><FaItalic/></button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("underline");}}>U</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("strikeThrough");}}>S̶</button>
        <label className={advanced.colorTool} title="Text colour">A<input type="color" onChange={(e)=>format("foreColor",e.target.value)}/></label><label className={advanced.colorTool} title="Highlight">▰<input type="color" defaultValue="#fff59d" onChange={(e)=>format("hiliteColor",e.target.value)}/></label>
        <button type="button" onMouseDown={(e)=>{e.preventDefault();format("justifyLeft");}}>Left</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("justifyCenter");}}>Centre</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("justifyRight");}}>Right</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("justifyFull");}}>Justify</button>
        <button type="button" onMouseDown={(e)=>{e.preventDefault();format("insertUnorderedList");}}>• List</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("insertOrderedList");}}>1. List</button><button type="button" onMouseDown={(e)=>{e.preventDefault();addLink();}}>Link</button><button className={drawMode?advanced.activeTool:""} type="button" onClick={()=>setDrawMode((value)=>!value)}>▱ {drawMode?"Drag on page…":"Draw text box"}</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("removeFormat");}}>Clear format</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("undo");}}>Undo</button><button type="button" onMouseDown={(e)=>{e.preventDefault();format("redo");}}>Redo</button>
        <button type="button" onMouseDown={(e)=>{e.preventDefault();rememberCursor();imageInputRef.current?.click();}} disabled={uploading}><FaImage/> {uploading ? "Uploading…" : "Insert photo"}</button><input ref={imageInputRef} className={styles.hiddenInput} type="file" accept="image/*" onChange={insertPhoto}/>
      </div>
      <div ref={editorRef} className={`${styles.editor} ${drawMode?advanced.drawing:""}`} contentEditable={!drawMode} suppressContentEditableWarning onInput={syncEditor} onKeyUp={rememberCursor} onMouseDown={startBox} onMouseMove={sizeBox} onMouseUp={()=>{if(finishDragging())return;if(drawMode)finishBox();else rememberCursor();}} onMouseLeave={()=>{finishDragging();}} data-placeholder="Start writing your article here…" />
      <section className={advanced.aiPanel}><div><FaWandMagicSparkles/><div><strong>AI correction & professional arrangement</strong><span>Checks language, paragraph flow and photo placement, then prepares three complete layouts. Your draft is sent securely for this review.</span></div></div><button type="button" onClick={()=>void reviewWithAi()} disabled={reviewing}>{reviewing ? "Creating 3 arrangements…" : "Review with AI"}</button>{aiReview && <div className={advanced.aiResults}><div className={advanced.corrections}><h4>Corrections and improvements</h4><ul>{aiReview.issues.map((item,index)=><li key={index}>{item}</li>)}</ul></div><div className={advanced.arrangementGrid}>{aiReview.arrangements.map((option,index)=><article key={`${option.name}-${index}`}><span>Option {index+1}</span><h4>{option.name}</h4><p>{option.description}</p><button type="button" onClick={()=>applyAiVersion(option)}>Apply this layout</button></article>)}</div></div>}</section>
      <div className={styles.footer}><label><input type="checkbox" checked={form.published} onChange={(e)=>setForm({...form,published:e.target.checked})}/> Publish on website</label><button className={styles.primary} disabled={saving}><FaFloppyDisk/> {saving ? "Saving…" : editingId ? "Update article" : "Publish article"}</button></div>
    </form></section>
    <section className={styles.listPanel}><h2>Saved articles</h2>{!articles.length ? <p>No articles saved yet.</p> : <div className={styles.list}>{articles.map((article)=><article key={article.id}><div><strong>{article.title}</strong><span>{article.published ? "Published" : "Hidden draft"}</span></div><div className={styles.rowActions}><button type="button" onClick={()=>edit(article)}><FaPen/></button><button type="button" onClick={()=>void toggle(article)}>{article.published?<FaEyeSlash/>:<FaEye/>}</button><button type="button" onClick={()=>void remove(article)}><FaTrash/></button></div></article>)}</div>}</section>
  </div>;
}
