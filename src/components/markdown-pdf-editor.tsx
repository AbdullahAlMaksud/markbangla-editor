"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { marked } from "marked";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  Files,
  FileText,
  GripVertical,
  Loader2,
  Menu,
  Minus,
  MonitorSmartphone,
  Plus,
  RotateCcw,
  Share2,
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
  SheetTrigger,
} from "@/components/ui/sheet";

const DEFAULT_MARKDOWN = `# স্বাগতম — Welcome

এটি একটি **বাংলা ও ইংরেজি** মিশ্রিত মার্কডাউন এডিটর। ডানপাশের ফ্লোটিং বাটনে চাপ দিলে স্টাইল, ফন্ট আর ডাউনলোড অপশন পাবেন।

This editor supports **mixed Bangla and English** text seamlessly, plus rendered diagrams. Tap the floating button on the right for style, font, and export options.

## বৈশিষ্ট্য / Features

- লাইভ প্রিভিউ, GFM টেবিল, টাস্ক-লিস্ট, ব্লককোট
- \`mermaid\` কোডব্লক থেকে আসল ফ্লোচার্ট রেন্ডার
- এডিটর ও প্রিভিউ রিসাইজ করার সুবিধা (মাঝখানের হ্যান্ডেল টেনে কমানো/বাড়ানো যায়)
- উইন্ডো হাইড/আনহাইড করার সুবিধা (হ্যান্ডেলের তীর বাটনে চাপ দিয়ে যেকোনো একটি প্যানেল লুকানো বা দেখানো যায়)
- নিজের ফন্ট আপলোড করার সুবিধা
- এডিটর / প্রিভিউ / উভয় — ভিউ মোড আর ওয়াইড টগল
- PDF ও Markdown (.md) ফরম্যাটে ডাউনলোড সুবিধা

### টাস্ক লিস্ট

- [x] মার্কডাউন এডিটর
- [x] মারমেইড ডায়াগ্রাম
- [x] রিসাইজেবল উইন্ডো
- [x] প্যানেল হাইড/আনহাইড
- [ ] আরও কিছু যোগ করুন

> "যদি তুমি বাংলায় স্বপ্ন দেখতে পারো, তবে বাংলায় লিখতেও পারবে।"

| ভাষা | সমর্থন |
|---|---|
| বাংলা | ✅ |
| English | ✅ |
| Diagrams | ✅ |

\`\`\`mermaid
flowchart TD
    A["ব্যবহারকারী পেজে আসে"] --> B{"বট নাকি মানুষ?"}
    B -- "বট" --> C["রিকোয়েস্ট বাদ দাও"]
    B -- "মানুষ" --> D["৩-৫ সেকেন্ড টাইমার শুরু"]
    D --> E["ভিউ কাউন্ট বাড়াও"]
\`\`\`

---

হ্যাপি রাইটিং! Happy writing.`;

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
type ViewMode = "editor" | "split" | "preview";

