"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCamera,
  FaImages,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

import { ClinicalCase, getClinicalCases } from "@/lib/clinicalCases";
import styles from "@/styles/CaseHighlights.module.css";

export default function CaseHighlights() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublishedCases() {
      try {
        setLoading(true);
        setError("");

        const allCases = await getClinicalCases();
        setCases(allCases.filter((clinicalCase) => clinicalCase.published));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load clinical cases."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPublishedCases();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          cases
            .map((clinicalCase) => clinicalCase.category.trim())
            .filter(Boolean)
        )
      ).sort(),
    ],
    [cases]
  );

  const visibleCases =
    activeCategory === "All"
      ? cases
      : cases.filter(
          (clinicalCase) => clinicalCase.category === activeCategory
        );

  return (
    <section className={styles.section} id="cases">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaImages />
            Clinical Case Highlights
          </span>

          <h2>
            Selected cases from our <span>clinical practice</span>
          </h2>

          <p>
            View selected treatment cases completed at Family Dental Clinic
            &amp; Implant Center.
          </p>
        </div>

        {categories.length > 1 && (
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
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
        )}

        {loading ? (
          <div className={styles.emptyState}>
            <FaImages />
            <h3>Loading clinical cases...</h3>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <FaInfoCircle />
            <h3>Unable to load cases</h3>
            <p>{error}</p>
          </div>
        ) : visibleCases.length === 0 ? (
          <div className={styles.emptyState}>
            <FaImages />
            <h3>No published clinical cases yet</h3>
            <p>New treatment cases will appear here after publication.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {visibleCases.map((clinicalCase) => (
              <article className={styles.card} key={clinicalCase.id}>
                <div className={styles.coverArea}>
                  {clinicalCase.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={clinicalCase.photos[0].url}
                      alt={clinicalCase.title}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <FaCamera />
                    </div>
                  )}

                  {clinicalCase.photos.length > 1 && (
                    <span className={styles.photoCount}>
                      <FaImages />
                      {clinicalCase.photos.length} photos
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.categoryRow}>
                    <span>{clinicalCase.category}</span>
                    <small>
                      {clinicalCase.tooth || "Region not specified"}
                    </small>
                  </div>

                  <h3>{clinicalCase.title}</h3>

                  <dl className={styles.summary}>
                    <div>
                      <dt>Concern</dt>
                      <dd>{clinicalCase.complaint || "Not specified"}</dd>
                    </div>

                    <div>
                      <dt>Treatment</dt>
                      <dd>{clinicalCase.treatment || "Not specified"}</dd>
                    </div>
                  </dl>

                  <button
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
            Clinical photographs are displayed only after appropriate patient
            consent and removal of identifying details.
          </p>
        </div>
      </div>

      {selectedCase && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) =>
            event.currentTarget === event.target && setSelectedCase(null)
          }
        >
          <div className={styles.caseModal}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedCase(null)}
              aria-label="Close case details"
            >
              <FaTimes />
            </button>

            <span className={styles.modalCategory}>
              {selectedCase.category}
            </span>

            <h3>{selectedCase.title}</h3>

            <div className={styles.caseGallery}>
              {selectedCase.photos.map((photo, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${photo.url}-${index}`}
                  src={photo.url}
                  alt={`${selectedCase.title} photograph ${index + 1}`}
                />
              ))}
            </div>

            <dl className={styles.fullDetails}>
              <div>
                <dt>Tooth / region</dt>
                <dd>{selectedCase.tooth || "Not specified"}</dd>
              </div>

              <div>
                <dt>Patient concern</dt>
                <dd>{selectedCase.complaint || "Not specified"}</dd>
              </div>

              <div>
                <dt>Diagnosis</dt>
                <dd>{selectedCase.diagnosis || "Not specified"}</dd>
              </div>

              <div>
                <dt>Treatment performed</dt>
                <dd>{selectedCase.treatment || "Not specified"}</dd>
              </div>

              <div>
                <dt>Visits</dt>
                <dd>{selectedCase.visits || "Not specified"}</dd>
              </div>

              <div>
                <dt>Outcome</dt>
                <dd>{selectedCase.outcome || "Not specified"}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaArrowRight,
  FaCamera,
  FaImages,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

import { ClinicalCase, getClinicalCases } from "@/lib/clinicalCases";
import styles from "@/styles/CaseHighlights.module.css";

export default function CaseHighlights() {
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPublishedCases() {
      try {
        setLoading(true);
        setError("");

        const allCases = await getClinicalCases();
        setCases(allCases.filter((clinicalCase) => clinicalCase.published));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load clinical cases."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPublishedCases();
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          cases
            .map((clinicalCase) => clinicalCase.category.trim())
            .filter(Boolean)
        )
      ).sort(),
    ],
    [cases]
  );

  const visibleCases =
    activeCategory === "All"
      ? cases
      : cases.filter(
          (clinicalCase) => clinicalCase.category === activeCategory
        );

  return (
    <section className={styles.section} id="cases">
      <div className={styles.container}>
        <div className={styles.headingArea}>
          <span className={styles.eyebrow}>
            <FaImages />
            Clinical Case Highlights
          </span>

          <h2>
            Selected cases from our <span>clinical practice</span>
          </h2>

          <p>
            View selected treatment cases completed at Family Dental Clinic
            &amp; Implant Center.
          </p>
        </div>

        {categories.length > 1 && (
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
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
        )}

        {loading ? (
          <div className={styles.emptyState}>
            <FaImages />
            <h3>Loading clinical cases...</h3>
          </div>
        ) : error ? (
          <div className={styles.emptyState}>
            <FaInfoCircle />
            <h3>Unable to load cases</h3>
            <p>{error}</p>
          </div>
        ) : visibleCases.length === 0 ? (
          <div className={styles.emptyState}>
            <FaImages />
            <h3>No published clinical cases yet</h3>
            <p>New treatment cases will appear here after publication.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {visibleCases.map((clinicalCase) => (
              <article className={styles.card} key={clinicalCase.id}>
                <div className={styles.coverArea}>
                  {clinicalCase.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={clinicalCase.photos[0].url}
                      alt={clinicalCase.title}
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.coverPlaceholder}>
                      <FaCamera />
                    </div>
                  )}

                  {clinicalCase.photos.length > 1 && (
                    <span className={styles.photoCount}>
                      <FaImages />
                      {clinicalCase.photos.length} photos
                    </span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.categoryRow}>
                    <span>{clinicalCase.category}</span>
                    <small>
                      {clinicalCase.tooth || "Region not specified"}
                    </small>
                  </div>

                  <h3>{clinicalCase.title}</h3>

                  <dl className={styles.summary}>
                    <div>
                      <dt>Concern</dt>
                      <dd>{clinicalCase.complaint || "Not specified"}</dd>
                    </div>

                    <div>
                      <dt>Treatment</dt>
                      <dd>{clinicalCase.treatment || "Not specified"}</dd>
                    </div>
                  </dl>

                  <button
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
            Clinical photographs are displayed only after appropriate patient
            consent and removal of identifying details.
          </p>
        </div>
      </div>

      {selectedCase && (
        <div
          className={styles.modalBackdrop}
          onMouseDown={(event) =>
            event.currentTarget === event.target && setSelectedCase(null)
          }
        >
          <div className={styles.caseModal}>
            <button
              className={styles.closeButton}
              onClick={() => setSelectedCase(null)}
              aria-label="Close case details"
            >
              <FaTimes />
            </button>

            <span className={styles.modalCategory}>
              {selectedCase.category}
            </span>

            <h3>{selectedCase.title}</h3>

            <div className={styles.caseGallery}>
              {selectedCase.photos.map((photo, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${photo.url}-${index}`}
                  src={photo.url}
                  alt={`${selectedCase.title} photograph ${index + 1}`}
                />
              ))}
            </div>

            <dl className={styles.fullDetails}>
              <div>
                <dt>Tooth / region</dt>
                <dd>{selectedCase.tooth || "Not specified"}</dd>
              </div>

              <div>
                <dt>Patient concern</dt>
                <dd>{selectedCase.complaint || "Not specified"}</dd>
              </div>

              <div>
                <dt>Diagnosis</dt>
                <dd>{selectedCase.diagnosis || "Not specified"}</dd>
              </div>

              <div>
                <dt>Treatment performed</dt>
                <dd>{selectedCase.treatment || "Not specified"}</dd>
              </div>

              <div>
                <dt>Visits</dt>
                <dd>{selectedCase.visits || "Not specified"}</dd>
              </div>

              <div>
                <dt>Outcome</dt>
                <dd>{selectedCase.outcome || "Not specified"}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}