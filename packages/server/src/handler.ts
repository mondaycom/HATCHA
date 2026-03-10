import {
  createChallenge,
  verifyAnswer,
  type HatchaConfig,
} from "@mondaycom/hatcha-core";

export interface HatchaServerConfig {
  /** HMAC secret for signing challenge tokens. */
  secret: string;
  /** Token TTL in seconds. Default: 120. */
  tokenTTL?: number;
  /** Restrict to specific challenge types. */
  challengeTypes?: string[];
}

/** Framework-agnostic handler — returns plain objects, no Request/Response. */
export async function handleChallenge(config: HatchaServerConfig) {
  const coreConfig: HatchaConfig = {
    secret: config.secret,
    tokenTTL: config.tokenTTL,
    challengeTypes: config.challengeTypes,
  };
  return createChallenge(coreConfig);
}

export async function handleVerify(
  config: HatchaServerConfig,
  body: { answer?: string; token?: string },
) {
  if (!body.answer || !body.token) {
    return { success: false, error: "Missing answer or token." };
  }

  const coreConfig: HatchaConfig = {
    secret: config.secret,
    tokenTTL: config.tokenTTL,
    challengeTypes: config.challengeTypes,
  };

  return verifyAnswer(coreConfig, body.answer, body.token);
}
