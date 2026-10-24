"use client";

import { useState } from "react";
import {
  Check,
  CloudUpload,
  Copy,
  ExternalLink,
  HardDrive,
  Info,
  Loader2,
  Lock,
  Share2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  onGenerateLink: () => Promise<void>;
  shareUrl: string | null;
  onResetShareUrl: () => void;
  loading: boolean;
  error: string | null;
}

export function ShareModal({
  open,
  onOpenChange,
  documentTitle,
  onGenerateLink,
  shareUrl,
  onResetShareUrl,
  loading,
  error,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/20">
              <Share2 className="h-4 w-4" />
            </div>
            <DialogTitle>Share Document Online</DialogTitle>
          </div>
          <DialogDescription>
            Create a public URL to share &ldquo;{documentTitle}&rdquo; with anyone.
          </DialogDescription>
        </DialogHeader>

        {/* Data Privacy & Storage Notice */}
        <div className="rounded-xl border border-toolbar-border bg-toolbar-2 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Data Storage &amp; Privacy Notice</span>
          </div>

          <div className="grid gap-2.5 text-xs text-toolbar-muted leading-relaxed">
            {/* Local Computer Storage */}
            <div className="flex items-start gap-2.5 rounded-lg border border-toolbar-border/60 bg-toolbar/60 p-2.5">
              <HardDrive className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-toolbar-foreground font-medium block">
                  Private on Your Computer by Default
                </strong>
                <span>
                  All your writing, documents, and edits remain strictly stored on
                  your local computer and browser. We never track or store your
                  private writing.
                </span>
              </div>
            </div>

            {/* Server Upload on Sharing */}
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-200/90">
              <CloudUpload className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-medium block">
                  Cloud Upload Upon Sharing
                </strong>
                <span>
                  When you generate a public share link, this document&rsquo;s title,
                  markdown text, and visual styling will be uploaded to our server
                  so anyone with the link can view it.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Link Output or Action Area */}
        {!shareUrl ? (
          <div className="space-y-3 pt-1">
            {error && (
              <div className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
                {error}
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="border-toolbar-border bg-toolbar-2 text-toolbar-foreground hover:bg-toolbar-border text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onGenerateLink}
                disabled={loading}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading &amp; Generating Link...
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" />
                    Upload &amp; Generate Link
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                Public Link Ready
              </span>
              <button
                type="button"
                onClick={onResetShareUrl}
                className="text-[11px] text-toolbar-muted hover:text-toolbar-foreground underline"
              >
                Generate New Link
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="flex-1 rounded-lg border border-toolbar-border bg-toolbar-2 px-3 py-2 text-xs text-toolbar-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary select-all"
              />
              <Button
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 bg-primary text-xs text-primary-foreground hover:bg-primary/90 shrink-0 h-9"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Link
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-toolbar-muted flex items-center gap-1">
                <Lock className="h-3 w-3 text-toolbar-muted" /> Anyone with this URL can view this snapshot.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="gap-1.5 border-toolbar-border bg-toolbar-2 text-xs text-toolbar-foreground hover:bg-toolbar-border h-8"
                >
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open
                  </a>
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-toolbar-border text-toolbar-foreground hover:bg-toolbar-border/80 text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
