import type { ChallengeGenerator } from "../types.js";
import { randomInt, ordinal } from "../utils.js";

/** Sort 15 numbers and return the k-th smallest. */
export const sort: ChallengeGenerator = {
  type: "sort",
  generate() {
    const nums = Array.from({ length: 15 }, () => randomInt(1, 9999));
    const k = randomInt(3, 13);
    const sorted = [...nums].sort((a, b) => a - b);
    const answer = String(sorted[k - 1]);
    return {
      display: {
        type: "sort",
        icon: "\u21c5",
        title: "Instant Sort",
        description: `Sort these numbers ascending. What is the ${ordinal(k)} value?`,
        prompt: nums.join(", "),
        timeLimit: 15,
        answer,
      },
      answer,
    };
  },
};
