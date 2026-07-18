"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FaArrowRight,
  FaCamera,
  FaCheckCircle,
  FaEdit,
  FaImages,
  FaInfoCircle,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
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
  beforeImage?: string;
  afterImage?: string;
};

type CaseForm = Omit<ClinicalCase, "id">;

const STORAGE_KEY = "family-dental-clinical-cases-v2";
const OLD_STORAGE_KEY = "family-dental-clinical-cases-v1";

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
  category: "",
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
      reject(new Error("Please select a valid image file."));
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      reject(new Error("Each image must be smaller than 4 MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

export default function CaseHighlights() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [cases, setCases] = useState<ClinicalCase[]>(initialCases);
  const [showUploader, setShowUploader] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CaseForm>(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    try {
      const savedCases = localStorage.getItem(STORAGE_KEY);

      if (savedCases) {
        setCases(JSON.parse(savedCases) as ClinicalCase[]);
        return;
      }

      const oldUploadedCases = localStorage.getItem(OLD_STORAGE_KEY);

      if (oldUploadedCases) {
        const migratedCases = [
          ...initialCases,
          ...(JSON.parse(oldUploadedCases) as ClinicalCase[]),
        ];
        setCases(migratedCases);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedCases));
      }
    } catch {
      setCases(initialCases);
    }
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        cases
          .map((item) => item.category.trim())
          .filter((category) => category.length > 0),
      ),
    );

    return ["All", ...uniqueCategories.sort((a, b) => a.localeCompare(b))];
  }, [cases]);

  const visibleCases = useMemo(() => {
    if (activeCategory === "All") return cases;
    return cases.filter((item) => item.category === activeCategory);
  }, [activeCategory, cases]);

  const saveCases = (nextCases: ClinicalCase[]) => {
    setCases(nextCases);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextCases));
  };

  const updateField = <K extends keyof CaseForm>(
    key: K,
    value: CaseForm[K],
  ) => {
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
      event.target.value = "";
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    }
  };

  const openNewCase = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowUploader(true);
  };

  const openEditCase = (clinicalCase: ClinicalCase) => {
    setEditingId(clinicalCase.id);
    setForm({
      category: clinicalCase.category,
      title: clinicalCase.title,
      tooth: clinicalCase.tooth,
      complaint: clinicalCase.complaint,
      diagnosis: clinicalCase.diagnosis,
      treatment: clinicalCase.treatment,
      outcome: clinicalCase.outcome,
      visits: clinicalCase.visits,
      beforeImage: clinicalCase.beforeImage ?? "",
      afterImage: clinicalCase.afterImage ?? "",
    });
    setFormError("");
    setSelectedCase(null);
    setShowUploader(true);
  };

  const closeUploader = () => {
    setShowUploader(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (
      !form.category.trim() ||
      !form.title.trim() ||
      !form.complaint.trim() ||
      !form.diagnosis.trim() ||
      !form.treatment.trim() ||
      !form.outcome.trim()
    ) {
      setFormError(
        "Please complete category, case title, concern, diagnosis, treatment and outcome.",
      );
      return;
    }

    if (!form.beforeImage && !form.afterImage) {
      setFormError("Please upload at least one clinical photograph.");
      return;
    }

    const normalizedForm: CaseForm = {
      ...form,
      category: form.category.trim(),
      title: form.title.trim(),
      tooth: form.tooth.trim(),
      complaint: form.complaint.trim(),
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatment.trim(),
      outcome: form.outcome.trim(),
      visits: form.visits.trim(),
    };

    if (editingId !== null) {
      const nextCases = cases.map((item) =>
        item.id === editingId ? { ...normalizedForm, id: editingId } : item,
      );
      saveCases(nextCases);
    } else {
      saveCases([{ ...normalizedForm, id: Date.now() }, ...cases]);
    }

    setActiveCategory("All");
    closeUploader();
  };

  const deleteCase = (id: number) => {
    const caseToDelete = cases.find((item) => item.id === id);

    if (
      !caseToDelete ||
      !window.confirm(`Delete "${caseToDelete.title}" permanently?`)
    ) {
      return;
    }

    const nextCases = cases.filter((item) => item.id !== id);
    saveCases(nextCases);

    if (selectedCase?.id === id) setSelectedCase(null);
    if (
      activeCategory !== "All" &&
      !nextCases.some((item) => item.category === activeCategory)
    ) {
      setActiveCategory("All");
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
            Add any case category and case title in your own words. Cases and
            photographs can be edited or deleted later from this browser.
          </p>

          <button
            type="button"
            className={styles.addCaseButton}
            onClick={openNewCase}
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

        {visibleCases.length === 0 ? (
          <div className={styles.emptyState}>
            <FaImages />
            <h3>No cases in this category</h3>
            <p>Add a new clinical case or select another category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {visibleCases.map((clinicalCase) => (
              <article className={styles.card} key={clinicalCase.id}>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => openEditCase(clinicalCase)}
                    aria-label={`Edit ${clinicalCase.title}`}
                    title="Edit case"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => deleteCase(clinicalCase.id)}
                    aria-label={`Delete ${clinicalCase.title}`}
                    title="Delete case"
                  >
                    <FaTrash />
                  </button>
                </div>

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
                        <FaCamera />
                        <small>No before photo</small>
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
                        <small>No after photo</small>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.categoryRow}>
                    <span>{clinicalCase.category}</span>
                    <small>{clinicalCase.tooth || "Region not specified"}</small>
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
        )}

        <div className={styles.disclaimer}>
          <FaInfoCircle />
          <p>
            Clinical outcomes vary between patients. Publish photographs and
            clinical details only after written consent and removal of
            identifying information.
          </p>
        </div>
      </div>

      {showUploader && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) closeUploader();
          }}
        >
          <form className={styles.uploadModal} onSubmit={handleSubmit}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeUploader}
              aria-label="Close case editor"
            >
              <FaTimes />
            </button>

            <span className={styles.modalCategory}>
              {editingId !== null ? "Edit clinical case" : "Add clinical case"}
            </span>

            <h3>
              {editingId !== null ? "Update case details" : "Upload a new case"}
            </h3>

            <div className={styles.formGrid}>
              <label>
                Case category *
                <input
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Write any category, e.g. Smile Designing"
                  list="case-category-suggestions"
                />
                <datalist id="case-category-suggestions">
                  {categories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option value={category} key={category} />
                    ))}
                </datalist>
              </label>

              <label>
                Case title *
                <input
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Write the case title"
                />
              </label>

              <label>
                Tooth / region
                <input
                  value={form.tooth}
                  onChange={(event) => updateField("tooth", event.target.value)}
                  placeholder="Example: Tooth 36 or upper anterior region"
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
              {(["beforeImage", "afterImage"] as const).map((key) => {
                const isBefore = key === "beforeImage";
                const value = form[key];
                return (
                  <div className={styles.photoEditor} key={key}>
                    <span className={styles.photoLabel}>
                      {isBefore ? "Before photograph" : "After photograph"}
                    </span>

                    <div className={styles.uploadPreview}>
                      {value ? (
                        <img
                          src={value}
                          alt={`${isBefore ? "Before" : "After"} case preview`}
                        />
                      ) : (
                        <>
                          <FaCamera />
                          <small>
                            Select {isBefore ? "before" : "after"} photograph
                          </small>
                        </>
                      )}
                    </div>

                    <div className={styles.photoActions}>
                      <label className={styles.photoButton}>
                        <FaUpload />
                        {value ? "Replace" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleImage(event, key)}
                        />
                      </label>

                      {value && (
                        <button
                          type="button"
                          className={styles.removePhotoButton}
                          onClick={() => updateField(key, "")}
                        >
                          <FaTrash />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.textAreaGrid}>
              <label>
                Patient concern *
                <textarea
                  value={form.complaint}
                  onChange={(event) =>
                    updateField("complaint", event.target.value)
                  }
                  placeholder="Describe the patient's concern"
                />
              </label>

              <label>
                Diagnosis *
                <textarea
                  value={form.diagnosis}
                  onChange={(event) =>
                    updateField("diagnosis", event.target.value)
                  }
                  placeholder="Enter the diagnosis"
                />
              </label>

              <label>
                Treatment performed *
                <textarea
                  value={form.treatment}
                  onChange={(event) =>
                    updateField("treatment", event.target.value)
                  }
                  placeholder="Describe the treatment performed"
                />
              </label>

              <label>
                Outcome *
                <textarea
                  value={form.outcome}
                  onChange={(event) =>
                    updateField("outcome", event.target.value)
                  }
                  placeholder="Describe the clinical outcome"
                />
              </label>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeUploader}
              >
                Cancel
              </button>

              <button type="submit" className={styles.saveButton}>
                {editingId !== null ? <FaSave /> : <FaUpload />}
                {editingId !== null
                  ? "Save Changes"
                  : "Save and Publish Case"}
              </button>
            </div>

            <p className={styles.storageNote}>
              Cases are currently stored in this browser on this device.
              Cloud storage will be needed for synchronized admin access across
              devices.
            </p>
          </form>
        </div>
      )}

      {selectedCase && (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedCase(null);
          }}
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-modal-title"
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedCase(null)}
              aria-label="Close case details"
            >
              <FaTimes />
            </button>

            <div className={styles.modalTopActions}>
              <button
                type="button"
                className={styles.modalEditButton}
                onClick={() => openEditCase(selectedCase)}
              >
                <FaEdit />
                Edit
              </button>

              <button
                type="button"
                className={styles.modalDeleteButton}
                onClick={() => deleteCase(selectedCase.id)}
              >
                <FaTrash />
                Delete
              </button>
            </div>

            <span className={styles.modalCategory}>
              {selectedCase.category}
            </span>
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
                    <FaCamera />
                    <small>No photograph</small>
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
                    <small>No photograph</small>
                  </div>
                )}
              </div>
            </div>

            <dl className={styles.fullDetails}>
              <div>
                <dt>Tooth / region</dt>
                <dd>{selectedCase.tooth || "Not specified"}</dd>
              </div>
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
