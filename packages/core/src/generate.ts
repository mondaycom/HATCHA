import type { ChallengePayload, GotchaConfig } from "./types.js";
import { getGenerators } from "./challenges/index.js";
import { sha256, randomId, signToken } from "./crypto.js";
import { normalise, randomInt } from "./utils.js";

/**
 * Generate a challenge.
 *
 * Returns a `ChallengeDisplay` (safe for the client) and an opaque
 * signed `token` embedding the hashed answer and an expiry.
 */
export async function createChallenge(
  config: GotchaConfig,
): Promise<ChallengePayload> {
  const generators = getGenerators(config.challengeTypes);
  if (generators.length === 0) {
    throw new Error("No challenge generators registered.");
  }

  const gen = generators[randomInt(0, generators.length - 1)];
  const { display, answer } = gen.generate();

  const id = randomId();
  const ttl = (config.tokenTTL ?? 120) * 1000;
  const normalisedAnswer = normalise(answer, display.type);
  const hashedAnswer = await sha256(normalisedAnswer);

  const token = await signToken(config.secret, {
    cid: id,
    typ: display.type,
    ans: hashedAnswer,
    exp: Date.now() + ttl,
  });

  const { answer: _omit, ...safeDisplay } = display;

  return {
    challenge: { ...safeDisplay, id },
    token,
  };
}
