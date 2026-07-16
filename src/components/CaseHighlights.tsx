"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCamera,
  FaCheckCircle,
  FaImages,
  FaInfoCircle,
  FaPlus,
  FaTimes,
  FaTooth,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import styles from "@/styles/CaseHighlights.module.css";

type CaseCategory =
  | "All"
  | "Root Canal"
  | "Restoration"
  | "Crowns"
  | "Oral Surgery"
  | "Implants";

type StoredCategory = Exclude<CaseCategory, "All">;

type ClinicalCase = {
  id: number;
  category: StoredCategory;
  title: string;
  tooth: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  visits: string;
  beforeImage?: string;
  afterImage?: string;
  userAdded?: boolean;
};

type CaseForm = Omit<ClinicalCase, "id" | "userAdded">;

const STORAGE_KEY = "family-dental-clinical-cases-v1";

const categories: CaseCategory[] = [
  "All",
  "Root Canal",
  "Restoration",
  "Crowns",
  "Oral Surgery",
  "Implants",
];

const initialCases: ClinicalCase[] = [
  {
    id: 1,
    category: "Root Canal",
    title: "Root Canal Treatment",
    tooth: "Posterior tooth",
    complaint: "Pain while chewing and sensitivity.",
    diagnosis: "Pulpal involvement requiring endodontic care.",
    treatment: "Root canal treatment followed by definitive restoration.",
    outcome: "Pain relief reported and the natural tooth was preserved.",
    visits: "Multiple visits as clinically required",
  },
  {
    id: 2,
    category: "Restoration",
    title: "Composite Restoration",
    tooth: "Anterior tooth",
    complaint: "Visible tooth damage affecting appearance.",
    diagnosis: "Loss of tooth structure suitable for direct restoration.",
    treatment: "Tooth-coloured composite restoration.",
    outcome: "Tooth form and appearance were restored.",
    visits: "Single visit",
  },
];