const PRESET_FONTS: Record<Preset, { heading: string; body: string }> = {
  classic: {
    heading: "'Tiro Bangla','Lora',serif",
    body: "'Hind Siliguri','Lora',serif",
  },
  modern: {
    heading: "'Inter','Hind Siliguri',sans-serif",
    body: "'Inter','Hind Siliguri',sans-serif",
  },
  boi: {
    heading: "'Tiro Bangla',serif",
    body: "'Noto Sans Bengali','Hind Siliguri',serif",
  },
  dark: {
    heading: "'Inter','Hind Siliguri',sans-serif",
    body: "'Inter','Hind Siliguri',sans-serif",
  },
  nordic: {
    heading: "'Inter','Hind Siliguri',sans-serif",
    body: "'Inter','Hind Siliguri',sans-serif",
  },
  rose: {
    heading: "'Tiro Bangla','Lora',serif",
    body: "'Hind Siliguri','Lora',serif",
  },
  academic: {
    heading: "'Tiro Bangla','Lora',serif",
    body: "'Hind Siliguri','Lora',serif",
  },
  cyber: {
    heading: "'JetBrains Mono','Inter','Hind Siliguri',sans-serif",
    body: "'JetBrains Mono','Inter','Hind Siliguri',monospace",
  },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Custom renderer: `mermaid` code fences become a placeholder <div class="mermaid">
// that we render into an actual SVG diagram client-side after paint. Everything
// else falls back to plain escaped <pre><code> (marked's own default behaviour).
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

export default function MarkdownPdfEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [html, setHtml] = useState("");
  const [preset, setPreset] = useState<Preset>("classic");
  const [fontChoice, setFontChoice] = useState("default");
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [wide, setWide] = useState(false);

  // Split resize state (initially 50%)
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [estimatedPages, setEstimatedPages] = useState(1);

  // Sharing states
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load imported document from localStorage if opened from /share/[id]
  useEffect(() => {
    try {
      const saved = localStorage.getItem("imported_shared_doc");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.markdown) setMarkdown(parsed.markdown);
        if (parsed.preset) setPreset(parsed.preset);
        if (parsed.fontChoice) setFontChoice(parsed.fontChoice);
        if (parsed.fontSize) setFontSize(parsed.fontSize);
        if (parsed.pageSize) setPageSize(parsed.pageSize);
        if (typeof parsed.wide === "boolean") setWide(parsed.wide);
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

  // Render markdown -> sanitized HTML (client-only, DOMPurify needs the DOM)
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

  // Turn every <div class="mermaid"> placeholder into a real rendered SVG diagram,
  // and apply syntax-highlight colors to ordinary fenced code blocks.
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
          fontFamily: "Hind Siliguri, Inter, sans-serif",
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

  // Keep the printed page's physical size AND margins in sync with the selected size.
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
          .replace(/[^a-zA-Z0-9\u0980-\u09FF _-]/g, "");
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

  function getDocumentBaseName(): string {
    const firstHeadingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
    let filename = firstHeadingMatch ? firstHeadingMatch[1].trim() : "document";
    filename = filename.replace(/[\\/:*?"<>|]/g, "").slice(0, 60) || "document";
    return filename;
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
        throw new Error("শেয়ার লিংক তৈরি করতে সমস্যা হয়েছে।");
      }

      const data = await res.json();
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
      }
    } catch (err: any) {
      setShareError(err.message || "Failed to create link");
    } finally {
      setSharing(false);
    }
  }

  function handleCopyShareLink() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
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
      {/* Floating menu button on TOP-RIGHT + sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="no-print fixed right-3 top-2 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-toolbar-2 text-toolbar-foreground shadow-md ring-1 ring-toolbar-border transition hover:bg-toolbar hover:scale-105 active:scale-95"
            title="মেনু ও সেটিংস খুলুন"
          >
            <Menu className="h-4 w-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="no-print overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-base font-bold text-toolbar-foreground">
              MarkBangla
            </SheetTitle>
            <SheetDescription>
              বাংলা ও ইংরেজি মার্কডাউন এডিটর, PDF ও ফাইল শেয়ারিং
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-5 pb-6">
            {/* View mode */}
            <div className="flex flex-col gap-2">
              <Label>ভিউ / View Mode</Label>
              <div className="flex rounded-md border border-toolbar-border bg-toolbar-2 p-1">
                {(
                  [
                    { key: "editor", label: "এডিটর" },
                    { key: "split", label: "উভয়" },
                    { key: "preview", label: "প্রিভিউ" },
                  ] as { key: ViewMode; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
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
                  ওয়াইড মোড {wide ? "চালু" : "বন্ধ"}
                </Button>
                {viewMode === "split" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 justify-start gap-1 text-xs"
                    onClick={() => setSplitPercent(50)}
                    title="উইন্ডো রিসেট (৫০-৫০)"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    ৫০-৫০
                  </Button>
                )}
              </div>
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Style preset */}
            <div className="flex flex-col gap-2">
              <Label>লেখার ধরন / Style</Label>
              <Select value={preset} onValueChange={(v) => setPreset(v as Preset)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">ক্লাসিক (Classic Serif)</SelectItem>
                  <SelectItem value="modern">আধুনিক (Modern Teal)</SelectItem>
                  <SelectItem value="boi">বই ও সাহিত্য (Book / Sepia)</SelectItem>
                  <SelectItem value="dark">ডার্ক অবসিডিয়ান (Dark Obsidian)</SelectItem>
                  <SelectItem value="nordic">মিনিমালিস্ট নর্ডিক (Minimalist Nordic)</SelectItem>
                  <SelectItem value="rose">গোলাপী ও কবিতা (Rose & Poetry)</SelectItem>
                  <SelectItem value="academic">একাডেমিক পেপার (Academic Paper)</SelectItem>
                  <SelectItem value="cyber">সাইবার গ্রিন (Cyber Terminal)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font */}
            <div className="flex flex-col gap-2">
              <Label>ফন্ট / Font</Label>
              <Select value={fontChoice} onValueChange={setFontChoice}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">স্টাইল অনুযায়ী (Default)</SelectItem>
                  <SelectGroup>
                    <SelectLabel>বাংলা</SelectLabel>
                    <SelectItem value="Hind Siliguri">Hind Siliguri</SelectItem>
                    <SelectItem value="Noto Sans Bengali">Noto Sans Bengali</SelectItem>
                    <SelectItem value="Tiro Bangla">Tiro Bangla</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>English</SelectLabel>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Lora">Lora</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                  </SelectGroup>
                  {customFonts.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>আপলোড করা ফন্ট</SelectLabel>
                      {customFonts.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                <label className="cursor-pointer">
                  <Upload className="h-3.5 w-3.5" />
                  নিজের ফন্ট আপলোড (.ttf/.otf/.woff)
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
                  যোগ হয়েছে: {customFonts.join(", ")}
                </span>
              )}
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Size + page */}
            <div className="flex flex-col gap-2">
              <Label>আকার / Font size</Label>
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

            <div className="flex flex-col gap-2">
              <Label>পেজ সাইজ / Page size</Label>
              <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Downloads / Export Section */}
            <div className="flex flex-col gap-2.5">
              <Label>ডাউনলোড ও এক্সপোর্ট</Label>
              <Button
                className="w-full gap-2 bg-primary font-medium hover:bg-primary/90"
                onClick={handlePrint}
                title="প্রিন্ট ডায়ালগে Destination হিসেবে 'Save as PDF' বেছে নিন"
              >
                <Download className="h-4 w-4" />
                PDF ডাউনলোড
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border/80"
                onClick={handleDownloadMarkdown}
                title="মার্কডাউন (.md) ফাইল হিসেবে সেভ করুন"
              >
                <FileDown className="h-4 w-4 text-primary-foreground/90" />
                Markdown (.md) ডাউনলোড
              </Button>
            </div>

            <div className="h-px bg-toolbar-border" />

            {/* Share Document Section */}
            <div className="flex flex-col gap-2.5">
              <Label>ডকুমেন্ট শেয়ারিং</Label>
              {!shareUrl ? (
                <Button
                  variant="outline"
                  className="w-full gap-2 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border/80"
                  onClick={handleCreateShareLink}
                  disabled={sharing}
                >
                  {sharing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      লিংক তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 text-emerald-400" />
                      শেয়ার লিংক তৈরি করুন
                    </>
                  )}
                </Button>
              ) : (
                <div className="flex flex-col gap-2 rounded-lg border border-toolbar-border bg-toolbar-2 p-3 shadow-inner">
                  <div className="flex items-center justify-between text-xs text-toolbar-muted">
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" /> লিংক প্রস্তুত!
                    </span>
                    <button
                      onClick={() => setShareUrl(null)}
                      className="text-[10px] text-toolbar-muted hover:text-toolbar-foreground underline"
                    >
                      নতুন লিংক
                    </button>
                  </div>
                  <input
                    readOnly
                    value={shareUrl}
                    className="w-full rounded border border-toolbar-border bg-toolbar px-2 py-1 text-xs text-toolbar-foreground font-mono focus:outline-none select-all"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <Button
                      size="sm"
                      onClick={handleCopyShareLink}
                      className="flex-1 gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90 h-8"
                    >
                      {shareCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          কপি হয়েছে!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          লিংক কপি
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="gap-1 border-toolbar-border bg-toolbar text-xs text-toolbar-foreground hover:bg-toolbar-border h-8 px-2.5"
                    >
                      <a href={shareUrl} target="_blank" rel="noopener noreferrer" title="নতুন ট্যাবে দেখুন">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              {shareError && (
                <span className="text-xs text-rose-400">{shareError}</span>
              )}
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
              "no-print flex flex-col bg-[#191D1F]",
              viewMode === "split"
                ? "split-editor h-[45vh] w-full border-b border-toolbar-border md:h-full md:border-b-0"
                : "h-full w-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-toolbar-border px-4 py-2 text-[11px] uppercase tracking-wide text-toolbar-muted">
              <span className="flex items-center gap-1.5 font-medium text-toolbar-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" /> MarkBangla Editor
              </span>
              <div className="flex items-center gap-3">
                <span className="normal-case tracking-normal text-toolbar-muted/70">
                  {wordCount} শব্দ
                </span>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/80 hover:bg-toolbar-border hover:text-toolbar-foreground transition"
                  title="মার্কডাউন (.md) ডাউনলোড"
                >
                  <FileDown className="h-3 w-3" />
                  .md সেভ
                </button>
              </div>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              placeholder="এখানে মার্কডাউন লিখুন..."
              className={cn(
                "flex-1 rounded-none border-none p-5 font-mono text-sm leading-7 text-[#DCE3DE] placeholder:text-[#4A5450] focus-visible:ring-0",
                viewMode === "editor" && !wide && "mx-auto max-w-3xl"
              )}
            />
          </div>
        )}

        {/* Resizable Divider / Handler between Editor and Preview */}
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
                title="এডিটর হাইড করুন (শুধু প্রিভিউ দেখুন)"
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
                title="মাউস টেনে সাইজ কমান/বাড়ান (ডাবল ক্লিক করলে ৫০-৫০)"
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
                title="প্রিভিউ হাইড করুন (শুধু এডিটর দেখুন)"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Edge Dock / Unhide Button when Preview is hidden (Editor Only Mode) */}
        {viewMode === "editor" && (
          <button
            onClick={() => setViewMode("split")}
            className="no-print group fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 rounded-l-lg border border-r-0 border-toolbar-border bg-toolbar py-3 px-1.5 text-toolbar-muted shadow-2xl hover:bg-toolbar-2 hover:text-primary hover:border-primary/50 transition-all"
            title="প্রিভিউ আনহাইড করুন (উভয় উইন্ডো দেখুন)"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-medium tracking-wider text-toolbar-foreground/80 group-hover:text-primary">
              প্রিভিউ খুলুন
            </span>
          </button>
        )}

        {/* Edge Dock / Unhide Button when Editor is hidden (Preview Only Mode) */}
        {viewMode === "preview" && (
          <button
            onClick={() => setViewMode("split")}
            className="no-print group fixed left-0 top-1/2 -translate-y-1/2 z-30 flex items-center gap-1 rounded-r-lg border border-l-0 border-toolbar-border bg-toolbar py-3 px-1.5 text-toolbar-muted shadow-2xl hover:bg-toolbar-2 hover:text-primary hover:border-primary/50 transition-all"
            title="এডিটর আনহাইড করুন (উভয় উইন্ডো দেখুন)"
          >
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-medium tracking-wider text-toolbar-foreground/80 group-hover:text-primary">
              এডিটর খুলুন
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
            {/* Preview Top Bar */}
            <div className="no-print flex h-10 items-center justify-between border-b border-toolbar-border bg-toolbar px-4 py-2 text-[11px] uppercase tracking-wide text-toolbar-muted">
              <span className="flex items-center gap-1.5 font-medium text-toolbar-foreground">
                <Eye className="h-3.5 w-3.5 text-primary" /> পেজ প্রিভিউ
              </span>
              <div className="flex items-center gap-2 pr-10">
                {/* Page Size Badge */}
                <span className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/90 border border-toolbar-border">
                  <span className="font-semibold text-primary">{pageSize.toUpperCase()}</span>
                  <span className="text-toolbar-muted">({pageSize === "a4" ? "210×297 mm" : "8.5×11 in"})</span>
                </span>

                {/* Page Count Badge */}
                <span
                  className="flex items-center gap-1 rounded bg-toolbar-2 px-2 py-0.5 text-[10px] normal-case text-toolbar-foreground/90 border border-toolbar-border"
                  title="প্রিন্ট বা PDF এ আনুমানিক পেজ সংখ্যা"
                >
                  <Files className="h-3 w-3 text-emerald-400" />
                  <span>আনুমানিক <strong className="text-emerald-300 font-semibold">{estimatedPages}</strong> পেজ</span>
                </span>
              </div>
            </div>

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
                  <div
                    ref={previewRef}
                    className="markdown-preview"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
