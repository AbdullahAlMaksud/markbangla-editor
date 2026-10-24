"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { marked } from "marked";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  FilePlus,
  Files,
  FileText,
  FolderOpen,
  GripVertical,
  Minus,
  MonitorSmartphone,
  Plus,
  RotateCcw,
  Sliders,
  Sparkles,
  Upload,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Navbar, type ViewMode } from "@/components/navbar";
import { ShareModal } from "@/components/share-modal";

const SAMPLE_MARKDOWN = `# 📄 স্বাগতম MarkBangla — আধুনিক মার্কডাউন এডিটর

**MarkBangla** হলো বাংলা ও ইংরেজির জন্য বিশেষভাবে অপ্টিমাইজ করা একটি রিয়েল-টাইম মার্কডাউন এডিটর এবং হাই-রেজোলিউশন ভেক্টর পিডিএফ এক্সপোর্টার।

আপনার প্রতিটি ডকুমেন্ট ডিভাইসে সম্পূর্ণ **ব্যক্তিগত ও নিরাপদ** (100% Client-Side Private)। প্রয়োজন হলে এক ক্লিকেই তৈরি করতে পারেন এন্ড-টু-এন্ড সুরক্ষিত শেয়ার লিঙ্ক।

---

## ১. মূল বৈশিষ্ট্যসমূহ (Core Features)

- **দ্বিমুখী স্প্লিট ওয়ার্কস্পেস**: একসাথে কোড বা টেক্সট লিখুন এবং পাশাপাশি লাইভ প্রিভিউ উপভোগ করুন।
- **স্বয়ংক্রিয় ফ্লোচার্ট ও ডায়াগ্রাম**: \`mermaid\` ব্লকের মাধ্যমে স্বয়ংক্রিয় ভেক্টর ডায়াগ্রাম রেন্ডারিং।
- **টাইপোগ্রাফি ও থিম প্রিসেট**: Classic Serif, Modern Clean, Boi (বই), Academic সহ ৮টি সুসজ্জিত প্রিমিয়াম স্টাইল।
- **কাস্টম বাংলা ফন্ট সমর্থন**: আপনার ডিভাইসের যেকোনো TTF, OTF বা WOFF ফন্ট এক ক্লিকে যুক্ত করার সুবিধা।
- **ভেক্টর পিডিএফ ও .md এক্সপোর্ট**: মার্জিন ও পেইজ সাইজ (A4 / Letter) অনুযায়ী নির্ভুল ও ঝকঝকে পিডিএফ প্রিন্ট।

### ১.১ টেক্সট ফরম্যাটিং স্টাইল (Formatting Showcase)
- **গাঢ় টেক্সট (Bold)** এবং *তির্যক টেক্সট (Italic)*
- ~~কাটা দাগযুক্ত টেক্সট (Strikethrough)~~
- ইনলাইন কোড: \`const editor = "MarkBangla";\`
- ওয়েব লিঙ্ক: [MarkBangla GitHub](https://github.com)

> "সহজতাই হলো যেকোনো নির্ভরযোগ্য সিস্টেমের মূল পূর্বশর্ত।" — এডসগার ডব্লিউ. ডিকস্ট্রা
> *"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra*

---

## ২. ফ্লোচার্ট ডায়াগ্রাম (Flowchart & Architecture)

\`\`\`mermaid
flowchart TD
    A["📝 মার্কডাউন এডিটরে লিখুন"] --> B["⚡ রিয়েল-টাইম পার্সার ও স্যানিটাইজার"]
    B --> C["👀 লাইভ ভিজ্যুয়াল প্রিভিউ (Live Preview)"]
    C --> D{"📤 আউটপউট নির্বাচন"}
    D -->|"লোকাল প্রিন্ট"| E["📄 ভেক্টর PDF অথবা .md ফাইল"]
    D -->|"ক্লাউড শেয়ার"| F["🌐 সুরক্ষিত শেয়ার্ড লিংক"]
\`\`\`

---

## ৩. ফিচার তুলনামূলক তালিকা (Feature Matrix)

| ফিচার (Feature) | সমর্থন (Support) | বিবরণ (Description) | স্ট্যাটাস |
| :--- | :---: | :--- | :---: |
| **বাংলা টাইপোগ্রাফি** | হ্যাঁ | Hind Siliguri, Tiro Bangla, Lora ফন্ট | ✅ সম্পূর্ণ সক্রিয় |
| **Mermaid.js ফ্লোচার্ট** | হ্যাঁ | ডায়াগ্রাম ও চার্ট ক্লায়েন্ট-সাইড রেন্ডারিং | ✅ সম্পূর্ণ সক্রিয় |
| **প্রিন্ট ও PDF এক্সপোর্ট** | হ্যাঁ | A4 এবং Letter সাইজে ভেক্টর কোয়ালিটি | ✅ সম্পূর্ণ সক্রিয় |
| **ক্লাউড শেয়ারিং** | হ্যাঁ | অ্যান্ড-টু-অ্যান্ড এনক্রিপ্টেড রিড-ওনলি লিঙ্ক | ✅ সম্পূর্ণ সক্রিয় |

---

## ৪. চেকলিস্ট ও করণীয় (Task Checklist)

- [x] বাংলা ফন্ট ও লেআউট টেস্ট সম্পন্ন
- [x] Mermaid.js ফ্লোচার্ট ডায়াগ্রাম রেন্ডারিং নিশ্চিত করা
- [x] ক্লাউড শেয়ারিং লিঙ্ক ভেরিফিকেশন
- [ ] আপনার নতুন আর্টিকেল বা নোট লেখা শুরু করুন!

---

## ৫. কোড ব্লক (Code Blocks & Highlighting)

\`\`\`javascript
// বাংলা কোড উদাহরণ
function createMarkBanglaDocument(title, author) {
  return {
    title: title,
    author: author,
    createdAt: new Date().toISOString(),
    status: "Draft Ready",
  };
}

const myDoc = createMarkBanglaDocument("আমার নতুন বই", "আব্দুল্লাহ");
console.log(myDoc);
\`\`\`

---

*Happy writing with **MarkBangla** — বাংলা লেখার আধুনিক মাধ্যম!*`;

