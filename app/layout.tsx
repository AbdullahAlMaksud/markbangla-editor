import type { Metadata } from "next";
import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "লেখা → পিডিএফ | Markdown to PDF",
  description:
    "Write Markdown in Bangla and English, style it, upload your own fonts, and export a clean PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Tiro+Bangla&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-ui">{children}</body>
    </html>
  );
}
