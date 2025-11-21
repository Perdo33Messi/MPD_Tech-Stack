import crypto from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

type StoredKey = {
  id: string;
  hash: string;
  createdAt: string;
  expiresAt: string;
  prefix: string;
  maskedKey: string;
};

const storedKeys: StoredKey[] = [];

function buildExpiryDate() {
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + sixMonthsMs).toISOString().slice(0, 10);
}

// Create a new API key and store the hash plus metadata
export function createApiKey() {
  const apiKey = crypto.randomUUID();
  const id = `key_${crypto.randomUUID()}`;
  const hash = bcrypt.hashSync(apiKey, SALT_ROUNDS);
  const expiresAt = buildExpiryDate();
  const prefix = apiKey.slice(0, 8);
  const maskedKey = `${prefix}...`;

  storedKeys.push({
    id,
    hash,
    createdAt: new Date().toISOString(),
    expiresAt,
    prefix,
    maskedKey,
  });

  return { id, apiKey, prefix, maskedKey, expiresAt };
}

export function listApiKeys() {
  return storedKeys.map(({ id, prefix, maskedKey, expiresAt, createdAt }) => ({
    id,
    prefix,
    maskedKey,
    expiresAt,
    createdAt,
  }));
}

export function deleteApiKey(id: string) {
  const index = storedKeys.findIndex((entry) => entry.id === id);
  if (index === -1) return false;

  storedKeys.splice(index, 1);
  return true;
}

export function isValidApiKey(apiKey: string | undefined) {
  if (!apiKey) return false;

  // Compare against every stored hash
  return storedKeys.some((entry) => bcrypt.compareSync(apiKey, entry.hash));
}
