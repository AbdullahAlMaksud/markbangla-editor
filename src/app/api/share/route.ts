import { NextRequest, NextResponse } from "next/server";
import { saveSharedDocument } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { markdown, title, preset, fontChoice, fontSize, pageSize, wide } = body;

    if (!markdown || typeof markdown !== "string") {
      return NextResponse.json(
        { error: "Markdown content is required" },
        { status: 400 }
      );
    }

    // Derive title from first markdown heading if not provided
    let docTitle = title;
    if (!docTitle) {
      const match = markdown.match(/^#{1,6}\s+(.+)$/m);
      docTitle = match ? match[1].trim() : "Document";
    }

    const doc = await saveSharedDocument({
      markdown,
      title: docTitle,
      preset: preset || "classic",
      fontChoice: fontChoice || "default",
      fontSize: typeof fontSize === "number" ? fontSize : 16,
      pageSize: pageSize || "a4",
      wide: !!wide,
    });

    // Construct full share URL
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
    const shareUrl = `${baseUrl.replace(/\/$/, "")}/share/${doc.id}`;

    return NextResponse.json({
      success: true,
      id: doc.id,
      shareUrl,
      title: doc.title,
      createdAt: doc.createdAt,
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    );
  }
}
