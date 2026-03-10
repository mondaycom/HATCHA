/* ------------------------------------------------------------------ */
/*  Public types for @mondaycom/hatcha-core                                      */
/* ------------------------------------------------------------------ */

/** What the client sees — never includes the answer. */
export interface ChallengeDisplay {
  id: string;
  type: string;
  icon: string;
  title: string;
  description: string;
  prompt: string;
  timeLimit: number;
}

/** Full challenge including the answer (server-side only). */
export interface ChallengeFull extends ChallengeDisplay {
  answer: string;
}

/** Returned by createChallenge(). */
export interface ChallengePayload {
  /** Display data to send to the client. */
  challenge: ChallengeDisplay;
  /** Opaque signed token — send to the client, receive back on verify. */
  token: string;
}

/** Returned by verifyAnswer(). */
export interface VerifyResult {
  success: boolean;
  challengeId: string;
  /** A signed verification token the consuming app can validate. */
  verificationToken?: string;
}

/** Interface every challenge generator must implement. */
export interface ChallengeGenerator {
  /** Unique type identifier (e.g. "math", "binary"). */
  type: string;
  /** Produce a challenge with a display payload and the correct answer. */
  generate(): { display: Omit<ChallengeFull, "id">; answer: string };
}

/** Configuration for createChallenge / verifyAnswer. */
export interface HatchaConfig {
  /** HMAC secret — required. */
  secret: string;
  /** How long (in seconds) a challenge token stays valid. Default: 120. */
  tokenTTL?: number;
  /** Restrict to specific challenge types. Default: all registered. */
  challengeTypes?: string[];
}
