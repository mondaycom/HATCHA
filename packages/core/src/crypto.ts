/* ------------------------------------------------------------------ */
/*  Stateless token signing using HMAC-SHA256                          */
/*  Works in Node.js, Deno, Cloudflare Workers, and browsers.          */
/* ------------------------------------------------------------------ */

/** Payload embedded inside a signed challenge token. */
interface TokenPayload {
  /** Challenge ID (random). */
  cid: string;
  /** Challenge type (for answer normalisation). */
  typ: string;
  /** SHA-256 hash of the normalised correct answer. */
  ans: string;
  /** Expiry timestamp (ms since epoch). */
  exp: number;
}

const encoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** SHA-256 hex hash of a string. */
export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return toHex(buf);
}

/** Generate a random challenge ID. */
export function randomId(): string {
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  return toHex(buf.buffer as ArrayBuffer);
}

/** Sign a payload, return `base64url(payload).base64url(signature)`. */
export async function signToken(
  secret: string,
  payload: TokenPayload,
): Promise<string> {
  const key = await getKey(secret);
  const data = encoder.encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const payloadB64 = btoa(String.fromCharCode(...data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payloadB64}.${sigB64}`;
}

/** Verify and decode a token. Returns null if signature is invalid. */
export async function verifyToken(
  secret: string,
  token: string,
): Promise<TokenPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sigB64] = parts;

  let payloadBytes: Uint8Array;
  let sigBytes: Uint8Array;
  try {
    payloadBytes = Uint8Array.from(atob(payloadB64), (c) => c.charCodeAt(0));
    sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }

  const key = await getKey(secret);
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
  if (!valid) return null;

  try {
    return JSON.parse(new TextDecoder().decode(payloadBytes)) as TokenPayload;
  } catch {
    return null;
  }
}

/** Sign a verification result that consuming apps can validate. */
export async function signVerification(
  secret: string,
  challengeId: string,
): Promise<string> {
  const payload = {
    cid: challengeId,
    verified: true,
    iat: Date.now(),
  };
  const key = await getKey(secret);
  const data = encoder.encode(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const payloadB64 = btoa(String.fromCharCode(...data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payloadB64}.${sigB64}`;
}
