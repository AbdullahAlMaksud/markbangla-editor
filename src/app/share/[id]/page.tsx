import { Metadata } from "next";
import { getSharedDocument } from "@/lib/db";
import ShareScreen from "@/screens/share-screen";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doc = await getSharedDocument(id);

  if (!doc) {
    return {
      title: "Document Not Found | MarkBangla",
      description: "The requested shared document could not be found.",
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
    plainExcerpt || "Markdown document created and shared with MarkBangla.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "MarkBangla",
      url: `/share/${id}`,
      locale: "en_US",
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
  const { id } = await params;
  const doc = await getSharedDocument(id);

  return <ShareScreen initialDoc={doc} id={id} />;
}
