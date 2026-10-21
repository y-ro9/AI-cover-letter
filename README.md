<div align="center">

# ✳ AI Cover Letter Generator

### · LLM-Powered SaaS Utility

A production-ready cover letter generator that uses **Google Gemini** to transform candidate details and uploaded resumes into personalized, professional cover letters — in seconds.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![PDF.js](https://img.shields.io/badge/PDF.js-4.x-FF6B6B)](https://mozilla.github.io/pdf.js/)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

</div>

---

## 📖 Overview

The **AI Cover Letter Generator** is a frontend-only SaaS utility that produces tailored, professional cover letters using large language models. Users fill in a simple form, optionally upload their resume, and the app generates a context-aware cover letter in seconds.

Built as the **Sprint 4 deliverable** for the ProDesk Foundation Projects track — demonstrating **API security, prompt engineering, state management, and document parsing** in a modern React stack.

---

## ✨ Features

### Phase 1 · Base MVP & Data Simulation
- 📋 **Form UI** — Candidate Name, Job Role, Target Company, Key Skills
- ⚡ **Live state** — all fields capture on `onChange`, no page reloads
- 🧪 **Simulation mode** — hardcoded template interpolation (`buildTemplateLetter()`) so the app works **without an API key** — perfect for offline demos and QA testing
- 📋 **Copy to Clipboard** — one-click copy with visual confirmation (`Copied ✓`)

### Phase 2 · LLM Integration & Security
- 🤖 **Google Gemini integration** — powered by `gemini-2.5-flash` via the official REST API
- 🔐 **`.env` key management** — API key lives in `.env`, gitignored, with `.env.example` for setup reference
- 🧠 **Programmatic prompt engineering** — state variables injected into a system prompt via `buildPrompt()`
- ⏳ **Loading state UI** — dedicated spinner + "Generating…" state to handle 2–5s LLM latency
- 🛡️ **Referrer restrictions** — API key locked to specific origins in Google Cloud Console

### Phase 3 · SaaS-Level Capabilities
- 📄 **PDF resume upload** — drag-and-drop dropzone + file picker
- 🔍 **Client-side extraction** — text extracted via `pdfjs-dist` (no backend upload, no privacy concerns)
- 🎯 **Dynamic personalization** — extracted resume text (up to 6,000 chars) appended to LLM prompt for context-aware output
- 📝 **Clean markdown rendering** — responses parsed with `marked` into proper `<p>` tags, not a single text block

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌──────────────┐    │
│   │  Form UI    │───▶│  App State  │───▶│  Controller  │    │
│   │  (onChange) │    │  (useState) │    │  (handle*)   │    │
│   └─────────────┘    └─────────────┘    └──────┬───────┘    │
│                                                │            │
│                      ┌─────────────────────────┼─────────┐  │
│                      │                         │         │  │
│                      ▼                         ▼         ▼  │
│              ┌──────────────┐         ┌──────────────┐      │
│              │   template   │         │    gemini    │      │
│              │  (Phase 1)   │         │  (Phase 2)   │      │
│              └──────────────┘         └──────┬───────┘      │
│                                              │              │
│                                    ┌─────────┼─────────┐    │
│                                    │         ▼         │    │
│                                    │  ┌──────────────┐ │    │
│                                    │  │  pdf.js      │ │    │
│                                    │  │  (Phase 3)   │ │    │
│                                    │  └──────────────┘ │    │
│                                    │                    │    │
│                                    ▼                    ▼    │
│                             ┌────────────┐      ┌─────────┐ │
│                             │ Output Card│◀─────│ marked  │ │
│                             │ (Copy btn) │      │ (render)│ │
│                             └────────────┘      └─────────┘ │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
                    ┌────────────────────┐
                    │  Google Gemini API │
                    │  (v1beta/generate) │
                    └────────────────────┘
```

### Layer responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **UI** | `src/App.jsx` | Form, dropzone, output card, copy button |
| **State** | `src/App.jsx` | Single `useState` for form, letter, loading, error, resume |
| **Controller** | `src/App.jsx` | `handleGenerate`, `handleCopy`, `handleResume` |
| **Simulation** | `src/lib/template.js` | Offline template interpolation |
| **LLM Service** | `src/lib/gemini.js` | API call + prompt builder |
| **Parser** | `src/lib/pdf.js` | Client-side PDF text extraction |
| **Renderer** | `marked` lib | Markdown → HTML paragraphs |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- A **Google Gemini API key** — [get one free](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/sprint-4_cover-letter-ai.git
cd sprint-4_cover-letter-ai

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and paste your real Gemini key

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) → app should load with a **green "API key detected"** badge in the top-right.

### Build for production

```bash
npm run build
npm run preview
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-2.5-flash
```

| Variable | Required | Description |
|---|---|---|
| `VITE_GEMINI_API_KEY` | ✅ | Your Gemini API key from [AI Studio](https://aistudio.google.com/app/apikey) |
| `VITE_GEMINI_MODEL` | ❌ | Model name. Defaults to `gemini-2.5-flash`. Try `gemini-2.0-flash` or `gemini-1.5-flash` if you hit a 404. |

> **⚠️ Security Warning**
> `.env` **must never be committed**. It's already listed in `.gitignore`. If you accidentally push it, **revoke and regenerate your key immediately** in Google Cloud Console — GitHub commit history keeps a permanent record.

---

## 🔒 Security Architecture

This project treats API key protection as a **first-class concern**:

1. **`.gitignore` first** — `.env`, `.env.local`, `.env.*.local` are ignored **before** the first commit
2. **`.env.example` tracked** — shows the required keys without exposing real values
3. **`git check-ignore .env`** — verifiable proof that git will never track the key
4. **Referrer restrictions** — API key is restricted in Google Cloud Console to specific origins (`localhost:5173`, production URL)
5. **Production path** — in a real deployment, the LLM call would route through a backend proxy (Node/Express, Cloudflare Worker, etc.) so the key never reaches the browser bundle

> **Why `VITE_` prefix is used here:** Vite exposes `VITE_*` variables to the client bundle. This is acceptable for the sprint MVP because the key is restricted and referrer-locked. For a production SaaS, the key would move to a backend and never be prefixed with `VITE_`.

---

## 📁 Project Structure

```
sprint-4_cover-letter-ai/
├── .env                        # local only — NEVER committed
├── .env.example                # tracked, shows required keys
├── .gitignore                  # .env is listed
├── Prompts.md                  # AI prompt engineering log
├── README.md                   # this file
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                # React entry point
    ├── index.css               # global reset
    ├── App.jsx                 # main component (form + output)
    ├── App.css                 # component styles
    └── lib/
        ├── template.js         # Phase 1 simulation
        ├── gemini.js           # Phase 2 Gemini API + prompt
        └── pdf.js              # Phase 3 PDF extraction
```

---

## 🧠 Prompt Engineering

The system prompt is built programmatically in `src/lib/gemini.js` via `buildPrompt()`. State variables and extracted resume text are interpolated into a structured prompt that enforces:

- **Professional tone** — explicit "avoid clichés" instruction
- **Length control** — 250–350 words, 3–4 paragraphs
- **Resume grounding** — reference real projects/achievements from the uploaded PDF
- **Markdown output** — blank lines between paragraphs, no headings, no bullets
- **No preamble** — model returns only the letter text, no "Here is your cover letter:"

Full prompt evolution and iteration notes are in **[`Prompts.md`](./Prompts.md)**.

### Temperature & token budget

| Parameter | Value | Rationale |
|---|---|---|
| `temperature` | `0.7` | Natural tone but still professional |
| `maxOutputTokens` | `1024` | Enough for 350 words + signoff, prevents runaway output |
| Resume truncation | `6000 chars` | Stays within context window, controls cost |

---

## 🎥 Demo Video

3-minute voiceover walkthrough covering all three phases:

> 📺 **[Watch on Linkedin →](https://youtu.be/YOUR_VIDEO_ID)**

---

## 🛠 Tech Stack

| Layer | Library | Purpose |
|---|---|---|
| Framework | [React 18](https://react.dev) | Component architecture + state |
| Build tool | [Vite](https://vitejs.dev) | Dev server + production bundling |
| LLM | [Google Gemini](https://ai.google.dev) | Cover letter generation |
| PDF parsing | [pdfjs-dist](https://mozilla.github.io/pdf.js/) | Client-side resume text extraction |
| Markdown | [marked](https://marked.js.org) | Render markdown responses as HTML |
| Styling | Vanilla CSS | Zero-dependency styling |

---

## 🐛 Troubleshooting

### `npm audit` reports esbuild vulnerability

Update Vite to the latest major:

```bash
npm install -D vite@latest @vitejs/plugin-react@latest
```

### `esbuild: postinstall blocked` on Arch Linux

```bash
npm install-scripts approve esbuild
npm rebuild esbuild
```

### Gemini API returns `404 model not found`

The default `gemini-2.5-flash` may not be available on your API key's tier. Change `.env`:

```env
VITE_GEMINI_MODEL=gemini-2.0-flash
```

### PDF parsing fails

- Ensure the PDF has a **text layer** (not scanned images)
- Scanned PDFs require OCR — out of scope for this MVP

### "API key detected" badge shows warning

- Verify `.env` exists in the **project root** (not in `src/`)
- Restart `npm run dev` — Vite doesn't hot-reload `.env` changes
- Confirm the variable is prefixed with `VITE_`

---

## ✅ Deliverables Checklist

- [x] Phase 1 — Form UI, simulation mode, copy to clipboard
- [x] Phase 2 — Gemini API integration, `.env` security, loading state
- [x] Phase 3 — PDF upload, extraction, resume-aware prompting
- [x] `.env` gitignored and confirmed via `git check-ignore`
- [x] `Prompts.md` with system prompt + iteration log
- [x] 3-minute voiceover QA video
- [x] Clean markdown → HTML rendering

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with ☕ and a lot of `console.log` debugging during Sprint 4**

ProDesk Foundation Projects · 2026 Stack

</div>
