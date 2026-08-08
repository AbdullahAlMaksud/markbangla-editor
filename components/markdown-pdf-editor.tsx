"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { marked } from "marked";
import {
  Download,
  FileText,
  Menu,
  Minus,
  MonitorSmartphone,
  Plus,
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

এটি একটি **বাংলা ও ইংরেজি** মিশ্রিত মার্কডাউন এডিটর। বাঁপাশের ফ্লোটিং বাটনে চাপ দিলে স্টাইল, ফন্ট আর ডাউনলোড অপশন পাবেন।

This editor supports **mixed Bangla and English** text seamlessly, plus rendered diagrams. Tap the floating button on the left for style, font, and export options.

## বৈশিষ্ট্য / Features

- লাইভ প্রিভিউ, GFM টেবিল, টাস্ক-লিস্ট, ব্লককোট
- \`mermaid\` কোডব্লক থেকে আসল ফ্লোচার্ট রেন্ডার
- নিজের ফন্ট আপলোড করার সুবিধা
- এডিটর / প্রিভিউ / উভয় — ভিউ মোড আর ওয়াইড টগল

### টাস্ক লিস্ট

- [x] মার্কডাউন এডিটর
- [x] মারমেইড ডায়াগ্রাম
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

type Preset = "classic" | "modern" | "boi";
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

  const pageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(
    () => (markdown.trim().match(/\S+/g) || []).length,
    [markdown]
  );

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

  // Keep the printed page's physical size AND margins in sync with the
  // selected size. Crucially, this margin lives on @page (not on the page
  // div's own padding): a box's padding-top/bottom only ever applies to the
  // very first/last printed page it spans, so on a multi-page document every
  // page after the first would start flush at the top with no margin. @page
  // margin, by contrast, is a paper margin the browser re-applies to every
  // physical page.
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

  function handlePrint() {
    // Native browser print pipeline instead of rasterizing to an image: keeps
    // real, selectable vector text, stays small, and lets the browser's own
    // shaping engine handle Bangla conjuncts/reordering correctly.
    const originalTitle = document.title;
    const firstHeadingMatch = markdown.match(/^#{1,6}\s+(.+)$/m);
    let filename = firstHeadingMatch ? firstHeadingMatch[1].trim() : "document";
    filename = filename.replace(/[\\/:*?"<>|]/g, "").slice(0, 60) || "document";
    document.title = filename;

    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);

    window.print();
  }

  const showEditor = viewMode === "editor" || viewMode === "split";
  const showPreview = viewMode === "preview" || viewMode === "split";

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-canvas print:h-auto print:overflow-visible">
      {/* Floating menu button + sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="no-print fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-toolbar text-toolbar-foreground shadow-lg ring-1 ring-toolbar-border transition hover:bg-toolbar-2"
            title="মেনু খুলুন"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="no-print overflow-y-auto">
          <SheetHeader>
            <SheetTitle>লেখা → পিডিএফ</SheetTitle>
            <SheetDescription>
              Markdown editor &amp; PDF exporter — বাংলা ও ইংরেজি
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 px-5 pb-6">
            {/* View mode */}
            <div className="flex flex-col gap-2">
              <Label>ভিউ</Label>
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
                        ? "bg-primary text-primary-foreground"
                        : "text-toolbar-muted hover:text-toolbar-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <Button
                variant={wide ? "default" : "outline"}
                size="sm"
                className="mt-1 w-full justify-start gap-2"
                onClick={() => setWide((w) => !w)}
              >
                <MonitorSmartphone className="h-3.5 w-3.5" />
                ওয়াইড মোড {wide ? "চালু" : "বন্ধ"}
              </Button>
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
                  <SelectItem value="classic">ক্লাসিক (Classic)</SelectItem>
                  <SelectItem value="modern">আধুনিক (Modern)</SelectItem>
                  <SelectItem value="boi">বই (Book)</SelectItem>
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

            <Button
              className="w-full gap-2"
              onClick={handlePrint}
              title="প্রিন্ট ডায়ালগে Destination হিসেবে 'Save as PDF' বেছে নিন"
            >
              <Download className="h-4 w-4" />
              PDF ডাউনলোড
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Workspace */}
      <div
        className={cn(
          "workspace flex min-h-0 flex-1",
          viewMode === "split" ? "flex-col md:flex-row" : "flex-col"
        )}
      >
        {showEditor && (
          <div
            className={cn(
              "no-print flex flex-col bg-[#191D1F]",
              viewMode === "split"
                ? "h-[38vh] w-full border-b border-toolbar-border md:h-auto md:w-[42%] md:min-w-[320px] md:border-b-0 md:border-r"
                : "h-full w-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-toolbar-border px-4 py-2 pl-16 text-[11px] uppercase tracking-wide text-toolbar-muted">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Markdown
              </span>
              <span className="normal-case tracking-normal text-toolbar-muted/70">
                {wordCount} শব্দ
              </span>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              placeholder="এখানে মার্কডাউন লিখুন..."
              className={cn(
                "flex-1 rounded-none border-none p-5 font-mono text-sm leading-7 text-[#DCE3DE] placeholder:text-[#4A5450]",
                viewMode === "editor" && !wide && "mx-auto max-w-3xl"
              )}
            />
          </div>
        )}

        {showPreview && (
          <div
            className={cn(
              "preview-pane flex-1 overflow-y-auto px-3 py-5",
              viewMode === "split" ? "md:px-8 md:py-10" : "px-4 py-10 md:px-10",
              !showEditor && "pl-16"
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
        )}
      </div>
    </div>
  );
}
