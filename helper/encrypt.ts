const crypto = require("crypto");

export function encrypt(text: string, secret: string) {
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
    data: encrypted,
  };
}

export function decrypt(
  encryptedData: string,
  ivHex: string,
  tagHex: string,
  secret: string,
): string {
  // derive 32-byte key
  const key = crypto.createHash("sha256").update(secret).digest();

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  // attach auth tag
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// export const g
