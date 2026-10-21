import { useState } from 'react';
import { marked } from 'marked';
import { buildTemplateLetter } from './lib/template';
import { generateWithGemini, hasApiKey } from './lib/gemini';
import { extractPdfText } from './lib/pdf';
import './App.css';

const INITIAL_FORM = { name: '', role: '', company: '', skills: '' };

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [mode, setMode] = useState(hasApiKey ? 'ai' : 'sim');
  const [letter, setLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Phase 3: resume state
  const [resumeText, setResumeText] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canGenerate =
    form.name.trim() && form.role.trim() && form.company.trim() && !isParsing;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!canGenerate || isGenerating) return;

    setError('');
    setCopied(false);
    setIsGenerating(true);

    try {
      if (mode === 'sim') {
        await new Promise((r) => setTimeout(r, 600)); // simulated latency
        setLetter(buildTemplateLetter(form));
      } else {
        const text = await generateWithGemini({ ...form, resumeText });
        setLetter(text);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = letter;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResume = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }
    setIsParsing(true);
    setError('');
    try {
      const text = await extractPdfText(file);
      if (!text) throw new Error('No readable text found in this PDF.');
      setResumeText(text);
      setResumeName(file.name);
    } catch (err) {
      setError('Could not parse PDF: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleResume(e.dataTransfer.files?.[0]);
  };

  const html = letter ? marked.parse(letter) : '';

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo">✳</span>
          <div>
            <h1>AI Cover Letter Generator</h1>
            <p>Sprint 4 · LLM-powered SaaS utility</p>
          </div>
        </div>
        <span className={`status ${hasApiKey ? 'ok' : 'warn'}`}>
          {hasApiKey ? 'API key detected' : 'No API key → Simulation mode'}
        </span>
      </header>

      <main className="grid">
        <form className="card" onSubmit={handleGenerate} autoComplete="off">
          <h2>Candidate &amp; Role Details</h2>

          <label htmlFor="name">Candidate Name</label>
          <input id="name" type="text" name="name" value={form.name}
            onChange={handleChange} placeholder="e.g. Aarav Sharma" required />

          <label htmlFor="role">Job Role</label>
          <input id="role" type="text" name="role" value={form.role}
            onChange={handleChange} placeholder="e.g. Frontend Developer" required />

          <label htmlFor="company">Target Company</label>
          <input id="company" type="text" name="company" value={form.company}
            onChange={handleChange} placeholder="e.g. ProDesk" required />

          <label htmlFor="skills">
            Key Skills <span className="hint">(comma separated)</span>
          </label>
          <textarea id="skills" name="skills" rows="3" value={form.skills}
            onChange={handleChange} placeholder="React, Node.js, REST APIs, SQL" />

          <label>
            Upload Resume <span className="hint">(optional, PDF)</span>
          </label>
          <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('resume-input').click()}
          >
            <input id="resume-input" type="file" accept="application/pdf,.pdf"
              hidden onChange={(e) => handleResume(e.target.files?.[0])} />
            {isParsing
              ? 'Parsing PDF…'
              : resumeName
                ? `✓ ${resumeName} — ${resumeText.length} chars extracted`
                : 'Drop PDF here or click to browse'}
          </div>

          <div className="mode">
            <label>
              <input type="radio" checked={mode === 'sim'}
                onChange={() => setMode('sim')} /> Simulation (Phase 1)
            </label>
            <label>
              <input type="radio" checked={mode === 'ai'} disabled={!hasApiKey}
                onChange={() => setMode('ai')} /> Gemini AI (Phase 2)
            </label>
          </div>

          <button type="submit" disabled={!canGenerate || isGenerating}>
            {isGenerating ? 'Generating…' : 'Generate Cover Letter'}
          </button>

          {error && <p className="error">{error}</p>}
        </form>

        <section className="card">
          <div className="output-head">
            <h2>Generated Letter</h2>
            {letter && !isGenerating && (
              <button type="button" className="copy" onClick={handleCopy}>
                {copied ? 'Copied ✓' : 'Copy to Clipboard'}
              </button>
            )}
          </div>

          {isGenerating && (
            <div className="generating">
              <span className="spinner" />
              Generating your cover letter… (LLM latency 2–5s)
            </div>
          )}

          {!isGenerating && !letter && (
            <p className="empty">Fill the form and hit Generate.</p>
          )}

          {!isGenerating && letter && (
            <div className="letter" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </section>
      </main>
    </div>
  );
}
