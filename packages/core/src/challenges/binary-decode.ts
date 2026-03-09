import type { ChallengeGenerator } from "../types.js";
import { randomInt } from "../utils.js";

const WORDS = [
  "AGENT", "ROBOT", "NEXUS", "CYBER", "LOGIC",
  "PROXY", "STACK", "ASYNC", "CLOUD", "DELTA",
];

/** Convert binary octets to an ASCII word. */
export const binaryDecode: ChallengeGenerator = {
  type: "binary",
  generate() {
    const word = WORDS[randomInt(0, WORDS.length - 1)];
    const binary = [...word]
      .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
    return {
      display: {
        type: "binary",
        icon: "01",
        title: "Binary Decode",
        description: "Convert the binary octets to ASCII text.",
        prompt: binary,
        timeLimit: 30,
        answer: word,
      },
      answer: word,
    };
  },
};
