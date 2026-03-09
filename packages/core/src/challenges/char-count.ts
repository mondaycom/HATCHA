import type { ChallengeGenerator } from "../types.js";
import { randomInt } from "../utils.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/** Count occurrences of a specific character in a ~250 char string. */
export const charCount: ChallengeGenerator = {
  type: "count",
  generate() {
    const target = ALPHABET[randomInt(0, 25)];
    let s = "";
    const len = randomInt(200, 300);
    for (let i = 0; i < len; i++) {
      s += ALPHABET[randomInt(0, 25)];
    }
    const count = [...s].filter((c) => c === target).length;
    const answer = String(count);
    return {
      display: {
        type: "count",
        icon: "#",
        title: "Character Census",
        description: `Count every occurrence of the letter "${target}" in the text.`,
        prompt: s,
        timeLimit: 30,
        answer,
      },
      answer,
    };
  },
};
