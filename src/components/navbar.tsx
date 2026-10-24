"use client";

import React from "react";
import Image from "next/image";
import {
  ChevronDown,
  Download,
  FileDown,
  FileEdit,
  FilePlus,
  FolderOpen,
  HardDrive,
  Maximize2,
  Minimize2,
  MoreVertical,
  Share2,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ViewMode = "editor" | "split" | "preview";

interface NavbarProps {
  documentTitle: string;
  wordCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  wide: boolean;
  onToggleWide: () => void;
  onOpenShareModal: () => void;
  onDownloadPdf: () => void;
  onDownloadMarkdown: () => void;
  onOpenSettings: () => void;
  onOpenMarkdownFile: () => void;
  onLoadSampleMarkdown: () => void;
  onNewBlankDocument: () => void;
}

export function Navbar({
  documentTitle,
  wordCount,
  viewMode,
  onViewModeChange,
  wide,
  onToggleWide,
  onOpenShareModal,
  onDownloadPdf,
  onDownloadMarkdown,
  onOpenSettings,
  onOpenMarkdownFile,
  onLoadSampleMarkdown,
  onNewBlankDocument,
}: NavbarProps) {
  return (
    <header className="no-print relative sticky top-0 z-40 flex h-14 w-full select-none items-center justify-between border-b border-toolbar-border bg-toolbar/95 px-3 backdrop-blur md:px-5">
      {/* Left side: Brand Logo, Title & Local Storage Badge */}
      <div className="flex items-center gap-2.5 z-10">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="MarkBangla Logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md object-contain shadow-sm"
            priority
          />
         <div className="flex flex-col">
           <span className="text-sm font-bold tracking-tight text-toolbar-foreground">
            MarkBangla
          </span>
          <span className="text-xs font-light tracking-tight text-toolbar-foreground">
            মার্কডাউন বাংলা
          </span>
         </div>
        </div>
      </div>

      {/* Center: View Switchers & Mode Toggles (Centered via Absolute Positioning) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center rounded-lg border border-toolbar-border bg-toolbar-2 p-0.5 shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange("editor")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              viewMode === "editor"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-toolbar-muted hover:text-toolbar-foreground"
            )}
            title="Editor view only"
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("split")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              viewMode === "split"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-toolbar-muted hover:text-toolbar-foreground"
            )}
            title="Split view (side-by-side)"
          >
            <span className="hidden sm:inline">Split</span>
            <span className="sm:hidden">Both</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              viewMode === "preview"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-toolbar-muted hover:text-toolbar-foreground"
            )}
            title="Preview only"
          >
            <span className="hidden sm:inline">Preview</span>
            <span className="sm:hidden">View</span>
          </button>
        </div>

        {/* Wide Toggle */}
        <button
          type="button"
          onClick={onToggleWide}
          className={cn(
            "hidden lg:flex items-center gap-1 rounded-lg border border-toolbar-border px-2.5 py-1 text-xs font-medium transition-colors",
            wide
              ? "bg-toolbar-2 text-primary border-primary/40"
              : "bg-toolbar-2 text-toolbar-muted hover:text-toolbar-foreground"
          )}
          title={wide ? "Disable Wide Mode" : "Enable Wide Mode"}
        >
          {wide ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" /> Wide On
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" /> Wide Off
            </>
          )}
        </button>
      </div>

      {/* Right side: Dropdown Download, Share button, Three-dot Settings button */}
      <div className="flex items-center gap-2 z-10">
        <span className="text-[11px] text-toolbar-muted/70 hidden lg:inline mr-1">
          {wordCount} words
        </span>

        {/* 1. Open Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border text-xs h-8 px-2.5 transition-colors group"
              title="Open Markdown file or load template"
            >
              <FolderOpen className="h-3.5 w-3.5 text-toolbar-muted group-hover:text-toolbar-foreground" />
              <span className="hidden sm:inline">Open</span>
              <ChevronDown className="h-3 w-3 text-toolbar-muted transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 p-1.5">
            <DropdownMenuItem
              onClick={onOpenMarkdownFile}
              className="gap-2.5 py-2 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-500/15 text-sky-400 border border-sky-500/20 shrink-0">
                <Upload className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Open .md File</span>
                <span className="text-[10px] text-toolbar-muted">
                  নিজের ডিভাইস থেকে .md ফাইল খুলুন
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onLoadSampleMarkdown}
              className="gap-2.5 py-2 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Load Sample / Demo</span>
                <span className="text-[10px] text-toolbar-muted">
                  বাংলা, ইংরেজি, ফ্লোচার্ট ও টেবিল ডেমো
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onNewBlankDocument}
              className="gap-2.5 py-2 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
                <FilePlus className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">New Blank Document</span>
                <span className="text-[10px] text-toolbar-muted">
                  নতুন ফাঁকা পাতা শুরু করুন
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Dropdown Download Button using Radix UI DropdownMenu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border text-xs h-8 px-2.5 transition-colors group"
              title="Choose download format"
            >
              <Download className="h-3.5 w-3.5 text-toolbar-muted group-hover:text-toolbar-foreground" />
              <span className="hidden sm:inline">Download</span>
              <ChevronDown className="h-3 w-3 text-toolbar-muted transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <DropdownMenuItem
              onClick={onDownloadPdf}
              className="gap-2.5 py-2 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary border border-primary/20 shrink-0">
                <Download className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Download PDF</span>
                <span className="text-[10px] text-toolbar-muted">
                  Formatted vector PDF (A4 / Letter)
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={onDownloadMarkdown}
              className="gap-2.5 py-2 cursor-pointer"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shrink-0">
                <FileDown className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Export Markdown</span>
                <span className="text-[10px] text-toolbar-muted">
                  Raw .md text document
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 2. Share Icon Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenShareModal}
          className="h-8 w-8 p-0 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border hover:text-primary transition-colors"
          title="Share document online"
          aria-label="Share document online"
        >
          <Share2 className="h-3.5 w-3.5" />
        </Button>

        {/* 3. Three-dot button to open Settings & Styles Sheet */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="h-8 w-8 p-0 border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border hover:text-primary transition-colors"
          title="Document Style & Settings"
          aria-label="Open style and settings sheet"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
