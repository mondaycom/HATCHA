import type { ChallengeGenerator } from "../types.js";
import { randomInt } from "../utils.js";

/** Evaluate (a * b) + (c * d) - e. */
export const expression: ChallengeGenerator = {
  type: "expression",
  generate() {
    const a = randomInt(100, 999);
    const b = randomInt(100, 999);
    const c = randomInt(100, 999);
    const d = randomInt(100, 999);
    const e = randomInt(100, 999);
    const answer = String(a * b + c * d - e);
    return {
      display: {
        type: "expression",
        icon: "f(x)",
        title: "Expression Eval",
        description: "Evaluate the mathematical expression.",
        prompt: `(${a} \u00d7 ${b}) + (${c} \u00d7 ${d}) \u2212 ${e}`,
        timeLimit: 15,
        answer,
      },
      answer,
    };
  },
};
