export { handleChallenge, handleVerify } from "./handler.js";
export type { HatchaServerConfig } from "./handler.js";
export { createHatchaHandler } from "./nextjs.js";
export { hatchaRouter } from "./express.js";

export { registerChallenge, getGenerators } from "@mondaydotcomorg/hatcha-core";
export type {
  ChallengeGenerator,
  ChallengeDisplay,
  HatchaConfig,
} from "@mondaydotcomorg/hatcha-core";
