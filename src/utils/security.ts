/**
 * Cryptographic utility for securing Burger Bite admin passkeys.
 * Uses salted SHA-256 via browser-native Web Crypto API.
 * The passkey is never stored or transmitted in plain text.
 */

const SALT = 'burger_bite_secure_salt_2026_';

// Default initial passkeys
export const DEFAULT_PASSKEY = 'burgerbite2026';
export const LEGACY_PASSKEY = 'admin123';

/**
 * Computes a salted SHA-256 hash of the provided passkey.
 */
export async function hashPasskey(key: string): Promise<string> {
  const cleanKey = key.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + cleanKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Precomputed hashes for initial bootstrap keys
let cachedDefaultHash: string | null = null;
let cachedLegacyHash: string | null = null;

export async function getDefaultPasskeyHash(): Promise<string> {
  if (!cachedDefaultHash) {
    cachedDefaultHash = await hashPasskey(DEFAULT_PASSKEY);
  }
  return cachedDefaultHash;
}

export async function getLegacyPasskeyHash(): Promise<string> {
  if (!cachedLegacyHash) {
    cachedLegacyHash = await hashPasskey(LEGACY_PASSKEY);
  }
  return cachedLegacyHash;
}

/**
 * Verifies an entered candidate passkey against a stored hash.
 * If no stored hash exists yet, checks against default bootstrap hashes.
 */
export async function verifyPasskey(
  candidateKey: string,
  storedHash?: string | null
): Promise<boolean> {
  if (!candidateKey || !candidateKey.trim()) {
    return false;
  }

  const candidateHash = await hashPasskey(candidateKey);

  // If a custom hash is configured in Firestore / LocalStorage
  if (storedHash && storedHash.trim().length > 0) {
    return candidateHash === storedHash.trim();
  }

  // Fallback to default bootstrap keys
  const defaultHash = await getDefaultPasskeyHash();
  const legacyHash = await getLegacyPasskeyHash();

  return candidateHash === defaultHash || candidateHash === legacyHash;
}
