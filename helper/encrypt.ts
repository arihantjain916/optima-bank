const crypto = require("crypto");

export const generateUniqueCardNumber = (
  userId: string,
  secretKey: string,
  length: number,
): string => {
  const dateStr = new Date().toISOString().split("T")[0];

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(`${userId}-${dateStr}`)
    .digest("hex");


  let numericString = "";
  for (let i = 0; i < hash.length && numericString.length < length; i++) {
    const charCode = hash.charCodeAt(i);
    numericString += (charCode % 10).toString();
  }

  return appendLuhnCheckDigit(numericString);
};

function appendLuhnCheckDigit(number: string): string {
  let sum = 0;
  for (let i = 0; i < number.length; i++) {
    let digit = parseInt(number[number.length - 1 - i]);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return number + checkDigit;
}

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

export function generateDynamicCVV(cardId: string, secretKey: string) {
  const timeStep = Math.floor(Date.now() / 300000);

  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(`${cardId}-${timeStep}`)
    .digest("hex");

  const cvv = (parseInt(hash.substring(0, 8), 16) % 900) + 100;
  return cvv.toString();
}

export function validateDynamicCVV(
  providedCvv: string,
  cardId: string,
  secretKey: string,
): boolean {
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const currentDayStep = Math.floor(Date.now() / DAY_IN_MS);

  const validDays = [currentDayStep, currentDayStep - 1];

  return validDays.some((step) => {
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(`${cardId}-${step}`)
      .digest("hex");

    const calculatedCvv = (parseInt(hash.substring(0, 8), 16) % 900) + 100;

    return calculatedCvv.toString() === providedCvv;
  });
}
