import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type ClinicalCasePhoto = {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
};

export type ClinicalCase = {
  id: string;
  category: string;
  title: string;
  tooth: string;
  complaint: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  visits: string;
  photos: ClinicalCasePhoto[];
  published: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type ClinicalCaseInput = Omit<
  ClinicalCase,
  "id" | "createdAt" | "updatedAt"
>;

const COLLECTION_NAME = "clinicalCases";

function convertDocument(
  id: string,
  data: DocumentData
): ClinicalCase {
  const rawPhotos = Array.isArray(data.photos) ? data.photos : [];

  return {
    id,
    category: String(data.category ?? ""),
    title: String(data.title ?? ""),
    tooth: String(data.tooth ?? ""),
    complaint: String(data.complaint ?? ""),
    diagnosis: String(data.diagnosis ?? ""),
    treatment: String(data.treatment ?? ""),
    outcome: String(data.outcome ?? ""),
    visits: String(data.visits ?? ""),
    photos: rawPhotos
      .map((photo: unknown) => {
        if (typeof photo === "string") {
          return {
            url: photo,
            publicId: "",
          };
        }

        if (
          typeof photo === "object" &&
          photo !== null &&
          "url" in photo
        ) {
          const value = photo as {
            url?: unknown;
            publicId?: unknown;
            width?: unknown;
            height?: unknown;
          };

          return {
            url: String(value.url ?? ""),
            publicId: String(value.publicId ?? ""),
            width:
              typeof value.width === "number"
                ? value.width
                : undefined,
            height:
              typeof value.height === "number"
                ? value.height
                : undefined,
          };
        }

        return null;
      })
      .filter(
        (photo): photo is ClinicalCasePhoto =>
          photo !== null && Boolean(photo.url)
      ),
    published: data.published !== false,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt
        : null,
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt
        : null,
  };
}

function cleanCaseInput(
  input: ClinicalCaseInput
): ClinicalCaseInput {
  return {
    category: input.category.trim(),
    title: input.title.trim(),
    tooth: input.tooth.trim(),
    complaint: input.complaint.trim(),
    diagnosis: input.diagnosis.trim(),
    treatment: input.treatment.trim(),
    outcome: input.outcome.trim(),
    visits: input.visits.trim(),
    photos: input.photos.map((photo) => ({
      url: photo.url,
      publicId: photo.publicId,
      ...(photo.width !== undefined
        ? { width: photo.width }
        : {}),
      ...(photo.height !== undefined
        ? { height: photo.height }
        : {}),
    })),
    published: input.published,
  };
}

export async function getClinicalCases(): Promise<
  ClinicalCase[]
> {
  const casesQuery = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(casesQuery);

  return snapshot.docs.map((caseDocument) =>
    convertDocument(caseDocument.id, caseDocument.data())
  );
}

export async function createClinicalCase(
  input: ClinicalCaseInput
): Promise<string> {
  const cleanInput = cleanCaseInput(input);

  const createdDocument = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      ...cleanInput,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return createdDocument.id;
}

export async function updateClinicalCase(
  id: string,
  input: ClinicalCaseInput
): Promise<void> {
  const cleanInput = cleanCaseInput(input);

  await updateDoc(doc(db, COLLECTION_NAME, id), {
    ...cleanInput,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteClinicalCase(
  id: string
): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}