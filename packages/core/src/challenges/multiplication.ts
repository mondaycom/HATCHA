import type { ChallengeGenerator, ChallengeFull } from "../types.js";
import { randomInt } from "../utils.js";

/** 5-digit x 5-digit multiplication — trivial for a machine, painful for a human. */
export const multiplication: ChallengeGenerator = {
  type: "math",
  generate() {
    const a = randomInt(10_000, 99_999);
    const b = randomInt(10_000, 99_999);
    return {
      display: {
        type: "math",
        icon: "\u00d7",
        title: "Speed Arithmetic",
        description: "Compute the exact product of these two numbers.",
        prompt: `${a.toLocaleString("en-US")} \u00d7 ${b.toLocaleString("en-US")}`,
        timeLimit: 15,
        answer: String(a * b),
      },
      answer: String(a * b),
    };
  },
};
