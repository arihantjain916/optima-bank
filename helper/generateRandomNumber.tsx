import crypto from "crypto";

export function generateUniqueAccountNumber(userId: string, secretKey: string) {
  const length = 12;

  // 1. Create a hash from User ID + Secret
  // We don't include the date here because account numbers usually never change
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(`${userId}-account`)
    .digest("hex");

  // 2. Extract 12 digits from the hash
  let accountNumber = "";
  for (let i = 0; i < hash.length && accountNumber.length < length; i++) {
    const charCode = hash.charCodeAt(i);
    accountNumber += (charCode % 10).toString();
  }

  // 3. Ensure it doesn't start with 0 (optional, for aesthetics)
  if (accountNumber.startsWith("0")) {
    accountNumber = "1" + accountNumber.slice(1);
  }

  return accountNumber;
}

export function generateOTP(length: number = 4) {
  // const length = 4;
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  const random = crypto.randomInt(min, max + 1);
  return random.toString().padStart(length, "0");
}
