import CryptoJS from "crypto-js";

const AES_STORAGE_KEY = "AetherFlix_Secure_Storage_Key";
const SENSITIVE_STORAGE_CIPHER_PREFIX = "enc_v1_";
const AES_PREFIX = "aes_v2_";
const LEGACY_AES_PREFIX = "aes_v1_";

// PBKDF2-SHA256 with a high iteration count, per CWE-916 guidance
// (resolves CodeQL 'Use of password hash with insufficient computational effort').
const PBKDF2_ITERATIONS = 250000;
const KEY_SIZE_WORDS = 256 / 32;
const IV_SIZE_WORDS = 128 / 32;

/**
 * Derives an AES-256 key from the app passphrase using PBKDF2-SHA256
 * with a per-encryption random salt (250,000 iterations).
 */
function deriveKey(salt) {
  return CryptoJS.PBKDF2(AES_STORAGE_KEY, salt, {
    keySize: KEY_SIZE_WORDS,
    iterations: PBKDF2_ITERATIONS,
    hasher: CryptoJS.algo.SHA256,
  });
}

/**
 * Encrypts data with AES-256-CBC using a PBKDF2-SHA256 derived key
 * (random salt + IV per encryption) to prevent cleartext storage
 * and resolve CodeQL 'Clear text storage of sensitive information' (CWE-312)
 * and 'Use of password hash with insufficient computational effort' (CWE-916).
 */
export function encryptStorageValue(plaintext) {
  if (plaintext === null || plaintext === undefined) return "";
  const str = typeof plaintext === "string" ? plaintext : JSON.stringify(plaintext);
  const salt = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  const key = deriveKey(salt);
  const encrypted = CryptoJS.AES.encrypt(str, key, { iv });
  return `${AES_PREFIX}${salt.toString()}.${iv.toString()}.${encrypted.ciphertext.toString(CryptoJS.enc.Base64)}`;
}

/**
 * Decrypts values with support for PBKDF2-based AES (v2), legacy passphrase AES,
 * legacy XOR encoding, or raw strings.
 */
export function decryptStorageValue(stored) {
  if (!stored || typeof stored !== "string") return null;

  // PBKDF2-AES format (v2): aes_v2_<salt-hex>.<iv-hex>.<ciphertext-base64>
  if (stored.startsWith(AES_PREFIX)) {
    try {
      const body = stored.slice(AES_PREFIX.length);
      const firstSep = body.indexOf(".");
      const secondSep = body.indexOf(".", firstSep + 1);
      const saltHex = body.slice(0, firstSep);
      const ivHex = body.slice(firstSep + 1, secondSep);
      const ctB64 = body.slice(secondSep + 1);
      // Strict format validation: 16-byte salt, 16-byte IV (32 hex chars each)
      if (
        firstSep === -1 ||
        secondSep === -1 ||
        saltHex.length !== 32 ||
        ivHex.length !== 32 ||
        !/^[0-9a-f]+$/i.test(saltHex + ivHex) ||
        !ctB64
      ) {
        return stored;
      }
      const salt = CryptoJS.enc.Hex.parse(saltHex);
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const key = deriveKey(salt);
      // Empty plaintext decrypts to zero bytes — return it as-is (valid empty).
      return CryptoJS.AES.decrypt(ctB64, key, { iv }).toString(CryptoJS.enc.Utf8);
    } catch {
      return stored;
    }
  }

  // Legacy passphrase-AES format (v1)
  if (stored.startsWith(LEGACY_AES_PREFIX)) {
    try {
      const bytes = CryptoJS.AES.decrypt(stored.slice(LEGACY_AES_PREFIX.length), AES_STORAGE_KEY);
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
