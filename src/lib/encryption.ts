import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const PREFIX = "enc:v1:";

/**
 * Derives a consistent 256-bit (32 bytes) encryption key.
 * Can be configured via ENCRYPTION_SECRET environment variable.
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_SECRET?.trim() ||
    process.env.MONGODB_URI?.trim() ||
    "markbangla-secure-default-encryption-salt-2026";

  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plain text string using AES-256-GCM.
 * Output format: enc:v1:<iv_hex>:<authTag_hex>:<ciphertext_hex>
 */
export function encryptData(plainText: string): string {
  if (!plainText) return "";

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");

    return `${PREFIX}${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error("Encryption failed:", err);
    throw new Error("Data encryption failed before saving to database");
  }
}

/**
 * Decrypts an AES-256-GCM ciphertext.
 * Gracefully handles unencrypted legacy text.
 */
export function decryptData(cipherText: string): string {
  if (!cipherText) return "";

  // If text is not encrypted with our prefix, return as-is (backward compatible)
  if (!cipherText.startsWith(PREFIX)) {
    return cipherText;
  }

  try {
    const payload = cipherText.slice(PREFIX.length);
    const parts = payload.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted payload format");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const key = getEncryptionKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
    return "[Encrypted content could not be decrypted]";
  }
}
