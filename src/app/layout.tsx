import type { Metadata } from "next";
import "highlight.js/styles/atom-one-dark.css";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://markbangla.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "MarkBangla — বাংলা ও ইংরেজি মার্কডাউন এডিটর এবং পিডিএফ এক্সপোর্টার",
    template: "%s | MarkBangla",
  },
  description:
    "MarkBangla একটি আধুনিক বাংলা ও ইংরেজি মার্কডাউন এডিটর। লাইভ প্রিভিউ, মারমেইড চার্ট, ৮টি থিম, ভেক্টর PDF ও Markdown এক্সপোর্ট এবং ক্লাউড শেয়ারিং সুবিধা।",
  applicationName: "MarkBangla",
  authors: [{ name: "Abdullah Al Maksud" }],
  generator: "Next.js",
  keywords: [
    "MarkBangla",
    "Markdown Editor",
    "Bangla Markdown",
    "বাংলা মার্কডাউন",
    "PDF Exporter",
    "Markdown to PDF",
    "Mermaid Diagram",
    "Bangla Typography",
    "Open Source Markdown",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: "MarkBangla",
    title: "MarkBangla — বাংলা ও ইংরেজি মার্কডাউন এডিটর এবং পিডিএফ এক্সপোর্টার",
    description:
      "অনলাইন বাংলা ও ইংরেজি মার্কডাউন এডিটর, লাইভ প্রিভিউ, মারমেইড ডায়াগ্রাম, ৮টি আকর্ষণীয় থিম ও ভেক্টর PDF এক্সপোর্ট।",
    images: [
      {
        url: "/images/logo.png",
        width: 630,
        height: 630,
        alt: "MarkBangla — বাংলা ও ইংরেজি মার্কডাউন এডিটর",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkBangla — বাংলা ও ইংরেজি মার্কডাউন এডিটর",
    description:
      "অনলাইন বাংলা ও ইংরেজি মার্কডাউন এডিটর, লাইভ প্রিভিউ, মারমেইড ডায়াগ্রাম, ৮টি থিম ও ভেক্টর PDF এক্সপোর্ট।",
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
    <html lang="bn">
      <body className="font-ui">{children}</body>
    </html>
  );
}
