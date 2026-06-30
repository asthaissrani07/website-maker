# Website Maker

A Next.js admin app that lets you build and download standalone Next.js product landing pages — inspired by the [Corevita](https://trycorevita.com/) layout.

## Features

- **Groq AI generation** — describe your product; Groq writes headlines, hero copy, stats, and CTAs
- **Admin dashboard** — view all created product sites
- **Product wizard** — edit AI-generated content, upload image, set price
- **Live preview** — see the generated landing page before downloading
- **ZIP download** — get a complete, runnable Next.js project with README instructions

## Getting Started

### Prerequisites

- Node.js 18.17+
- npm
- A [Groq API key](https://console.groq.com/keys) (free tier available)

### Setup

1. Copy the environment file and add your Groq API key:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and set `GROQ_API_KEY=your_key_here`

3. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Create a product site

1. Click **+ New Site**
2. Enter product name and description in the **Groq AI** section
3. Click **Generate content with AI** — Groq fills in all copy fields
4. Review and edit the generated content; upload a product image
5. Click **Build Product Website**
6. Preview the site and click **Download ZIP**

### Run a downloaded product site

1. Extract the ZIP file
2. Open a terminal in the extracted folder
3. Run `npm install`
4. Run `npm run dev`
5. Visit [http://localhost:3000](http://localhost:3000)

See the `README.md` inside each downloaded ZIP for full instructions.

## Project structure

```
app/
  page.tsx              # Admin dashboard
  create/page.tsx       # Product site form
  sites/[id]/page.tsx   # Site detail, preview iframe, download
  preview/[id]/page.tsx # Full product site preview
  api/                  # Create sites & download ZIP
components/
  admin/                # Dashboard UI
  product/              # Corevita-style landing page components
lib/
  groq.ts               # Groq API client & prompt logic
  store.ts              # In-memory site storage
  generate-site.ts      # ZIP project generator
```

## AI stack

- **[Groq API](https://console.groq.com/)** — fast LLM inference via `groq-sdk`
- **Model:** `llama-3.3-70b-versatile` (override with `GROQ_MODEL` in `.env.local`)
- **Flow:** `/api/generate` sends your product brief → Groq returns structured JSON → form is auto-filled → same template renders the site

## Note on data storage

Sites are stored in memory. They are cleared when the dev server restarts. For production use, connect a database or file-based persistence.

## Tech stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript
- Groq SDK (`groq-sdk`)
