export { createChallenge } from "./generate.js";
export { verifyAnswer } from "./verify.js";
export { registerChallenge, getGenerators } from "./challenges/index.js";
export { normalise } from "./utils.js";

export type {
  ChallengeDisplay,
  ChallengeFull,
  ChallengePayload,
  VerifyResult,
  ChallengeGenerator,
  HatchaConfig,
} from "./types.js";
