import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaCloudArrowUp,
  FaEye,
  FaEyeSlash,
  FaFloppyDisk,
  FaImage,
  FaPen,
  FaRotateRight,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";

import {
  ClinicalCase,
  ClinicalCaseInput,
  ClinicalCasePhoto,
  createClinicalCase,
  deleteClinicalCase,
  getClinicalCases,
  updateClinicalCase,
} from "@/lib/clinicalCases";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { addClinicWatermark } from "@/lib/watermark";

const EMPTY_FORM: ClinicalCaseInput = {
  category: "",
  title: "",
  tooth: "",
  complaint: "",
  diagnosis: "",
  treatment: "",
  outcome: "",
  visits: "",
  photos: [],
  published: true,
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export default function ClinicalCaseAdmin() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [form, setForm] = useState<ClinicalCaseInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const publishedCount = useMemo(
    () => cases.filter((item) => item.published).length,
    [cases]
  );

  async function loadCases() {
    try {
      setLoading(true);
      setError("");
      setCases(await getClinicalCases());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Initial data synchronization with Firestore.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCases();
  }, []);

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setMessage("");
  }

  async function uploadPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    try {
      setUploading(true);
      setError("");
      setMessage("Adding clinic watermark...");
      const photos: ClinicalCasePhoto[] = [];

      for (const file of files) {
        const watermarkedFile = await addClinicWatermark(file);
        const uploaded = await uploadToCloudinary(watermarkedFile);

        photos.push({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
        });
      }

      setForm((current) => ({
        ...current,
        photos: [...current.photos, ...photos],
      }));

      setMessage(
        `${photos.length} watermarked photo(s) uploaded successfully.`
      );
    } catch (err) {
      setError(errorMessage(err));
      setMessage("");
    } finally {
      event.target.value = "";
      setUploading(false);
    }
  }

  async function saveCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.category.trim() || !form.title.trim()) {
      setError("Treatment category and case title are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateClinicalCase(editingId, form);
        setMessage("Clinical case updated successfully.");
      } else {
        await createClinicalCase(form);
        setMessage("Clinical case saved successfully.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      await loadCases();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function editCase(item: ClinicalCase) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      title: item.title,
      tooth: item.tooth,
      complaint: item.complaint,
      diagnosis: item.diagnosis,
      treatment: item.treatment,
      outcome: item.outcome,
      visits: item.visits,
      photos: item.photos,
      published: item.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function togglePublished(item: ClinicalCase) {
    try {
      setError("");
      await updateClinicalCase(item.id, {
        category: item.category,
        title: item.title,
        tooth: item.tooth,
        complaint: item.complaint,
        diagnosis: item.diagnosis,
        treatment: item.treatment,
        outcome: item.outcome,
        visits: item.visits,
        photos: item.photos,
        published: !item.published,
      });
      await loadCases();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  async function removeCase(item: ClinicalCase) {
    if (!window.confirm(`Delete "${item.title}" permanently?`)) return;

    try {
      setDeletingId(item.id);
      setError("");
      await deleteClinicalCase(item.id);
      if (editingId === item.id) resetForm();
      setMessage("Clinical case deleted.");
      await loadCases();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="caseAdmin">
      <section className="stats">
        <article><strong>{cases.length}</strong><span>Total cases</span></article>
        <article><strong>{publishedCount}</strong><span>Published</span></article>
        <article><strong>{cases.length - publishedCount}</strong><span>Hidden</span></article>
      </section>

      <section className="panel">
        <div className="heading">
          <div>
            <span>Clinical case editor</span>
            <h2>{editingId ? "Edit clinical case" : "Add a clinical case"}</h2>
          </div>
          {editingId && (
            <button type="button" className="secondary" onClick={resetForm}>
              <FaXmark /> Cancel
            </button>
          )}
        </div>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <form onSubmit={saveCase}>
          <div className="grid">
            <label>
              Treatment category *
              <input name="category" value={form.category} onChange={updateField}
                placeholder="Example: Root canal treatment" disabled={saving} />
            </label>

            <label>
              Case title *
              <input name="title" value={form.title} onChange={updateField}
                placeholder="Example: Fractured front tooth restoration" disabled={saving} />
            </label>

            <label>
              Tooth number
              <input name="tooth" value={form.tooth} onChange={updateField}
                placeholder="Example: 11" disabled={saving} />
            </label>

            <label>
              Number of visits
              <input name="visits" value={form.visits} onChange={updateField}
                placeholder="Example: 2 visits" disabled={saving} />
            </label>

            <label>
              Chief complaint
              <textarea name="complaint" value={form.complaint}
                onChange={updateField} disabled={saving} />
            </label>

            <label>
              Diagnosis
              <textarea name="diagnosis" value={form.diagnosis}
                onChange={updateField} disabled={saving} />
            </label>

            <label>
              Treatment performed
              <textarea name="treatment" value={form.treatment}
                onChange={updateField} disabled={saving} />
            </label>

            <label>
              Outcome
              <textarea name="outcome" value={form.outcome}
                onChange={updateField} disabled={saving} />
            </label>
          </div>

          <div className="uploadBox">
            <div>
              <h3><FaImage /> Clinical photographs</h3>
              <p>
                Upload JPG, PNG or WebP images up to 10 MB each.
                Clinic watermark is added automatically before upload.
              </p>
            </div>

            <label className="uploadButton">
              <FaCloudArrowUp />
              {uploading ? "Watermarking and uploading..." : "Upload photos"}
              <input type="file" accept="image/*" multiple
                onChange={uploadPhotos} disabled={uploading || saving} />
            </label>
          </div>

          {!!form.photos.length && (
            <div className="photos">
              {form.photos.map((photo, index) => (
                <div className="photo" key={`${photo.publicId}-${index}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={`Clinical photograph ${index + 1}`} />
                  <button type="button" onClick={() =>
                    setForm((current) => ({
                      ...current,
                      photos: current.photos.filter((_, i) => i !== index),
                    }))
                  }>
                    <FaXmark />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="footer">
            <label className="publish">
              <input type="checkbox" checked={form.published}
                onChange={(event) => setForm((current) => ({
                  ...current,
                  published: event.target.checked,
                }))} />
              Publish on the website
            </label>

            <button className="primary" type="submit" disabled={saving || uploading}>
              <FaFloppyDisk />
              {saving ? "Saving..." : editingId ? "Update case" : "Save case"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="heading">
          <div>
            <span>Clinical case library</span>
            <h2>Saved cases</h2>
          </div>
          <button type="button" className="secondary"
            onClick={loadCases} disabled={loading}>
            <FaRotateRight /> {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="empty">Loading clinical cases...</div>
        ) : !cases.length ? (
          <div className="empty">
            <FaImage />
            <strong>No clinical cases yet</strong>
            <span>Add your first case using the form above.</span>
          </div>
        ) : (
          <div className="caseGrid">
            {cases.map((item) => (
              <article className="caseCard" key={item.id}>
                <div className="caseImage">
                  {item.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.photos[0].url} alt={item.title} />
                  ) : <FaImage />}
                  <span className={item.published ? "live" : "hidden"}>
                    {item.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <div className="caseBody">
                  <small>{item.category || "Uncategorised"}</small>
                  <h3>{item.title}</h3>
                  <p>{item.treatment || item.diagnosis || "No details added."}</p>
                  <div className="meta">
                    <span>Tooth: {item.tooth || "—"}</span>
                    <span>Photos: {item.photos.length}</span>
                  </div>

                  <div className="actions">
                    <button type="button" onClick={() => editCase(item)}>
                      <FaPen /> Edit
                    </button>
                    <button type="button" onClick={() => togglePublished(item)}>
                      {item.published ? <FaEyeSlash /> : <FaEye />}
                      {item.published ? "Hide" : "Publish"}
                    </button>
                    <button type="button" className="delete"
                      onClick={() => removeCase(item)}
                      disabled={deletingId === item.id}>
                      <FaTrash />
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .caseAdmin{display:grid;gap:24px;margin-top:26px}
        .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .stats article,.panel{border:1px solid #dce8eb;border-radius:22px;background:#fff;box-shadow:0 14px 34px rgba(15,42,67,.07)}
        .stats article{display:grid;gap:5px;padding:22px}
        .stats strong{color:#0f766e;font-size:2rem}
        .stats span{color:#647b87;font-weight:700}
        .panel{padding:28px}
        .heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px}
        .heading span{color:#0f766e;font-size:.75rem;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
        h2{margin:7px 0 0;color:#123649}
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
        label{display:grid;gap:8px;color:#264653;font-size:.84rem;font-weight:800}
        input,textarea{width:100%;border:1px solid #ccdce0;border-radius:13px;padding:13px 14px;outline:none;background:#fbfefe;color:#163748;font:inherit}
        textarea{min-height:110px;resize:vertical}
        input:focus,textarea:focus{border-color:#0f766e;box-shadow:0 0 0 4px rgba(15,118,110,.1)}
        .uploadBox{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:20px;padding:20px;border:1px dashed #91c8c3;border-radius:18px;background:#f3fbfa}
        .uploadBox h3{display:flex;align-items:center;gap:9px;margin:0 0 6px;color:#123649}
        .uploadBox p{margin:0;color:#6b818c;font-size:.8rem}
        .uploadButton,.primary,.secondary,.actions button{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;cursor:pointer;font-weight:900}
        .uploadButton,.primary{min-height:46px;padding:0 17px;border-radius:13px;color:#fff;background:linear-gradient(135deg,#0f766e,#0891b2)}
        .uploadButton input{display:none}
        .secondary{min-height:42px;padding:0 14px;border:1px solid #cfe0e4;border-radius:12px;color:#31596a;background:#f7fbfc}
        .photos{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:14px;margin-top:18px}
        .photo{position:relative;overflow:hidden;aspect-ratio:1;border-radius:15px;background:#eaf3f5}
        .photo img,.caseImage img{width:100%;height:100%;object-fit:cover}
        .photo button{position:absolute;top:8px;right:8px;display:grid;width:32px;height:32px;place-items:center;border:0;border-radius:50%;color:#fff;background:rgba(15,23,42,.75);cursor:pointer}
        .footer{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:24px;padding-top:20px;border-top:1px solid #e3ecef}
        .publish{display:flex;align-items:center;gap:10px}
        .publish input{width:18px;height:18px}
        .alert{margin-bottom:18px;padding:12px 14px;border-radius:12px;font-size:.84rem;font-weight:700}
        .error{border:1px solid #fecdd3;color:#be123c;background:#fff1f2}
        .success{border:1px solid #bbf7d0;color:#166534;background:#f0fdf4}
        .caseGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
        .caseCard{overflow:hidden;border:1px solid #dce8eb;border-radius:18px;background:#fff}
        .caseImage{position:relative;display:grid;height:210px;place-items:center;color:#78909a;background:#edf5f6;font-size:2.4rem}
        .caseImage>span{position:absolute;top:12px;left:12px;padding:7px 10px;border-radius:999px;font-size:.68rem;font-weight:900}
        .live{color:#0f766e;background:#dff7f3}
        .hidden{color:#92400e;background:#fef3c7}
        .caseBody{padding:20px}
        .caseBody small{color:#0f766e;font-weight:900;text-transform:uppercase}
        .caseBody h3{margin:7px 0 9px;color:#123649}
        .caseBody p{margin:0;color:#637c88;line-height:1.6}
        .meta{display:flex;justify-content:space-between;gap:12px;margin-top:16px;color:#78909a;font-size:.74rem;font-weight:800}
        .actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}
        .actions button{min-height:38px;border:1px solid #d7e5e8;border-radius:10px;color:#31596a;background:#f7fbfc;font-size:.74rem}
        .actions .delete{border-color:#fecdd3;color:#be123c;background:#fff1f2}
        button:disabled{cursor:not-allowed;opacity:.6}
        .empty{display:grid;min-height:210px;place-items:center;align-content:center;gap:9px;color:#718793;text-align:center}
        @media(max-width:760px){
          .stats,.grid,.caseGrid{grid-template-columns:1fr}
          .panel{padding:20px}
          .heading,.uploadBox,.footer{align-items:stretch;flex-direction:column}
          .primary,.secondary,.uploadButton{width:100%}
        }
      `}</style>
    </div>
  );
}
