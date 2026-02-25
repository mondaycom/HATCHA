import type { GotchaConfig, VerifyResult } from "./types.js";
import { sha256, verifyToken, signVerification } from "./crypto.js";
import { normalise } from "./utils.js";

/**
 * Verify an answer against a signed challenge token.
 *
 * 1. Verifies the HMAC signature on the token.
 * 2. Checks the token has not expired.
 * 3. Hashes the submitted answer and compares it to the stored hash.
 *
 * On success, returns a signed `verificationToken` the consuming app
 * can use to confirm the challenge was completed.
 */
export async function verifyAnswer(
  config: GotchaConfig,
  answer: string,
  token: string,
): Promise<VerifyResult> {
  const payload = await verifyToken(config.secret, token);

  if (!payload) {
    return { success: false, challengeId: "" };
  }

  if (Date.now() > payload.exp) {
    return { success: false, challengeId: payload.cid };
  }

  const normalisedAnswer = normalise(answer, payload.typ);
  const hashedAnswer = await sha256(normalisedAnswer);

  if (hashedAnswer !== payload.ans) {
    return { success: false, challengeId: payload.cid };
  }

  const verificationToken = await signVerification(config.secret, payload.cid);

  return {
    success: true,
    challengeId: payload.cid,
    verificationToken,
  };
}
