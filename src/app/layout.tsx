import type { Metadata } from "next";
import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://markbangla.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MarkBangla — Modern Markdown Editor & PDF Exporter",
    template: "%s | MarkBangla",
  },
  description:
    "MarkBangla is a modern Markdown editor and PDF exporter with real-time preview, Mermaid charts, custom typography themes, and instant cloud sharing.",
  applicationName: "MarkBangla",
  authors: [{ name: "Abdullah Al Maksud" }],
  generator: "Next.js",
  keywords: [
    "MarkBangla",
    "Markdown Editor",
    "Markdown to PDF",
    "PDF Exporter",
    "Mermaid Diagrams",
    "Typography",
    "Open Source Markdown",
    "Live Preview",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "MarkBangla",
    title: "MarkBangla — Modern Markdown Editor & PDF Exporter",
    description:
      "Online Markdown editor with live preview, Mermaid diagrams, bespoke themes, and vector PDF export.",
    images: [
      {
        url: "/images/logo.png",
        width: 630,
        height: 630,
        alt: "MarkBangla — Markdown Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkBangla — Modern Markdown Editor & PDF Exporter",
    description:
      "Online Markdown editor with live preview, Mermaid diagrams, themes, and vector PDF export.",
    images: ["/images/logo.png"],
    creator: "@markbangla",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-ui">{children}</body>
    </html>
  );
}
