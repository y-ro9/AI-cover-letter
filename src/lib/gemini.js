const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

export const hasApiKey = Boolean(API_KEY);

export function buildPrompt({ name, role, company, skills, resumeText }) {
  const resumeBlock = resumeText
    ? `\n\nCandidate resume (raw extracted text — use it to personalize with real projects/achievements):\n"""${resumeText.slice(0, 6000)}"""`
    : '';

  return `You are a senior career coach and professional writer.
Write a complete, tailored cover letter for the candidate described below.

Candidate name: ${name}
Job role: ${role}
Target company: ${company}
Key skills: ${skills || 'Not specified'}${resumeBlock}

Hard rules:
1. Professional, confident tone. Avoid clichés like "I am writing to apply for".
2. 250-350 words, 3-4 paragraphs.
3. Reference the candidate's real skills and (if resume is provided) actual projects/achievements from it.
4. End with a clear call to action, then sign off with the candidate's name.
5. Output valid Markdown using blank lines between paragraphs. No headings, no bullet lists, no bold text.
6. Return ONLY the cover letter text. No explanations, no notes, no preamble.`;
}

export async function generateWithGemini(payload) {
  if (!API_KEY) throw new Error('No Gemini API key found in .env');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(payload) }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `Gemini API error (${res.status})`;
    if (res.status === 404) {
      throw new Error(`${msg} — check VITE_GEMINI_MODEL in .env (try gemini-2.0-flash or gemini-1.5-flash)`);
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';

  if (!text.trim()) throw new Error('Gemini returned an empty response.');
  return text.trim();
}
