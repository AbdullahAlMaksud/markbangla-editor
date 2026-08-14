import { MongoClient } from "mongodb";
import crypto from "crypto";
import dns from "dns";
import fs from "fs";
import path from "path";

// Fix Windows / local ISP DNS issues resolving MongoDB SRV records (querySrv ECONNREFUSED)
try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
} catch {
  // Ignore in restricted sandboxes
}

export interface SharedDocument {
  id: string;
  markdown: string;
  title: string;
  preset?: string;
  fontChoice?: string;
  fontSize?: number;
  pageSize?: string;
  wide?: boolean;
  views?: number;
  createdAt: string;
  updatedAt?: string;
}

// Generate URL-friendly short ID (e.g., "7xKp9L2Q")
function generateShortId(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}

// ==========================================
// 1. Lazy MongoDB Connection Handling
// ==========================================
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

async function getMongoClient(): Promise<MongoClient | null> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return null;

  try {
    dns.setDefaultResultOrder("ipv4first");
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1", "1.0.0.1"]);
  } catch {}

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        const client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        });
        global._mongoClientPromise = client.connect().then((c) => {
          console.log("✅ [MongoDB] Connected successfully to Atlas cluster!");
          return c;
        });
      }
      return await global._mongoClientPromise;
    } else {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      const connected = await client.connect();
      console.log("✅ [MongoDB] Connected successfully to Atlas cluster!");
      return connected;
    }
  } catch (err: any) {
    console.warn("⚠️ [MongoDB] Connection warning:", err?.message || err);
    return null;
  }
}

// ==========================================
// 2. GitHub Repository Storage Adapter
// ==========================================
function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  let repo = process.env.GITHUB_REPO?.trim();
  if (repo) {
    repo = repo.replace(/\.git$/, "");
  }
  return { token, repo };
}

async function saveToGitHub(doc: SharedDocument): Promise<boolean> {
  const { token, repo } = getGitHubConfig();
  if (!token || !repo) return false;

  try {
    const filePath = `data/shares/${doc.id}.json`;
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const contentBase64 = Buffer.from(JSON.stringify(doc, null, 2), "utf8").toString("base64");

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "MarkBangla-App",
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `chore(share): save shared document "${doc.title.slice(0, 40)}" [${doc.id}]`,
        content: contentBase64,
      }),
    });

    if (res.ok || res.status === 201 || res.status === 200) {
      console.log(`✅ [GitHub] Saved doc ${doc.id} to repo ${repo}`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`⚠️ [GitHub] Save failed with status ${res.status}:`, errText);
      return false;
    }
  } catch (err: any) {
    console.warn("⚠️ [GitHub] Error saving document to GitHub:", err?.message || err);
    return false;
  }
}

async function getFromGitHub(id: string): Promise<SharedDocument | null> {
  const { token, repo } = getGitHubConfig();
  if (!token || !repo) return null;

  try {
    const filePath = `data/shares/${id}.json`;
    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "MarkBangla-App",
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.content) {
      const decoded = Buffer.from(data.content, "base64").toString("utf8");
      const doc: SharedDocument = JSON.parse(decoded);
      return doc;
    }
  } catch (err: any) {
    console.warn("⚠️ [GitHub] Error fetching document from GitHub:", err?.message || err);
  }

  return null;
}

// ==========================================
// 3. Local Storage Fallback
// ==========================================
const inMemoryStore = new Map<string, SharedDocument>();
const FALLBACK_DIR = path.join(process.cwd(), ".data");
const FALLBACK_FILE = path.join(FALLBACK_DIR, "shared_documents.json");

function getLocalStore(): Map<string, SharedDocument> {
  try {
    if (inMemoryStore.size === 0 && fs.existsSync(FALLBACK_FILE)) {
      const data = JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf8"));
      for (const item of data) {
        inMemoryStore.set(item.id, item);
      }
    }
  } catch (err) {
    console.warn("Failed to read local fallback DB file:", err);
  }
  return inMemoryStore;
}

function persistLocalStore() {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    }
    const data = Array.from(inMemoryStore.values());
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Failed to write local fallback DB file:", err);
  }
}

// ==========================================
// Public Database Operations (Multi-Storage)
// ==========================================

export async function saveSharedDocument(
  input: Omit<SharedDocument, "id" | "createdAt" | "views">
): Promise<SharedDocument> {
  const id = generateShortId(8);
  const now = new Date().toISOString();
  const dbName = process.env.MONGODB_DB || "markdown_app";

  const doc: SharedDocument = {
    id,
    markdown: input.markdown,
    title: input.title || "Untitled Document",
    preset: input.preset || "classic",
    fontChoice: input.fontChoice || "default",
    fontSize: input.fontSize || 16,
    pageSize: input.pageSize || "a4",
    wide: !!input.wide,
    views: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Save to MongoDB Atlas if available
  let savedToMongo = false;
  try {
    const mongo = await getMongoClient();
    if (mongo) {
      const db = mongo.db(dbName);
      const collection = db.collection<SharedDocument>("shared_documents");
      await collection.insertOne(doc);
      savedToMongo = true;
    }
  } catch (err) {
    console.error("MongoDB insert error:", err);
  }

  // 2. Also save / backup to GitHub Repository if configured (async / non-blocking)
  saveToGitHub(doc).catch((e) => console.warn("GitHub backup failed:", e));

  // 3. Update local fallback store
  const store = getLocalStore();
  store.set(id, doc);
  persistLocalStore();

  return doc;
}

export async function getSharedDocument(
  id: string
): Promise<SharedDocument | null> {
  if (!id) return null;
  const dbName = process.env.MONGODB_DB || "markdown_app";

  // 1. Try MongoDB Atlas first (fastest)
  try {
    const mongo = await getMongoClient();
    if (mongo) {
      const db = mongo.db(dbName);
      const collection = db.collection<SharedDocument>("shared_documents");
      const doc = await collection.findOne({ id });
      if (doc) {
        collection
          .updateOne({ id }, { $inc: { views: 1 } })
          .catch((err) => console.error("View increment error:", err));
        return doc;
      }
    }
  } catch (err) {
    console.error("MongoDB find error:", err);
  }

  // 2. Try GitHub Repository File System if not found in MongoDB
  const githubDoc = await getFromGitHub(id);
  if (githubDoc) {
    return githubDoc;
  }

  // 3. Try Local Store fallback
  const store = getLocalStore();
  const doc = store.get(id);
  if (doc) {
    doc.views = (doc.views || 0) + 1;
    persistLocalStore();
    return doc;
  }

  return null;
}
