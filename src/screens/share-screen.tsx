"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  Download,
  Edit3,
  FileDown,
  Loader2,
  Share2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SharedDocument } from "@/lib/db";

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

interface ShareScreenProps {
  initialDoc: SharedDocument | null;
  id: string;
}

export default function ShareScreen({ initialDoc, id }: ShareScreenProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(!initialDoc);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<SharedDocument | null>(initialDoc);
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Client-side fallback fetch if not provided via SSR
  useEffect(() => {
    if (doc) return;
    let isCancelled = false;

    async function fetchDoc() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/share/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Document not found. Please verify the URL.");
          }
          throw new Error("Failed to load document from server.");
        }
        const data = await res.json();
        if (!isCancelled && data.document) {
          setDoc(data.document);
        }
      } catch (err: any) {
        if (!isCancelled) setError(err.message || "Failed to load document");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchDoc();
    return () => {
      isCancelled = true;
    };
  }, [id, doc]);

  // Render markdown -> sanitized HTML
  useEffect(() => {
    if (!doc?.markdown) return;
    let cancelled = false;
    (async () => {
      const DOMPurify = (await import("dompurify")).default;
      const raw = marked.parse(doc.markdown) as string;
      const clean = DOMPurify.sanitize(raw, { ADD_TAGS: ["div"], ADD_ATTR: ["class"] });
      if (!cancelled) setHtml(clean);
    })();
    return () => {
      cancelled = true;
    };
  }, [doc?.markdown]);

  // Highlight & Mermaid render
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
            console.error("Highlight error:", err);
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
          console.error("Mermaid error:", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  // Sync print page size
  useEffect(() => {
    if (!doc?.pageSize) return;
    let styleEl = document.getElementById("page-size-style") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "page-size-style";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `@page { size: ${
      doc.pageSize === "a4" ? "A4" : "letter"
    }; margin: 20mm 18mm; }`;
  }, [doc?.pageSize]);

  // Open in editor
  function handleOpenInEditor() {
    if (!doc) return;
    try {
      localStorage.setItem(
        "imported_shared_doc",
        JSON.stringify({
          markdown: doc.markdown,
          preset: doc.preset,
          fontChoice: doc.fontChoice,
          fontSize: doc.fontSize,
          pageSize: doc.pageSize,
          wide: doc.wide,
          viewMode: "editor",
        })
      );
    } catch (e) {
      console.warn("localStorage error:", e);
    }
    router.push("/");
  }

  // Copy share link
  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Download markdown
  function handleDownloadMarkdown() {
    if (!doc) return;
    const filename = doc.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 60) || "document";
    const blob = new Blob([doc.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Print PDF
  function handlePrint() {
    if (!doc) return;
    const originalTitle = document.title;
    document.title = doc.title || "document";
    const restoreTitle = () => {
      document.title = originalTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };
    window.addEventListener("afterprint", restoreTitle);
    window.print();
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-canvas text-toolbar-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-toolbar-muted">Loading shared document...</p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-5 bg-canvas px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-toolbar-2 text-rose-400 border border-toolbar-border shadow-lg">
          <Share2 className="h-8 w-8" />
        </div>
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-toolbar-foreground">Document Not Found</h2>
          <p className="mt-2 text-sm text-toolbar-muted">
            {error || "The shared document could not be found or the link may have expired."}
          </p>
        </div>
        <Button asChild className="gap-2 bg-primary hover:bg-primary/90">
          <Link
            href="/"
            onClick={() => {
              try {
                localStorage.removeItem("imported_shared_doc");
              } catch (e) {}
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Editor
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas print:bg-white print:h-auto print:overflow-visible">
      {/* Top Navbar */}
      <header className="no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-toolbar-border bg-toolbar/95 px-4 backdrop-blur md:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1.5 text-toolbar-muted hover:text-toolbar-foreground"
          >
            <Link
              href="/"
              onClick={() => {
                try {
                  localStorage.removeItem("imported_shared_doc");
                } catch (e) {}
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">MarkBangla Editor</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-toolbar-border hidden sm:block" />
          <h1 className="max-w-[180px] sm:max-w-md truncate text-sm font-semibold text-toolbar-foreground">
            {doc.title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5 border-toolbar-border bg-toolbar-2 text-xs text-toolbar-foreground hover:bg-toolbar-border"
            title="Copy shareable link"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden md:inline">{copied ? "Copied!" : "Copy Link"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadMarkdown}
            className="gap-1.5 border-toolbar-border bg-toolbar-2 text-xs text-toolbar-foreground hover:bg-toolbar-border hidden sm:flex"
            title="Download Markdown (.md)"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Save .md</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 border-toolbar-border bg-toolbar-2 text-xs text-toolbar-foreground hover:bg-toolbar-border hidden sm:flex"
            title="Download PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">PDF</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenInEditor}
            className="gap-1.5 bg-primary text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-md"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Open in Editor</span>
          </Button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 overflow-y-auto px-3 py-6 md:px-8 md:py-10">
        <div className="flex justify-center">
          <div
            ref={pageRef}
            id="printable-page"
            className={cn(
              `preset-${doc.preset || "classic"}`,
              "min-h-[297mm] min-w-0 bg-paper px-[18mm] py-[20mm] shadow-[0_1px_3px_rgba(0,0,0,0.12),0_12px_32px_rgba(0,0,0,0.14)]",
              doc.wide ? "w-full max-w-[960px]" : "w-[min(210mm,100%)]",
              doc.pageSize === "letter" && "!min-h-[279mm]",
              doc.pageSize === "letter" && !doc.wide && "!w-[min(216mm,100%)]"
            )}
          >
            <div
              ref={previewRef}
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
