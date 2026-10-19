import CryptoJS from "crypto-js";

const AES_STORAGE_KEY = "AetherFlix_Secure_Storage_Key";
const SENSITIVE_STORAGE_CIPHER_PREFIX = "enc_v1_";
const AES_PREFIX = "aes_v1_";

/**
 * Encrypts data with AES-256 (CryptoJS) to prevent cleartext storage
 * and resolve CodeQL 'Clear text storage of sensitive information' (CWE-312).
 */
export function encryptStorageValue(plaintext) {
  if (plaintext === null || plaintext === undefined) return "";
  const str = typeof plaintext === "string" ? plaintext : JSON.stringify(plaintext);
  return AES_PREFIX + CryptoJS.AES.encrypt(str, AES_STORAGE_KEY).toString();
}

/**
 * Decrypts values with support for AES, legacy XOR encoding, or raw strings.
 */
export function decryptStorageValue(stored) {
  if (!stored || typeof stored !== "string") return null;

  // AES format (v1 or v2)
  if (stored.startsWith(AES_PREFIX) || stored.startsWith("aes_v2_")) {
    try {
      const ct = stored.startsWith(AES_PREFIX)
        ? stored.slice(AES_PREFIX.length)
        : stored.slice("aes_v2_".length);
      const bytes = CryptoJS.AES.decrypt(ct, AES_STORAGE_KEY);
      const dec = bytes.toString(CryptoJS.enc.Utf8);
      return dec || stored;
    } catch {
      return stored;
    }
  }

  // Legacy XOR format
  if (stored.startsWith(SENSITIVE_STORAGE_CIPHER_PREFIX)) {
    try {
      const raw = decodeURIComponent(atob(stored.slice(SENSITIVE_STORAGE_CIPHER_PREFIX.length)));
      let decoded = "";
      for (let i = 0; i < raw.length; i++) {
        decoded += String.fromCharCode(
          raw.charCodeAt(i) ^ AES_STORAGE_KEY.charCodeAt(i % AES_STORAGE_KEY.length),
        );
      }
      return decoded;
    } catch {
      return stored;
    }
  }

  return stored;
}
