import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// In-memory store for hashed keys
const hashedKeys: string[] = [];

// Create a new API key and store *ONLY the hash*
export function createApiKey() {
  const key = crypto.randomUUID();
  const hash = bcrypt.hashSync(key, SALT_ROUNDS);

  hashedKeys.push(hash);
  return key; // send plaintext ONCE
}

export function isValidApiKey(apiKey: string | undefined) {
  if (!apiKey) return false;

  // Compare against every stored hash
  return hashedKeys.some((hash) => bcrypt.compareSync(apiKey, hash));
}


