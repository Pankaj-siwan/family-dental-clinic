import type { NextApiRequest, NextApiResponse } from "next";

const FIREBASE_API_KEY = "AIzaSyDj6gPj-uyb8mwRVT1pGHlj3H-8D6d9594";
const ADMIN_EMAIL = "familydentalclinic.siwan@gmail.com";

function outputText(data: { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }) {
  return data.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const token = String(req.headers.authorization ?? "").replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Administrator sign-in required." });
  try {
    const identity = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: token }) });
    const identityData = await identity.json();
    if (!identity.ok || identityData.users?.[0]?.email?.toLowerCase() !== ADMIN_EMAIL) return res.status(403).json({ error: "Administrator access required." });
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI review is not configured yet. Add OPENAI_API_KEY in Vercel environment variables." });
    const title = String(req.body?.title ?? "").slice(0, 300);
    const html = String(req.body?.html ?? "").slice(0, 60000);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_ARTICLE_MODEL || "gpt-5.6-luna",
        reasoning: { effort: "low" },
        max_output_tokens: 7000,
        input: `You are a dental patient-education editor and editorial designer. Review the following article titled "${title}". Correct grammar and clarity without inventing clinical claims. Return exactly three genuinely different, complete article arrangements: (1) a clean classic article, (2) a magazine-style article with useful callout or text boxes, and (3) an image-led article with professional photo placement. Every arrangement's html must contain the entire article, preserve every IMG element and its src exactly, and use only safe article-body HTML. Give each arrangement a short name and a clear one-sentence description of its design.\n\nARTICLE HTML:\n${html}`,
        text: { format: { type: "json_schema", name: "article_review", strict: true, schema: { type: "object", additionalProperties: false, properties: { issues: { type: "array", items: { type: "string" } }, arrangements: { type: "array", minItems: 3, maxItems: 3, items: { type: "object", additionalProperties: false, properties: { name: { type: "string" }, description: { type: "string" }, html: { type: "string" } }, required: ["name", "description", "html"] } } }, required: ["issues", "arrangements"] } } },
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "OpenAI review failed." });
    const text = outputText(data).replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const result = JSON.parse(text);
    const rawArrangements: unknown[] = Array.isArray(result.arrangements) ? result.arrangements : [];
    const arrangements = rawArrangements.slice(0, 3).map((item) => {
      const option = typeof item === "object" && item ? item as Record<string, unknown> : {};
      return { name: String(option.name ?? "Article layout"), description: String(option.description ?? "Professional article arrangement."), html: String(option.html ?? html) };
    });
    return res.status(200).json({ issues: Array.isArray(result.issues) ? result.issues : [], arrangements });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI review could not be completed." });
  }
}
