import type { ChallengeGenerator } from "../types.js";
import { multiplication } from "./multiplication.js";
import { stringReverse } from "./string-reverse.js";
import { charCount } from "./char-count.js";
import { expression } from "./expression.js";
import { sort } from "./sort.js";
import { binaryDecode } from "./binary-decode.js";

/** Mutable registry — users can add custom generators at runtime. */
const registry: ChallengeGenerator[] = [
  multiplication,
  stringReverse,
  charCount,
  expression,
  sort,
  binaryDecode,
];

/** Register a custom challenge generator. */
export function registerChallenge(generator: ChallengeGenerator): void {
  if (registry.some((g) => g.type === generator.type)) {
    throw new Error(`Challenge type "${generator.type}" is already registered.`);
  }
  registry.push(generator);
}

/** Get all registered generators, optionally filtered by type. */
export function getGenerators(types?: string[]): ChallengeGenerator[] {
  if (!types || types.length === 0) return registry;
  return registry.filter((g) => types.includes(g.type));
}

export {
  multiplication,
  stringReverse,
  charCount,
  expression,
  sort,
  binaryDecode,
};
