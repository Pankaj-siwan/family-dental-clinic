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
        input: `You are a dental patient-education editor. Review the following article titled "${title}". Correct grammar and clarity without inventing clinical claims. Preserve every IMG element and its src exactly. Suggest several professional paragraph/photo arrangements. Return JSON only with keys: issues (array of concise strings), arrangements (array of concise strings), improvedHtml (safe article-body HTML using only p,h2,h3,strong,b,em,i,u,ul,ol,li,blockquote,figure,img,figcaption,div,br,span,a; no scripts, stylesheets, iframes or event handlers).\n\nARTICLE HTML:\n${html}`,
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "OpenAI review failed." });
    const text = outputText(data).replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
    const result = JSON.parse(text);
    return res.status(200).json({ issues: Array.isArray(result.issues) ? result.issues : [], arrangements: Array.isArray(result.arrangements) ? result.arrangements : [], improvedHtml: String(result.improvedHtml ?? html) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "AI review could not be completed." });
  }
}
