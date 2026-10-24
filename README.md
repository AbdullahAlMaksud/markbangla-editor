# MarkBangla - Bengali and English Markdown Editor & PDF Exporter

<div align="center">

![MarkBangla Logo](public/images/logo.png)

**MarkBangla** is a modern, fast, and feature-rich Markdown editor tailored for Bengali and English typography. It features a real-time split-screen preview, 8 curated typography themes, Mermaid diagram rendering, draggable pane resizing, custom font uploads, vector-quality PDF and Markdown export, and cloud document sharing.

[![pnpm](https://img.shields.io/badge/pnpm-9+-4a4a55?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## Key Features

- **Bilingual Bengali and English Script Support**: Optimized typography and font rendering for complex Bengali conjunct characters (Yuktakshar) and English text (*Tiro Bangla*, *Hind Siliguri*, *Noto Sans Bengali*, *Lora*, *Inter*).
- **Interactive Split Screen with Resize Handle**:
  - Default balanced 50%-50% split width.
  - Smooth drag resizing via mouse or touch to adjust pane proportions.
  - Quick toggle buttons on the divider handle to collapse or maximize either panel.
  - Edge dock and unhide buttons on both sides for effortless panel restoration.
- **8 Curated Typography Themes and Presets**:
  1. **Classic Serif**: Traditional and elegant serif reading experience.
  2. **Modern Teal**: Clean sans-serif typography with crisp teal accents.
  3. **Book / Sepia**: Vintage cream paper tone (`#FBF6EA`), indented paragraphs, and justified text.
  4. **Dark Obsidian**: Deep dark canvas tailored for night reading and coding.
  5. **Minimalist Nordic**: Clean, distraction-free slate aesthetic.
  6. **Rose & Poetry**: Gentle blush paper tint with warm rose accents.
  7. **Academic Paper**: Standard layout structured for research papers, essays, and reports.
  8. **Cyber Terminal**: Matrix-style dark theme with luminous emerald accents.
- **Cloud Document Sharing (`/share/[id]`)**:
  - One-click cloud saving with unique shareable URLs.
  - Rich OpenGraph metadata cards for social media sharing.
  - Read-only sharing mode with an **"Open in Editor"** button for recipient editing and remixing.
  - Dual storage resilience supporting MongoDB Atlas, GitHub API repository backup, and local fallback storage.
- **Mermaid Diagrams (Mermaid.js)**: Live code block rendering into vector SVG flowcharts, sequence diagrams, state machines, and class diagrams.
- **Vector-Quality PDF Export**: Leverages the browser's native `@page` CSS print engine to export sharp, lightweight vector PDFs without rasterization blur.
- **Markdown (.md) File Download**: Instant UTF-8 `.md` file export, automatically named using the document's primary title.
- **Custom Font Uploads**: Upload and preview any `.ttf`, `.otf`, `.woff`, or `.woff2` font directly in the browser with immediate application.
- **Live Page Sizing and Dynamic Page Counter**: Real-time page count calculation based on standard A4 and US Letter page dimensions.
- **Custom Slim Scrollbars**: Modern 6px smooth scrollbars across all panels and screens.

---

## Tech Stack

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Dynamic API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/) (with resilient local storage fallback)
- **Backup Storage**: GitHub API sync for shared documents
- **Diagrams and Code Highlighting**: [Mermaid.js](https://mermaid.js.org/) and [highlight.js](https://highlightjs.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Getting Started

### Prerequisites

Ensure you have Node.js (v18.17 or later) and pnpm installed:

```bash
npm install -g pnpm
```

### 1. Clone the Repository

```bash
git clone https://github.com/AbdullahAlMaksud/markdown-editor-bangla.git
cd markdown-editor-bangla
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection String (Optional - defaults to local fallback if omitted)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/markdown_app?retryWrites=true&w=majority

# App Base URL (local default: http://localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GitHub Backup Storage (Optional)
GITHUB_TOKEN=
GITHUB_REPO=AbdullahAlMaksud/markdown-editor-bangla

# Document Encryption Secret (Optional)
ENCRYPTION_SECRET=
```

*(Note: If MongoDB is not configured, the application automatically uses a persistent local fallback store, enabling full functionality without database setup).*

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```text
├── public/
│   └── images/             # Logo and OpenGraph social preview assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── share/      # API routes for saving and retrieving shared documents
│   │   ├── share/[id]/     # Public viewer route for shared documents
│   │   ├── globals.css     # Global styles, typography themes, and print layouts
│   │   ├── layout.tsx      # Root layout and OpenGraph metadata
│   │   └── page.tsx        # Main application page
│   ├── components/
│   │   ├── markdown-pdf-editor.tsx # Main editor re-export
│   │   ├── navbar.tsx      # Header navigation and top actions
│   │   ├── share-modal.tsx # Cloud share dialog and link generator
│   │   └── ui/             # Reusable UI primitives (dialog, sheet, select, button, etc.)
│   ├── screens/
│   │   ├── editor-screen.tsx # Core split-pane Markdown editor interface
│   │   └── share-screen.tsx  # Shared document viewer interface
│   └── lib/
│       ├── db.ts           # MongoDB driver, GitHub sync, and local storage fallback
│       ├── encryption.ts   # Document encryption and security utilities
│       └── utils.ts        # Tailwind CSS class merge utilities
├── .env.example            # Environment variable template
├── .env.local              # Local environment configuration
└── README.md
```

---

## Contributing

Contributions are welcome and appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

<div align="center">
Developed by <strong>Abdullah Al Maksud</strong>
</div>
