"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiKey = createApiKey;
exports.listApiKeys = listApiKeys;
exports.deleteApiKey = deleteApiKey;
exports.isValidApiKey = isValidApiKey;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const storedKeys = [];
function buildExpiryDate() {
    const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
    return new Date(Date.now() + sixMonthsMs).toISOString().slice(0, 10);
}
// Create a new API key and store the hash plus metadata
function createApiKey() {
    const apiKey = crypto_1.default.randomUUID();
    const id = `key_${crypto_1.default.randomUUID()}`;
    const hash = bcrypt_1.default.hashSync(apiKey, SALT_ROUNDS);
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
function listApiKeys() {
    return storedKeys.map(({ id, prefix, maskedKey, expiresAt, createdAt }) => ({
        id,
        prefix,
        maskedKey,
        expiresAt,
        createdAt,
    }));
}
function deleteApiKey(id) {
    const index = storedKeys.findIndex((entry) => entry.id === id);
    if (index === -1)
        return false;
    storedKeys.splice(index, 1);
    return true;
}
function isValidApiKey(apiKey) {
    if (!apiKey)
        return false;
    // Compare against every stored hash
    return storedKeys.some((entry) => bcrypt_1.default.compareSync(apiKey, entry.hash));
}
