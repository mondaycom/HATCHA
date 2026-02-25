/** Cryptographically random integer in [min, max]. */
export function randomInt(min: number, max: number): number {
  const range = max - min + 1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

/** English ordinal suffix: 1st, 2nd, 3rd, 4th, ... */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Normalise an answer for comparison (strip whitespace/commas, uppercase for binary). */
export function normalise(raw: string, type: string): string {
  let s = raw.trim();
  if (type === "binary") return s.toUpperCase();
  if (["math", "count", "expression", "sort"].includes(type)) {
    s = s.replace(/[\s,]/g, "");
  }
  return s;
}
