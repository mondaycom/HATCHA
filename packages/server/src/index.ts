export { handleChallenge, handleVerify } from "./handler.js";
export type { GotchaServerConfig } from "./handler.js";
export { createGotchaHandler } from "./nextjs.js";
export { gotchaRouter } from "./express.js";

export { registerChallenge, getGenerators } from "@gotcha-captcha/core";
export type {
  ChallengeGenerator,
  ChallengeDisplay,
  GotchaConfig,
} from "@gotcha-captcha/core";
