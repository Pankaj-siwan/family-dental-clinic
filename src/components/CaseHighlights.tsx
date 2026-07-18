"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaCamera, FaEdit, FaImages, FaInfoCircle, FaPlus, FaSave, FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import styles from "@/styles/CaseHighlights.module.css";

type ClinicalCase = {
  id: number;
  category: string;
  title: string;
  tooth: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  visits: string;
  photos: string[];
};

type CaseForm = Omit<ClinicalCase, "id">;

const STORAGE_KEY = "family-dental-clinical-cases-v3";
const OLD_KEYS = ["family-dental-clinical-cases-v2", "family-dental-clinical-cases-v1"];
const emptyForm: CaseForm = { category: "", title: "", tooth: "", complaint: "", diagnosis: "", treatment: "", outcome: "", visits: "", photos: [] };

function migrate(raw: any): ClinicalCase {
  return {
    id: Number(raw.id) || Date.now() + Math.floor(Math.random() * 10000),
    category: String(raw.category ?? ""), title: String(raw.title ?? ""), tooth: String(raw.tooth ?? ""),
    complaint: String(raw.complaint ?? ""), diagnosis: String(raw.diagnosis ?? ""), treatment: String(raw.treatment ?? ""),
    outcome: String(raw.outcome ?? ""), visits: String(raw.visits ?? ""),
    photos: Array.isArray(raw.photos) ? raw.photos.filter(Boolean) : [raw.beforeImage, raw.afterImage].filter(Boolean),
  };
}

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error(`${file.name} is not an image.`));
    if (file.size > 4 * 1024 * 1024) return reject(new Error(`${file.name} is larger than 4 MB.`));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

