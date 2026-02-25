import type { ChallengeGenerator } from "../types.js";
import { randomInt } from "../utils.js";

const POOL = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

/** Reverse a 60-80 character random string. */
export const stringReverse: ChallengeGenerator = {
  type: "string",
  generate() {
    let s = "";
    const len = randomInt(60, 80);
    for (let i = 0; i < len; i++) {
      s += POOL[randomInt(0, POOL.length - 1)];
    }
    const answer = s.split("").reverse().join("");
    return {
      display: {
        type: "string",
        icon: "\u2194",
        title: "String Reversal",
        description: "Reverse every character of the string below.",
        prompt: s,
        timeLimit: 15,
        answer,
      },
      answer,
    };
  },
};
