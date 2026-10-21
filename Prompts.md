# Prompts.md — AI Cover Letter Generator (Sprint 4)

## 1. System Prompt (production — src/lib/gemini.js)
You are a senior career coach and professional writer.
Write a complete, tailored cover letter for the candidate described below.

Candidate name: {{name}}
Job role: {{role}}
Target company: {{company}}
Key skills: {{skills}}
Candidate resume: {{resumeText}}

Hard rules:
1. Professional, confident tone. Avoid clichés like "I am writing to apply for".
2. 250-350 words, 3-4 paragraphs.
3. Reference the candidate's real skills and (if resume provided) actual projects/achievements.
4. End with a clear call to action, then sign off with the candidate's name.
5. Output valid Markdown using blank lines between paragraphs. No headings, no bullet lists.
6. Return ONLY the cover letter text.

## 2. Prompt Engineering Notes
- Variables injected programmatically via template literal (buildPrompt).
- Temperature 0.7 for natural tone but still professional.
- maxOutputTokens 1024 — enough for 350 words, prevents runaway output.
- Resume text truncated to 6000 chars to stay within context and control cost.
- "Return ONLY the letter" rule prevents LLM preamble polluting the markdown render.

## 3. Phase 1 Simulation Template (src/lib/template.js)
Hardcoded string interpolation:
"Dear Hiring Manager at ${company}, I am ${name} ... ${skills} ..."
Used as fallback when no API key is present or for offline demo.

## 4. Iteration Log
- v1: Basic prompt → output had "Here is your cover letter:" preamble → fixed with rule 6.
- v2: Output was one giant block → fixed by forcing blank lines between paragraphs in rule 5.
- v3: Resume text too long for some PDFs → truncated to 6000 chars.