export default function CaseHighlights() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CaseForm>(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      if (current) return setCases((JSON.parse(current) as any[]).map(migrate));
      for (const key of OLD_KEYS) {
        const old = localStorage.getItem(key);
        if (!old) continue;
        const migrated = (JSON.parse(old) as any[]).map(migrate);
        setCases(migrated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        break;
      }
    } catch { setCases([]); }
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(cases.map(c => c.category.trim()).filter(Boolean))).sort()], [cases]);
  const visibleCases = activeCategory === "All" ? cases : cases.filter(c => c.category === activeCategory);
  const saveCases = (next: ClinicalCase[]) => { setCases(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const updateField = <K extends keyof CaseForm>(key: K, value: CaseForm[K]) => setForm(v => ({ ...v, [key]: value }));

  const openNew = () => { setEditingId(null); setForm(emptyForm); setError(""); setShowEditor(true); };
  const openEdit = (c: ClinicalCase) => { setEditingId(c.id); setForm({ ...c, photos: [...c.photos] }); setSelectedCase(null); setError(""); setShowEditor(true); };
  const closeEditor = () => { setShowEditor(false); setEditingId(null); setForm(emptyForm); setError(""); };

  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    try {
      const photos = await Promise.all(files.map(readImage));
      setForm(v => ({ ...v, photos: [...v.photos, ...photos] }));
      setError(""); event.target.value = "";
    } catch (e) { setError(e instanceof Error ? e.message : "Photo upload failed."); }
  };

  const removePhoto = (index: number) => setForm(v => ({ ...v, photos: v.photos.filter((_, i) => i !== index) }));
  const movePhoto = (from: number, to: number) => {
    if (to < 0 || to >= form.photos.length) return;
    setForm(v => { const next = [...v.photos]; const [item] = next.splice(from, 1); next.splice(to, 0, item); return { ...v, photos: next }; });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.category.trim() || !form.title.trim() || !form.complaint.trim() || !form.diagnosis.trim() || !form.treatment.trim() || !form.outcome.trim()) {
      return setError("Please complete category, title, concern, diagnosis, treatment and outcome.");
    }
    if (!form.photos.length) return setError("Please upload at least one photograph.");
    const clean = { ...form, category: form.category.trim(), title: form.title.trim(), tooth: form.tooth.trim(), complaint: form.complaint.trim(), diagnosis: form.diagnosis.trim(), treatment: form.treatment.trim(), outcome: form.outcome.trim(), visits: form.visits.trim(), photos: [...form.photos] };
    if (editingId !== null) saveCases(cases.map(c => c.id === editingId ? { id: editingId, ...clean } : c));
    else saveCases([{ id: Date.now(), ...clean }, ...cases]);
    setActiveCategory("All"); closeEditor();
  };

  const deleteCase = (id: number) => {
    const target = cases.find(c => c.id === id);
    if (!target || !window.confirm(`Delete "${target.title}" permanently?`)) return;
    const next = cases.filter(c => c.id !== id); saveCases(next); if (selectedCase?.id === id) setSelectedCase(null);
    if (activeCategory !== "All" && !next.some(c => c.category === activeCategory)) setActiveCategory("All");
  };

  return <section className={styles.section} id="cases"><div className={styles.container}>
    <div className={styles.headingArea}><span className={styles.eyebrow}><FaImages /> Clinical Case Highlights</span><h2>Selected cases from our <span>clinical practice</span></h2><p>Add any case title and upload multiple photographs. There are no before-and-after labels.</p><button className={styles.addCaseButton} onClick={openNew}><FaPlus /> Upload New Case</button></div>
    <div className={styles.filters}>{categories.map(category => <button key={category} className={`${styles.filterButton} ${activeCategory === category ? styles.activeFilter : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
    {visibleCases.length === 0 ? <div className={styles.emptyState}><FaImages /><h3>No clinical cases added yet</h3><p>Upload your first case with one or more photos.</p></div> : <div className={styles.grid}>{visibleCases.map(c => <article className={styles.card} key={c.id}>
      <div className={styles.cardActions}><button className={styles.editButton} onClick={() => openEdit(c)}><FaEdit /></button><button className={styles.deleteButton} onClick={() => deleteCase(c.id)}><FaTrash /></button></div>
      <div className={styles.coverArea}>{c.photos[0] ? <img src={c.photos[0]} alt={c.title} className={styles.coverImage} /> : <div className={styles.coverPlaceholder}><FaCamera /></div>}{c.photos.length > 1 && <span className={styles.photoCount}><FaImages /> {c.photos.length} photos</span>}</div>
      <div className={styles.cardBody}><div className={styles.categoryRow}><span>{c.category}</span><small>{c.tooth || "Region not specified"}</small></div><h3>{c.title}</h3><dl className={styles.summary}><div><dt>Concern</dt><dd>{c.complaint}</dd></div><div><dt>Treatment</dt><dd>{c.treatment}</dd></div></dl><button className={styles.viewButton} onClick={() => setSelectedCase(c)}>View full case <FaArrowRight /></button></div>
    </article>)}</div>}
    <div className={styles.disclaimer}><FaInfoCircle /><p>Publish clinical photographs only after appropriate patient consent and removal of identifying details.</p></div>
  </div>

  {showEditor && <div className={styles.modalBackdrop} onMouseDown={e => e.currentTarget === e.target && closeEditor()}><form className={styles.editorModal} onSubmit={submit}>
    <button type="button" className={styles.closeButton} onClick={closeEditor}><FaTimes /></button><span className={styles.modalCategory}>{editingId !== null ? "Edit clinical case" : "Add clinical case"}</span><h3>{editingId !== null ? "Update case details" : "Upload a new case"}</h3>
    <div className={styles.formGrid}><label>Case category *<input value={form.category} onChange={e => updateField("category", e.target.value)} placeholder="Example: Smile Designing" /></label><label>Case title *<input value={form.title} onChange={e => updateField("title", e.target.value)} placeholder="Write the case title" /></label><label>Tooth / region<input value={form.tooth} onChange={e => updateField("tooth", e.target.value)} placeholder="Example: Tooth 36" /></label><label>Number of visits<input value={form.visits} onChange={e => updateField("visits", e.target.value)} placeholder="Example: 3 visits" /></label></div>
    <div className={styles.photoSection}><div className={styles.photoSectionHeader}><div><strong>Case photographs</strong><span>Upload as many photographs as required.</span></div><label className={styles.uploadButton}><FaUpload /> Add Photos<input type="file" accept="image/*" multiple onChange={addPhotos} /></label></div>
      {form.photos.length === 0 ? <label className={styles.emptyUploader}><FaCamera /><strong>Select clinical photographs</strong><span>You may select multiple images together.</span><input type="file" accept="image/*" multiple onChange={addPhotos} /></label> : <div className={styles.photoEditorGrid}>{form.photos.map((photo, index) => <div className={styles.photoEditorCard} key={`${photo}-${index}`}><img src={photo} alt={`Case photograph ${index + 1}`} /><span className={styles.photoNumber}>{index + 1}</span><div className={styles.photoControls}><button type="button" onClick={() => movePhoto(index, index - 1)} disabled={index === 0}>←</button><button type="button" onClick={() => movePhoto(index, index + 1)} disabled={index === form.photos.length - 1}>→</button><button type="button" className={styles.removePhotoButton} onClick={() => removePhoto(index)}><FaTrash /></button></div></div>)}</div>}
    </div>
    <div className={styles.textAreaGrid}><label>Patient concern *<textarea value={form.complaint} onChange={e => updateField("complaint", e.target.value)} /></label><label>Diagnosis *<textarea value={form.diagnosis} onChange={e => updateField("diagnosis", e.target.value)} /></label><label>Treatment performed *<textarea value={form.treatment} onChange={e => updateField("treatment", e.target.value)} /></label><label>Outcome *<textarea value={form.outcome} onChange={e => updateField("outcome", e.target.value)} /></label></div>
    {error && <p className={styles.formError}>{error}</p>}<div className={styles.formFooter}><button type="button" className={styles.cancelButton} onClick={closeEditor}>Cancel</button><button type="submit" className={styles.saveButton}>{editingId !== null ? <FaSave /> : <FaUpload />}{editingId !== null ? "Save Changes" : "Save and Publish Case"}</button></div><p className={styles.storageNote}>Cases are stored in this browser on this device until cloud storage is connected.</p>
  </form></div>}

  {selectedCase && <div className={styles.modalBackdrop} onMouseDown={e => e.currentTarget === e.target && setSelectedCase(null)}><div className={styles.caseModal}><button className={styles.closeButton} onClick={() => setSelectedCase(null)}><FaTimes /></button><div className={styles.modalTopActions}><button className={styles.modalEditButton} onClick={() => openEdit(selectedCase)}><FaEdit /> Edit</button><button className={styles.modalDeleteButton} onClick={() => deleteCase(selectedCase.id)}><FaTrash /> Delete</button></div><span className={styles.modalCategory}>{selectedCase.category}</span><h3>{selectedCase.title}</h3><div className={styles.caseGallery}>{selectedCase.photos.map((photo, index) => <img key={`${photo}-${index}`} src={photo} alt={`${selectedCase.title} photograph ${index + 1}`} />)}</div><dl className={styles.fullDetails}><div><dt>Tooth / region</dt><dd>{selectedCase.tooth || "Not specified"}</dd></div><div><dt>Patient concern</dt><dd>{selectedCase.complaint}</dd></div><div><dt>Diagnosis</dt><dd>{selectedCase.diagnosis}</dd></div><div><dt>Treatment performed</dt><dd>{selectedCase.treatment}</dd></div><div><dt>Visits</dt><dd>{selectedCase.visits || "Not specified"}</dd></div><div><dt>Outcome</dt><dd>{selectedCase.outcome}</dd></div></dl></div></div>}
  </section>;
}
