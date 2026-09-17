import type { NextApiRequest, NextApiResponse } from "next";

const FIREBASE_API_KEY = "AIzaSyDj6gPj-uyb8mwRVT1pGHlj3H-8D6d9594";
const ADMIN_EMAIL = "familydentalclinic.siwan@gmail.com";

function plainText(html: string) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function reviewIssues(html: string) {
  const issues: string[] = [];
  const text = plainText(html);
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => plainText(match[1]));
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  if (!/<h[23]\b/i.test(html) && text.length > 500) issues.push("Add section headings so patients can scan the article more easily.");
  if (paragraphs.some((paragraph) => paragraph.length > 650)) issues.push("One or more paragraphs are long; split them into shorter patient-friendly sections.");
  if (/\s{2,}/.test(text)) issues.push("Remove repeated spaces for a cleaner presentation.");
  if (images.some((image) => !/\balt\s*=\s*["'][^"']+["']/i.test(image))) issues.push("Add a short description to every photograph for accessibility and SEO.");
  if (!images.length) issues.push("Consider adding one relevant clinical illustration or photograph to improve engagement.");
  if (!/<(ul|ol)\b/i.test(html) && text.length > 900) issues.push("A short bullet list could make the key advice easier to remember.");
  if (!issues.length) issues.push("The article structure is ready. Compare the three free layouts below and choose the presentation you prefer.");
  return issues;
}

function addMagazineDetails(html: string) {
  let paragraphNumber = 0;
  let figureNumber = 0;
  return html.replace(/<p(\s[^>]*)?>/gi, (tag) => {
    paragraphNumber += 1;
    return paragraphNumber === 1 ? tag.replace(/^<p/i, '<p class="layout-intro"') : tag;
  }).replace(/<figure(\s[^>]*)?>/gi, (tag) => {
    figureNumber += 1;
    return tag.replace(/^<figure/i, `<figure class="${figureNumber % 2 ? "layout-photo-left" : "layout-photo-right"}"`);
  });
}

function addPhotoDetails(html: string) {
  let figureNumber = 0;
  return html.replace(/<figure(\s[^>]*)?>/gi, (tag) => {
    figureNumber += 1;
    return tag.replace(/^<figure/i, `<figure class="layout-feature-photo layout-feature-${(figureNumber - 1) % 3 + 1}"`);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const token = String(req.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Administrator sign-in required." });
  try {
    const identity = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) });
    const identityData = await identity.json();
    if (!identity.ok || identityData.users?.[0]?.email?.toLowerCase() !== ADMIN_EMAIL) return res.status(403).json({ error: "Administrator access required." });
    const html = String(req.body?.html ?? "").slice(0, 60000);
    if (!plainText(html) && !/<img\b/i.test(html)) return res.status(400).json({ error: "Write some article content first." });
    return res.status(200).json({
      issues: reviewIssues(html),
      arrangements: [
        { name: "Clean Classic", description: "A calm, highly readable clinical article with balanced spacing and traditional presentation.", html: `<section class="article-layout layout-classic">${html}</section>` },
        { name: "Modern Magazine", description: "A lively editorial design with an emphasized introduction and photographs alternating beside the text.", html: `<section class="article-layout layout-magazine">${addMagazineDetails(html)}</section>` },
        { name: "Photo Focus", description: "A visual presentation that gives photographs more prominence while keeping the full article readable.", html: `<section class="article-layout layout-photo-focus">${addPhotoDetails(html)}</section>` },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "The free article arranger could not be completed." });
  }
}