type Preset =
  | "classic"
  | "modern"
  | "boi"
  | "dark"
  | "nordic"
  | "rose"
  | "academic"
  | "cyber";

type PageSize = "a4" | "letter";

const PRESET_FONTS: Record<Preset, { heading: string; body: string }> = {
  classic: {
    heading: "'Lora', 'Tiro Bangla', serif",
    body: "'Lora', 'Hind Siliguri', serif",
  },
  modern: {
    heading: "'Inter', 'Hind Siliguri', sans-serif",
    body: "'Inter', 'Hind Siliguri', sans-serif",
  },
  boi: {
    heading: "'Lora', 'Tiro Bangla', serif",
    body: "'Noto Sans Bengali', 'Hind Siliguri', serif",
  },
  dark: {
    heading: "'Inter', 'Hind Siliguri', sans-serif",
    body: "'Inter', 'Hind Siliguri', sans-serif",
  },
  nordic: {
    heading: "'Inter', 'Hind Siliguri', sans-serif",
    body: "'Inter', 'Hind Siliguri', sans-serif",
  },
  rose: {
    heading: "'Lora', 'Tiro Bangla', serif",
    body: "'Lora', 'Hind Siliguri', serif",
  },
  academic: {
    heading: "'Lora', 'Tiro Bangla', serif",
    body: "'Lora', 'Hind Siliguri', serif",
  },
  cyber: {
    heading: "'JetBrains Mono', 'Inter', monospace",
    body: "'JetBrains Mono', 'Inter', monospace",
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const renderer = new marked.Renderer();
renderer.code = (code: string, infostring?: string) => {
  const lang = (infostring || "").trim().split(/\s+/)[0] || "";
  if (lang === "mermaid") {
    return `<div class="mermaid">${escapeHtml(code)}</div>`;
  }
  const langClass = lang ? ` class="language-${lang}"` : "";
  return `<pre><code${langClass}>${escapeHtml(code)}</code></pre>`;
};

marked.setOptions({ gfm: true, breaks: true, renderer });

export default function EditorScreen() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [preset, setPreset] = useState<Preset>("classic");
  const [fontChoice, setFontChoice] = useState("default");
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [wide, setWide] = useState(false);

  // Settings Sheet state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Split resize state (initially 50%)
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [estimatedPages, setEstimatedPages] = useState(1);

  // Sharing modal states
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mdFileInputRef = useRef<HTMLInputElement>(null);

  // Load imported document from localStorage if opened from /share/[id]
  useEffect(() => {
    try {
      const saved = localStorage.getItem("imported_shared_doc");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.markdown === "string") setMarkdown(parsed.markdown);
        if (parsed.preset) setPreset(parsed.preset);
        if (parsed.fontChoice) setFontChoice(parsed.fontChoice);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.pageSize) setPageSize(parsed.pageSize);
        if (typeof parsed.wide === "boolean") setWide(parsed.wide);
        if (parsed.viewMode) setViewMode(parsed.viewMode);
        localStorage.removeItem("imported_shared_doc");
      }
    } catch (err) {
      console.warn("Error loading imported shared doc:", err);
    }
  }, []);

  const wordCount = useMemo(
    () => (markdown.trim().match(/\S+/g) || []).length,
    [markdown]
  );

  function getDocumentBaseName(): string {
    const firstHeadingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
    let filename = firstHeadingMatch ? firstHeadingMatch[1].trim() : "Untitled Document";
    filename = filename.replace(/[\\/:*?"<>|]/g, "").slice(0, 60) || "document";
    return filename;
  }

  const documentTitle = useMemo(() => {
    const firstHeadingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
    return firstHeadingMatch ? firstHeadingMatch[1].trim() : "Untitled Document";
  }, [markdown]);

  // Dynamic estimated page calculation based on printable height
  useEffect(() => {
    const updatePageCount = () => {
      if (!pageRef.current) return;
      const mmToPx = 3.7795;
      const pageHeightMm = pageSize === "a4" ? 297 : 279.4;
      const marginMm = 40; // 20mm top + 20mm bottom
      const printableHeightPx = (pageHeightMm - marginMm) * mmToPx;
      const contentHeight = pageRef.current.scrollHeight;
      const pages = Math.max(1, Math.ceil(contentHeight / printableHeightPx));
      setEstimatedPages(pages);
    };

    const timer = setTimeout(updatePageCount, 120);
    return () => clearTimeout(timer);
  }, [html, pageSize, fontSize, wide, preset, viewMode]);

  // Mouse & Touch drag handler for split resizing
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const newPercent = ((clientX - rect.left) / rect.width) * 100;
      // Clamp between 15% and 85%
      const clamped = Math.min(Math.max(newPercent, 15), 85);
      setSplitPercent(clamped);
    };

    const handleStop = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleStop);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleStop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleStop);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleStop);
    };
  }, [isDragging]);

  // Render markdown -> sanitized HTML (DOMPurify client-only)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const DOMPurify = (await import("dompurify")).default;
      const raw = marked.parse(markdown) as string;
      const clean = DOMPurify.sanitize(raw, { ADD_TAGS: ["div"], ADD_ATTR: ["class"] });
      if (!cancelled) setHtml(clean);
    })();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  // SVG diagrams via mermaid + code syntax highlighting
  useEffect(() => {
    if (!previewRef.current) return;
    const container = previewRef.current;
    const mermaidNodes = container.querySelectorAll<HTMLElement>(".mermaid");
    const codeNodes = container.querySelectorAll<HTMLElement>("pre code");
    if (mermaidNodes.length === 0 && codeNodes.length === 0) return;

    let cancelled = false;
    (async () => {
      if (codeNodes.length > 0) {
        const hljs = (await import("highlight.js")).default;
        if (cancelled) return;
        codeNodes.forEach((el) => {
          try {
            hljs.highlightElement(el);
          } catch (err) {
            console.error("Highlight failed:", err);
          }
        });
      }

      if (mermaidNodes.length > 0) {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "Inter, Hind Siliguri, sans-serif",
        });
        try {
          if (!cancelled) await mermaid.run({ nodes: Array.from(mermaidNodes) });
        } catch (err) {
          console.error("Mermaid render failed:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html, viewMode]);

  // Apply heading/body font variables whenever preset or font choice changes
  useEffect(() => {
    const base = PRESET_FONTS[preset];
    const root = document.documentElement.style;
    if (fontChoice !== "default") {
      root.setProperty("--font-heading", `'${fontChoice}', ${base.heading}`);
      root.setProperty("--font-body", `'${fontChoice}', ${base.body}`);
    } else {
      root.setProperty("--font-heading", base.heading);
      root.setProperty("--font-body", base.body);
    }
  }, [preset, fontChoice]);

  // Apply font size variable
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--preview-font-size",
      `${fontSize}px`
    );
  }, [fontSize]);

  // Keep printed page size in sync
  useEffect(() => {
    let styleEl = document.getElementById(
      "page-size-style"
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "page-size-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@page { size: ${
      pageSize === "a4" ? "A4" : "letter"
    }; margin: 20mm 18mm; }`;
  }, [pageSize]);

  async function handleFontUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newNames: string[] = [];

    for (const file of files) {
      try {
        const buffer = await file.arrayBuffer();
        let name = file.name
          .replace(/\.(ttf|otf|woff2?|OTF|TTF)$/, "")
          .replace(/[^a-zA-Z0-9 _-]/g, "");
        if (!name) name = "CustomFont";

        const face = new FontFace(name, buffer);
        await face.load();
        document.fonts.add(face);
        newNames.push(name);
      } catch (err) {
        console.error("Font load failed:", file.name, err);
      }
    }

    if (newNames.length) {
      setCustomFonts((prev) => [...prev, ...newNames]);
      setFontChoice(newNames[newNames.length - 1]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleOpenMarkdownFile() {
    mdFileInputRef.current?.click();
  }

  function handleMdFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setMarkdown(content);
        if (viewMode === "preview") {
          setViewMode("split");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleLoadSampleMarkdown() {
    setMarkdown(SAMPLE_MARKDOWN);
  }

  function handleNewBlankDocument() {
    setMarkdown("");
  }

  function handlePrint() {
    const originalTitle = document.title;
    const filename = getDocumentBaseName();
    document.title = filename;

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);

    window.print();
  }

  function handleDownloadMarkdown() {
    const filename = getDocumentBaseName();
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleCreateShareLink() {
    try {
      setSharing(true);
      setShareError(null);
      const filename = getDocumentBaseName();

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          markdown,
          title: filename,
          preset,
          fontChoice,
          fontSize,
          pageSize,
          wide,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to create share link on server. Please try again.");
      }

      const data = await res.json();
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
      }
    } catch (err: any) {
      setShareError(err.message || "Failed to create share link");
    } finally {
      setSharing(false);
    }
  }

  const showEditor = viewMode === "editor" || viewMode === "split";
  const showPreview = viewMode === "preview" || viewMode === "split";

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col overflow-hidden bg-canvas print:h-auto print:overflow-visible",
        isDragging && "cursor-col-resize select-none"
      )}
    >
      {/* Top Navbar Component */}
      <Navbar
        documentTitle={documentTitle}
        wordCount={wordCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        wide={wide}
        onToggleWide={() => setWide((w) => !w)}
        onOpenShareModal={() => setShareModalOpen(true)}
        onDownloadPdf={handlePrint}
        onDownloadMarkdown={handleDownloadMarkdown}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenMarkdownFile={handleOpenMarkdownFile}
        onLoadSampleMarkdown={handleLoadSampleMarkdown}
        onNewBlankDocument={handleNewBlankDocument}
      />

      {/* Hidden file input for opening .md files */}
      <input
        type="file"
        ref={mdFileInputRef}
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className="hidden"
        onChange={handleMdFileSelect}
      />

      {/* Share Modal Dialog with Privacy Disclosure */}
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        documentTitle={documentTitle}
        onGenerateLink={handleCreateShareLink}
        shareUrl={shareUrl}
        onResetShareUrl={() => setShareUrl(null)}
        loading={sharing}
        error={shareError}
      />

      {/* Style & Settings Sheet Sidebar */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="no-print overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base font-bold text-toolbar-foreground">
              Style &amp; Settings
            </SheetTitle>
            <SheetDescription>
              Customize document presets, typography, and page layout.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-5 pb-6">
            {/* View mode */}
            <div className="flex flex-col gap-2">
              <Label>View Mode</Label>
              <div className="flex rounded-md border border-toolbar-border bg-toolbar-2 p-1">
                {(
                  [
                    { key: "editor", label: "Editor" },
                    { key: "split", label: "Split" },
                    { key: "preview", label: "Preview" },
                  ] as { key: ViewMode; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setViewMode(opt.key)}
                    className={cn(
                      "flex-1 rounded px-2 py-1.5 text-xs font-medium transition-colors",
                      viewMode === opt.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-toolbar-muted hover:text-toolbar-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant={wide ? "default" : "outline"}
                  size="sm"
                  className="mt-1 flex-1 justify-start gap-2 text-xs"
                  onClick={() => setWide((w) => !w)}
                >
                  <MonitorSmartphone className="h-3.5 w-3.5" />
                  Wide Mode {wide ? "Enabled" : "Disabled"}
                </Button>
                {viewMode === "split" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 justify-start gap-1 text-xs"
                    onClick={() => setSplitPercent(50)}
                    title="Reset split to 50/50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    50-50
                  </Button>
                )}
              </div>
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Style preset */}
            <div className="flex flex-col gap-2">
              <Label>Design Preset</Label>
              <Select value={preset} onValueChange={(v) => setPreset(v as Preset)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic Serif</SelectItem>
                  <SelectItem value="modern">Modern Clean</SelectItem>
                  <SelectItem value="boi">Book &amp; Sepia</SelectItem>
                  <SelectItem value="dark">Dark Obsidian</SelectItem>
                  <SelectItem value="nordic">Minimalist Nordic</SelectItem>
                  <SelectItem value="rose">Rose &amp; Poetry</SelectItem>
                  <SelectItem value="academic">Academic Paper</SelectItem>
                  <SelectItem value="cyber">Cyber Terminal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font */}
            <div className="flex flex-col gap-2">
              <Label>Typography &amp; Font</Label>
              <Select value={fontChoice} onValueChange={setFontChoice}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default for Preset</SelectItem>
                  <SelectGroup>
                    <SelectLabel>Standard Web Fonts</SelectLabel>
                    <SelectItem value="Inter">Inter (Sans-serif)</SelectItem>
                    <SelectItem value="Lora">Lora (Serif)</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono (Monospace)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Multilingual &amp; Bengali Fonts</SelectLabel>
                    <SelectItem value="Hind Siliguri">Hind Siliguri</SelectItem>
                    <SelectItem value="Noto Sans Bengali">Noto Sans Bengali</SelectItem>
                    <SelectItem value="Tiro Bangla">Tiro Bangla</SelectItem>
                  </SelectGroup>
                  {customFonts.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Custom Uploaded Fonts</SelectLabel>
                      {customFonts.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                asChild
              >
                <label className="cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  Upload Custom Font (.ttf / .otf / .woff)
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".ttf,.otf,.woff,.woff2"
                    multiple
                    className="hidden"
                    onChange={handleFontUpload}
                  />
                </label>
              </Button>
              {customFonts.length > 0 && (
                <span className="truncate text-xs text-emerald-400">
                  Added: {customFonts.join(", ")}
                </span>
              )}
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Font Size */}
            <div className="flex flex-col gap-2">
              <Label>Body Font Size</Label>
              <div className="flex items-center gap-2 rounded-md border border-toolbar-border bg-toolbar-2 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setFontSize((s) => Math.max(10, s - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="flex-1 text-center text-sm">{fontSize}px</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Page Size */}
            <div className="flex flex-col gap-2">
              <Label>Page Size Format</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Downloads / Export Section */}
            <div className="flex flex-col gap-2.5">
              <Label>Quick Export</Label>
              <Button
                className="w-full gap-2 bg-primary font-medium hover:bg-primary/90"
                onClick={handlePrint}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border/80"
                onClick={handleDownloadMarkdown}
              >
                <FileDown className="h-4 w-4 text-primary-foreground/90" />
                Export Markdown (.md)
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Workspace */}
      <div
        ref={containerRef}
        style={{ "--split-percent": `${splitPercent}%` } as React.CSSProperties}
        className={cn(
          "workspace flex min-h-0 flex-1",
          viewMode === "split" ? "split-mode flex-col md:flex-row" : "flex-col"
        )}
      >
        {/* Editor Pane */}
        {showEditor && (
          <div
            className={cn(
              "no-print relative flex flex-col bg-[#191D1F]",
              viewMode === "split"
                ? "split-editor h-[45vh] w-full border-b border-toolbar-border md:h-full md:border-b-0"
                : "h-full w-full"
            )}
          >
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              placeholder="এখানে আপনার মার্কডাউন লিখুন অথবা ওপরের 'Open' বাটন থেকে ফাইল খুলুন..."
              className={cn(
                "flex-1 rounded-none border-none p-5 font-mono text-sm leading-7 text-[#DCE3DE] placeholder:text-[#4A5450] focus-visible:ring-0",
                viewMode === "editor" && !wide && "mx-auto max-w-3xl"
              )}
            />

            {/* Empty state quick-actions when editor has no content */}
            {!markdown && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className="pointer-events-auto flex max-w-sm flex-col items-center rounded-xl border border-toolbar-border bg-toolbar/95 p-6 text-center shadow-2xl backdrop-blur-md">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20 shadow-inner">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-toolbar-foreground">
                    এডিটর ফাঁকা রয়েছে (Blank Editor)
                  </h3>
                  <p className="mt-1.5 text-xs text-toolbar-muted leading-relaxed">
                    আপনার ডিভাইসের নিজস্ব কোনো <span className="text-primary font-mono font-semibold">.md</span> ফাইল খুলুন অথবা সম্পূর্ণ ফিচারযুক্ত ডেমো টেমপ্লেট লোড করুন।
                  </p>
                  <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleOpenMarkdownFile}
                      className="flex-1 gap-1.5 border-toolbar-border bg-toolbar-2 text-xs hover:bg-toolbar-border text-toolbar-foreground"
                    >
                      <Upload className="h-3.5 w-3.5 text-sky-400" />
                      <span>ফাইল খুলুন (.md)</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleLoadSampleMarkdown}
                      className="flex-1 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>নমুনা ডেমো লোড</span>
                    </Button>
                  </div>
                  <span className="mt-3 text-[11px] text-toolbar-muted/60">
                    অথবা সরাসরি এখানে টাইপ করা শুরু করুন
                  </span>
                </div>
              </div>
            )}
            {/* Editor Bottom Status Bar */}
            <div className="no-print flex h-10 items-center justify-between border-t border-toolbar-border bg-toolbar px-4 py-2 text-[11px] uppercase tracking-wide text-toolbar-muted select-none">
              <span className="flex items-center gap-1.5 font-medium text-toolbar-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" /> Markdown Editor
              </span>
              <div className="flex items-center gap-3">
                <span className="normal-case tracking-normal text-toolbar-muted/70">
                  {wordCount} words
                </span>
                <button
                  type="button"
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/80 hover:bg-toolbar-border hover:text-toolbar-foreground transition"
                  title="Export raw Markdown file"
                >
                  <FileDown className="h-3 w-3" />
                  Save .md
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resizable Divider between Editor and Preview */}
        {viewMode === "split" && (
          <div
            className={cn(
              "no-print group relative hidden md:flex w-5 -mx-[10px] z-30 select-none items-center justify-center transition-colors",
              isDragging ? "bg-primary/20 cursor-col-resize" : "hover:bg-primary/10"
            )}
          >
            {/* Center line */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onTouchStart={() => setIsDragging(true)}
              onDoubleClick={() => setSplitPercent(50)}
              className={cn(
                "h-full w-[2px] cursor-col-resize transition-colors",
                isDragging
                  ? "bg-primary shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                  : "bg-toolbar-border group-hover:bg-primary/70"
              )}
            />

            {/* Interactive Control Pill on the Divider */}
            <div
              className={cn(
                "absolute flex items-center rounded-full border border-toolbar-border bg-toolbar p-0.5 text-toolbar-muted shadow-xl transition-all duration-150 group-hover:scale-105 group-hover:border-primary/60",
                isDragging && "scale-105 border-primary bg-primary text-primary-foreground shadow-lg"
              )}
            >
              {/* Hide Editor (Show full Preview) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("preview");
                }}
                className="flex h-7 w-6 items-center justify-center rounded-l-full hover:bg-toolbar-2 hover:text-toolbar-foreground active:scale-95 transition"
                title="Hide editor (Preview only)"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {/* Drag Handle */}
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onTouchStart={() => setIsDragging(true)}
                onDoubleClick={() => setSplitPercent(50)}
                className="flex h-7 w-5 cursor-col-resize items-center justify-center px-0.5 hover:text-primary transition"
                title="Drag to resize panes (Double click for 50-50)"
              >
                <GripVertical className="h-3.5 w-3.5" />
              </div>

              {/* Hide Preview (Show full Editor) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode("editor");
                }}
                className="flex h-7 w-6 items-center justify-center rounded-r-full hover:bg-toolbar-2 hover:text-toolbar-foreground active:scale-95 transition"
                title="Hide preview (Editor only)"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Edge Dock when Preview is hidden (Editor Only Mode) */}
        {viewMode === "editor" && (
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className="no-print group fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 rounded-l-lg border border-r-0 border-toolbar-border bg-toolbar py-3 px-1.5 text-toolbar-muted shadow-2xl hover:bg-toolbar-2 hover:text-primary hover:border-primary/50 transition-all"
            title="Unhide preview (Restore split view)"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-medium tracking-wider text-toolbar-foreground/80 group-hover:text-primary">
              Show Preview
            </span>
          </button>
        )}

        {/* Edge Dock when Editor is hidden (Preview Only Mode) */}
        {viewMode === "preview" && (
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className="no-print group fixed left-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 rounded-r-lg border border-l-0 border-toolbar-border bg-toolbar py-3 px-1.5 text-toolbar-muted shadow-2xl hover:bg-toolbar-2 hover:text-primary hover:border-primary/50 transition-all"
            title="Unhide editor (Restore split view)"
          >
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-medium tracking-wider text-toolbar-foreground/80 group-hover:text-primary">
              Show Editor
            </span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Preview Pane */}
        {showPreview && (
          <div
            className={cn(
              "flex flex-col flex-1 min-h-0 bg-canvas overflow-hidden",
              viewMode === "split" ? "split-preview" : "w-full"
            )}
          >
            {/* Scrollable Preview Area */}
            <div
              className={cn(
                "preview-pane flex-1 overflow-y-auto px-3 py-5",
                viewMode === "split" ? "md:px-8 md:py-10" : "px-4 py-10 md:px-10"
              )}
            >
              <div className="flex justify-center">
                <div
                  ref={pageRef}
                  id="printable-page"
                  className={cn(
                    `preset-${preset}`,
                    "min-h-[297mm] min-w-0 bg-paper px-[18mm] py-[20mm] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_12px_32px_rgba(0,0,0,0.14)]",
                    wide ? "w-full max-w-[960px]" : "w-[min(210mm,100%)]",
                    pageSize === "letter" && "!min-h-[279mm]",
                    pageSize === "letter" && !wide && "!w-[min(216mm,100%)]"
                  )}
                >
                  {html ? (
                    <div
                      ref={previewRef}
                      className="markdown-preview"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-28 text-center select-none text-toolbar-muted">
                      <div className="h-12 w-12 rounded-full bg-toolbar-2 flex items-center justify-center text-toolbar-muted/70 mb-3 border border-toolbar-border">
                        <FileText className="h-6 w-6 stroke-[1.5]" />
                      </div>
                      <p className="text-sm font-semibold text-toolbar-foreground/80">ফাঁকা পাতা (Blank Page)</p>
                      <p className="mt-1.5 max-w-xs text-xs text-toolbar-muted leading-relaxed">
                        এডিটরে লিখলে অথবা ফাইল বা ডেমো ওপেন করলে এখানে রিয়েল-টাইম প্রিন্ট প্রিভিউ দেখা যাবে।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Bottom Status Bar */}
            <div className="no-print flex h-10 items-center justify-between border-t border-toolbar-border bg-toolbar px-4 py-2 text-[11px] uppercase tracking-wide text-toolbar-muted select-none">
              <span className="flex items-center gap-1.5 font-medium text-toolbar-foreground">
                <Eye className="h-3.5 w-3.5 text-primary" /> Live Document Preview
              </span>
              <div className="flex items-center gap-2">
                {/* Page Size Badge */}
                <span className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/90 border border-toolbar-border">
                  <span className="font-semibold text-primary">{pageSize.toUpperCase()}</span>
                  <span className="text-toolbar-muted">
                    ({pageSize === "a4" ? "210×297 mm" : "8.5×11 in"})
                  </span>
                </span>

                {/* Page Count Badge */}
                <span
                  className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/90 border border-toolbar-border"
                  title="Estimated pages when printed or exported to PDF"
                >
                  <Files className="h-3 w-3 text-emerald-400" />
                  <span>
                    Estimated <strong className="text-emerald-300 font-semibold">{estimatedPages}</strong> {estimatedPages === 1 ? "page" : "pages"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
