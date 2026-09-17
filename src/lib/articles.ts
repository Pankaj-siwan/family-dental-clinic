import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type ArticleBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; publicId: string; alt: string; caption: string };

export type WebsiteArticle = {
  id: string;
  title: string;
  summary: string;
  author: string;
  contentHtml: string;
  coverImageUrl: string;
  blocks: ArticleBlock[];
  published: boolean;
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export type WebsiteArticleInput = Omit<WebsiteArticle, "id" | "createdAt" | "updatedAt">;

const COLLECTION = "website_articles";

function blockFromData(value: unknown, index: number): ArticleBlock | null {
  if (!value || typeof value !== "object") return null;
  const block = value as Record<string, unknown>;
  const id = String(block.id ?? `block-${index}`);
  if (block.type === "image" && block.url) {
    return { id, type: "image", url: String(block.url), publicId: String(block.publicId ?? ""), alt: String(block.alt ?? ""), caption: String(block.caption ?? "") };
  }
  if ((block.type === "heading" || block.type === "paragraph") && typeof block.text === "string") {
    return { id, type: block.type, text: block.text };
  }
  return null;
}

function fromDocument(id: string, data: DocumentData): WebsiteArticle {
  const legacyContent = String(data.content ?? "").trim();
  const blocks = (Array.isArray(data.blocks) ? data.blocks : [])
    .map(blockFromData)
    .filter((block): block is ArticleBlock => block !== null);
  if (!blocks.length && legacyContent) blocks.push({ id: "legacy-content", type: "paragraph", text: legacyContent });

  return {
    id,
    title: String(data.title ?? ""),
    summary: String(data.summary ?? data.excerpt ?? ""),
    author: String(data.author ?? data.doctor ?? "From our doctors"),
    contentHtml: String(data.contentHtml ?? ""),
    coverImageUrl: String(data.coverImageUrl ?? data.imageUrl ?? data.photoUrl ?? ""),
    blocks,
    published: data.published === true,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
  };
}

function clean(input: WebsiteArticleInput): WebsiteArticleInput {
  return {
    title: input.title.trim(),
    summary: input.summary.trim(),
    author: input.author.trim(),
    contentHtml: input.contentHtml.trim(),
    coverImageUrl: input.coverImageUrl.trim(),
    published: input.published,
    blocks: input.blocks.map((block) => block.type === "image"
      ? { ...block, alt: block.alt.trim(), caption: block.caption.trim() }
      : { ...block, text: block.text.trim() }),
  };
}

export async function getArticles() {
  const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return snapshot.docs.map((item) => fromDocument(item.id, item.data()));
}

export async function getArticle(id: string) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  if (!snapshot.exists()) return null;
  return fromDocument(snapshot.id, snapshot.data());
}

export async function createArticle(input: WebsiteArticleInput) {
  return (await addDoc(collection(db, COLLECTION), { ...clean(input), createdAt: serverTimestamp(), updatedAt: serverTimestamp() })).id;
}

export async function updateArticle(id: string, input: WebsiteArticleInput) {
  await updateDoc(doc(db, COLLECTION, id), { ...clean(input), updatedAt: serverTimestamp() });
}

export async function deleteArticle(id: string) {
  await deleteDoc(doc(db, COLLECTION, id));
}
