# MarkBangla — Markdown Editor for Bangla and English

**Short Description:** A modern, browser-based Markdown editor designed for Bengali and English typography, featuring real-time split-screen preview, customizable typography themes, Mermaid diagrams, custom font uploads, vector-quality PDF export, and cloud document sharing.

[![pnpm](https://img.shields.io/badge/pnpm-9+-4a4a55?style=for-the-badge&logo=pnpm&logoColor=f69220)](https://pnpm.io/)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <img width="49%" alt="MarkBangla screenshot 1" src="https://github.com/user-attachments/assets/38f390e1-a873-4b97-94e9-d25b03b83dcb" />
  <img width="49%" alt="MarkBangla screenshot 2" src="https://github.com/user-attachments/assets/b9a2e066-a4a6-4d3e-9fac-20e3bb00f3ad" />
</p>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

MarkBangla is a modern, browser-based Markdown editor designed for Bengali and English writing. It provides a distraction-free writing environment with a real-time preview, customizable typography themes, and flexible document export options.

Optimized for Bengali typography, including complex conjunct characters (যুক্তাক্ষর), MarkBangla also supports English text and multilingual documents. Whether you're writing articles, academic papers, reports, or book manuscripts, you can write, format, preview, and export your content from a single workspace.

With resizable editing panels, custom font uploads, Mermaid diagram rendering, and shareable cloud documents, MarkBangla brings writing and document publishing together in one application.

## Features

- **Bilingual Typography Support:** Optimized Bengali and English text rendering using fonts such as Tiro Bangla, Hind Siliguri, Noto Sans Bengali, Lora, and Inter.
- **Real-Time Split-Screen Preview:** Write Markdown and preview the rendered document side by side with a balanced 50/50 default layout.
- **Draggable Pane Resizing:** Adjust the editor and preview widths using mouse or touch gestures.
- **Flexible Panel Controls:** Collapse or maximize either panel and restore hidden panels using edge-docked controls.
- **Mermaid Diagram Rendering:** Render Mermaid code blocks as SVG diagrams, including flowcharts, sequence diagrams, state machines, and class diagrams.
- **Vector-Quality PDF Export:** Generate sharp PDFs using the browser's native CSS print engine without rasterization blur.
- **Markdown File Download:** Export documents as UTF-8 `.md` files, automatically named using the document's primary title.
- **Custom Font Uploads:** Upload and preview `.ttf`, `.otf`, `.woff`, and `.woff2` fonts directly in the browser.
- **Dynamic Page Counter:** Calculate document pages using standard A4 and US Letter dimensions.
- **Cloud Document Sharing:** Save documents and generate unique shareable URLs using the `/share/[id]` route.
- **Social Media Preview Metadata:** Generate rich OpenGraph metadata for shared documents.
- **Read-Only Shared Documents:** Let recipients view shared content and use the **Open in Editor** option to edit or remix it.
- **Flexible Storage:** Support MongoDB Atlas, GitHub API repository backup, and local fallback storage for document persistence.
- **Typography-Focused Interface:** Enjoy streamlined scrollbars and carefully designed writing and reading panels.

### Typography Themes

MarkBangla includes eight curated themes for different writing and reading experiences.

| Theme | Description |
| --- | --- |
| **Classic Serif** | A traditional, elegant serif reading experience. |
| **Modern Teal** | Clean sans-serif typography with crisp teal accents. |
| **Book / Sepia** | Warm cream paper (`#FBF6EA`), indented paragraphs, and justified text. |
| **Dark Obsidian** | A deep dark canvas for night reading and coding. |
| **Minimalist Nordic** | A clean, distraction-free slate aesthetic. |
| **Rose & Poetry** | A gentle blush background with warm rose accents. |
| **Academic Paper** | A structured layout for research papers, essays, and reports. |
| **Cyber Terminal** | A Matrix-inspired dark theme with luminous emerald accents. |

## Tech Stack

- **Package Manager:** [pnpm](https://pnpm.io/)
- **Framework:** [Next.js 16](https://nextjs.org/) — App Router, Server Components, and dynamic API routes
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI Components:** [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/) with local storage fallback
- **Backup Storage:** GitHub API for repository synchronization
- **Diagram Rendering:** [Mermaid.js](https://mermaid.js.org/)
- **Code Highlighting:** [highlight.js](https://highlightjs.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PDF Export:** Browser-native CSS print engine

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js 20.9 or later](https://nodejs.org/)
- [pnpm 9 or later](https://pnpm.io/installation)

Install pnpm globally if needed:

```bash
npm install -g pnpm
```

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/AbdullahAlMaksud/markbangla-editor.git
cd markbangla-editor
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Configure environment variables**

Create a `.env.local` file in the project root and configure the required variables using `.env.example` as your reference.

See [Environment Variables](#environment-variables) for details.

**4. Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**5. Build and run for production**

```bash
pnpm build
pnpm start
```

### Environment Variables

MarkBangla uses environment variables to configure application services and external integrations.

1. Create a `.env.local` file in the project root.
2. Review `.env.example` for available variables and their intended use.
3. Configure the required settings for MongoDB Atlas and GitHub API integration, as applicable.
4. Keep credentials and access tokens private.

Never commit your real `.env.local` file or expose private credentials in client-side code.

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Create a production build. |
| `pnpm start` | Run the production build. |

### Project Structure

```text
markbangla-editor/
├── public/
│   └── images/                    # Logo and OpenGraph preview assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── share/             # API routes for shared documents
│   │   ├── share/
│   │   │   └── [id]/              # Public shared-document viewer
│   │   ├── globals.css            # Global styles, themes, and print layouts
│   │   ├── layout.tsx             # Root layout and OpenGraph metadata
│   │   └── page.tsx               # Main application page
│   ├── components/
│   │   ├── markdown-pdf-editor.tsx # Main editor re-export
│   │   ├── navbar.tsx              # Header navigation and actions
│   │   ├── share-modal.tsx         # Document-sharing dialog
│   │   └── ui/                     # Reusable UI primitives
│   ├── screens/
│   │   ├── editor-screen.tsx      # Split-pane Markdown editor
│   │   └── share-screen.tsx       # Shared-document viewer
│   └── lib/
│       ├── db.ts                  # Database, GitHub sync, and local fallback
│       ├── encryption.ts          # Document encryption utilities
│       └── utils.ts               # Tailwind CSS class utilities
├── .env.example                   # Environment variable template
├── .env.local                     # Local environment file (not committed)
└── README.md
```

### Deployment

MarkBangla can be deployed to [Vercel](https://vercel.com/) or another hosting platform that supports Next.js.

Before deploying, configure the environment variables required by your chosen storage integrations and ensure that the database and GitHub API settings are correct.

To build and run the production application:

```bash
pnpm build
pnpm start
```

For platform-specific instructions, consult the [Next.js deployment documentation](https://nextjs.org/docs/app/getting-started/deploying).

## Contributing

Contributions are welcome and appreciated.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add some AmazingFeature"
   ```

4. Push the branch:

   ```bash
   git push origin feature/AmazingFeature
   ```

5. Open a pull request.

For larger changes, consider opening an issue first to discuss the proposed improvements.

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

## Contact

**Abdullah Al Maksud**

Email: [maksud.workspace@gmail.com](mailto:maksud.workspace@gmail.com)

Website: [abdullahalmaksud.com](https://abdullahalmaksud.com)

LinkedIn: [@AbdullahAlMaksud](https://linkedin.com/in/AbdullahAlMaksud)

GitHub: [@AbdullahAlMaksud](https://github.com/AbdullahAlMaksud)
