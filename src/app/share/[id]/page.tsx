import { Metadata } from "next";
import { getSharedDocument } from "@/lib/db";
import ShareViewer from "./share-viewer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  const doc = await getSharedDocument(id);

  if (!doc) {
    return {
      title: "ডকুমেন্ট পাওয়া যায়নি | MarkBangla",
      description: "শেয়ারকৃত ডকুমেন্টটি খুঁজে পাওয়া যায়নি।",
    };
  }

  const plainExcerpt = doc.markdown
    .replace(/^#+\s+/gm, "")
    .replace(/[`*_[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const title = `${doc.title} — MarkBangla`;
  const description =
    plainExcerpt || "MarkBangla দিয়ে তৈরি ও শেয়ারকৃত বাংলা/ইংরেজি মার্কডাউন ডকুমেন্ট।";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "MarkBangla",
      url: `/share/${id}`,
      locale: "bn_BD",
      images: [
        {
          url: "/images/logo.png",
          width: 630,
          height: 630,
          alt: doc.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/logo.png"],
    },
  };
}

export default async function SharedDocumentPage({ params }: PageProps) {
  const { id } = params;
  const doc = await getSharedDocument(id);

  return <ShareViewer initialDoc={doc} id={id} />;
}