const emptyForm: CaseForm = {
  category: "Root Canal",
  title: "",
  tooth: "",
  complaint: "",
  diagnosis: "",
  treatment: "",
  outcome: "",
  visits: "",
  beforeImage: "",
  afterImage: "",
};

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file."));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("Image must be smaller than 4 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function CaseHighlights() {
  const [activeCategory, setActiveCategory] = useState<CaseCategory>("All");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [cases, setCases] = useState<ClinicalCase[]>(initialCases);
  const [showUploader, setShowUploader] = useState(false);
  const [form, setForm] = useState<CaseForm>(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const uploadedCases = JSON.parse(stored) as ClinicalCase[];
        setCases([...initialCases, ...uploadedCases]);
      }
    } catch {
      // Ignore invalid local data and keep the built-in sample cases.
    }
  }, []);

  const visibleCases = useMemo(() => {
    if (activeCategory === "All") return cases;
    return cases.filter((item) => item.category === activeCategory);
  }, [activeCategory, cases]);

  const saveUploadedCases = (nextCases: ClinicalCase[]) => {
    const uploadedOnly = nextCases.filter((item) => item.userAdded);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedOnly));
  };

  const updateField = <K extends keyof CaseForm>(key: K, value: CaseForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleImage = async (
    event: ChangeEvent<HTMLInputElement>,
    key: "beforeImage" | "afterImage",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFormError("");
      updateField(key, await readImage(file));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Image upload failed.");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (
      !form.title.trim() ||
      !form.complaint.trim() ||
      !form.diagnosis.trim() ||
      !form.treatment.trim() ||
      !form.outcome.trim()
    ) {
      setFormError("Please complete all required case details.");
      return;
    }

    if (!form.beforeImage || !form.afterImage) {
      setFormError("Please upload both before and after photographs.");
      return;
    }

    const newCase: ClinicalCase = {
      ...form,
      id: Date.now(),
      userAdded: true,
    };

    const nextCases = [newCase, ...cases];
    setCases(nextCases);
    saveUploadedCases(nextCases);
    setForm(emptyForm);
    setShowUploader(false);
    setActiveCategory("All");
  };

  const deleteCase = (id: number) => {
    const nextCases = cases.filter((item) => item.id !== id);
    setCases(nextCases);
    saveUploadedCases(nextCases);

    if (selectedCase?.id === id) {
      setSelectedCase(null);
    }
  };

  return (
    <section className={styles.section} id="cases">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaImages />
            Clinical Case Highlights
          </span>

          <h2>
            Selected cases from our
            <span> clinical practice</span>
          </h2>

          <p>
            Present de-identified clinical cases with patient consent. Uploaded
            cases are saved in this browser on this device.
          </p>

          <button
            type="button"
            className={styles.addCaseButton}
            onClick={() => setShowUploader(true)}
          >
            <FaPlus />
            Upload New Case
          </button>
        </div>

        <div className={styles.filters} aria-label="Filter clinical cases">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={`${styles.filterButton} ${
                activeCategory === category ? styles.activeFilter : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visibleCases.map((clinicalCase) => (
            <article className={styles.card} key={clinicalCase.id}>
              {clinicalCase.userAdded && (
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => deleteCase(clinicalCase.id)}
                  aria-label={`Delete ${clinicalCase.title}`}
                >
                  <FaTrash />
                </button>
              )}

              <div className={styles.comparison}>
                <div className={styles.imagePanel}>
                  <span>Before</span>
                  {clinicalCase.beforeImage ? (
                    <img
                      src={clinicalCase.beforeImage}
                      alt={`Before treatment - ${clinicalCase.title}`}
                      className={styles.caseImage}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <FaTooth />
                      <small>Add clinical photo</small>
                    </div>
                  )}
                </div>

                <div className={styles.imagePanel}>
                  <span>After</span>
                  {clinicalCase.afterImage ? (
                    <img
                      src={clinicalCase.afterImage}
                      alt={`After treatment - ${clinicalCase.title}`}
                      className={styles.caseImage}
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <FaCheckCircle />
                      <small>Add outcome photo</small>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.categoryRow}>
                  <span>{clinicalCase.category}</span>
                  <small>{clinicalCase.tooth}</small>
                </div>

                <h3>{clinicalCase.title}</h3>

                <dl className={styles.summary}>
                  <div>
                    <dt>Concern</dt>
                    <dd>{clinicalCase.complaint}</dd>
                  </div>
                  <div>
                    <dt>Treatment</dt>
                    <dd>{clinicalCase.treatment}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => setSelectedCase(clinicalCase)}
                >
                  View full case
                  <FaArrowRight />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.disclaimer}>
          <FaInfoCircle />
          <p>
            Clinical outcomes vary between patients. Publish photographs and
            clinical details only after written consent and removal of identifying
            information.
          </p>
        </div>
      </div>

      {showUploader && (
        <div className={styles.modalBackdrop} role="presentation">
          <form className={styles.uploadModal} onSubmit={handleSubmit}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => {
                setShowUploader(false);
                setFormError("");
              }}
              aria-label="Close case uploader"
            >
              <FaTimes />
            </button>

            <span className={styles.modalCategory}>Add clinical case</span>
            <h3>Upload a new case</h3>

            <div className={styles.formGrid}>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value as StoredCategory)
                  }
                >
                  {categories
                    .filter((category): category is StoredCategory => category !== "All")
                    .map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Case title *
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Example: Root Canal Treatment"
                />
              </label>

              <label>
                Tooth / region
                <input
                  value={form.tooth}
                  onChange={(event) => updateField("tooth", event.target.value)}
                  placeholder="Example: Tooth 36"
                />
              </label>

              <label>
                Number of visits
                <input
                  value={form.visits}
                  onChange={(event) => updateField("visits", event.target.value)}
                  placeholder="Example: 3 visits"
                />
              </label>
            </div>

            <div className={styles.photoGrid}>
              <label className={styles.photoUpload}>
                <span>Before photograph *</span>
                <div className={styles.uploadPreview}>
                  {form.beforeImage ? (
                    <img src={form.beforeImage} alt="Before case preview" />
                  ) : (
                    <>
                      <FaCamera />
                      <small>Select before photo</small>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImage(event, "beforeImage")}
                />
              </label>

              <label className={styles.photoUpload}>
                <span>After photograph *</span>
                <div className={styles.uploadPreview}>
                  {form.afterImage ? (
                    <img src={form.afterImage} alt="After case preview" />
                  ) : (
                    <>
                      <FaUpload />
                      <small>Select after photo</small>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleImage(event, "afterImage")}
                />
              </label>
            </div>

            <div className={styles.textAreaGrid}>
              <label>
                Patient concern *
                <textarea
                  value={form.complaint}
                  onChange={(event) => updateField("complaint", event.target.value)}
                />
              </label>

              <label>
                Diagnosis *
                <textarea
                  value={form.diagnosis}
                  onChange={(event) => updateField("diagnosis", event.target.value)}
                />
              </label>

              <label>
                Treatment performed *
                <textarea
                  value={form.treatment}
                  onChange={(event) => updateField("treatment", event.target.value)}
                />
              </label>

              <label>
                Outcome *
                <textarea
                  value={form.outcome}
                  onChange={(event) => updateField("outcome", event.target.value)}
                />
              </label>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <button type="submit" className={styles.saveButton}>
              <FaUpload />
              Save and Publish Case
            </button>

            <p className={styles.storageNote}>
              This version stores uploaded cases in the current browser. A secure
              online admin dashboard and cloud storage can be added later.
            </p>
          </form>
        </div>
      )}

      {selectedCase && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedCase(null)}
              aria-label="Close case details"
            >
              <FaTimes />
            </button>

            <span className={styles.modalCategory}>{selectedCase.category}</span>
            <h3 id="case-modal-title">{selectedCase.title}</h3>

            <div className={styles.modalImages}>
              <div>
                <span>Before</span>
                {selectedCase.beforeImage ? (
                  <img
                    src={selectedCase.beforeImage}
                    alt={`Before treatment - ${selectedCase.title}`}
                    className={styles.modalCaseImage}
                  />
                ) : (
                  <div className={styles.modalPlaceholder}>
                    <FaTooth />
                  </div>
                )}
              </div>

              <div>
                <span>After</span>
                {selectedCase.afterImage ? (
                  <img
                    src={selectedCase.afterImage}
                    alt={`After treatment - ${selectedCase.title}`}
                    className={styles.modalCaseImage}
                  />
                ) : (
                  <div className={styles.modalPlaceholder}>
                    <FaCheckCircle />
                  </div>
                )}
              </div>
            </div>

            <dl className={styles.fullDetails}>
              <div>
                <dt>Patient concern</dt>
                <dd>{selectedCase.complaint}</dd>
              </div>
              <div>
                <dt>Diagnosis</dt>
                <dd>{selectedCase.diagnosis}</dd>
              </div>
              <div>
                <dt>Treatment performed</dt>
                <dd>{selectedCase.treatment}</dd>
              </div>
              <div>
                <dt>Visits</dt>
                <dd>{selectedCase.visits || "Not specified"}</dd>
              </div>
              <div>
                <dt>Outcome</dt>
                <dd>{selectedCase.outcome}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
