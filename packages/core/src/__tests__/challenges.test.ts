import { describe, it, expect } from "vitest";
import { multiplication } from "../challenges/multiplication.js";
import { stringReverse } from "../challenges/string-reverse.js";
import { charCount } from "../challenges/char-count.js";
import { expression } from "../challenges/expression.js";
import { sort } from "../challenges/sort.js";
import { binaryDecode } from "../challenges/binary-decode.js";
import { registerChallenge, getGenerators } from "../challenges/index.js";

describe("multiplication generator", () => {
  it("produces a valid challenge with correct answer", () => {
    const { display, answer } = multiplication.generate();
    expect(display.type).toBe("math");
    expect(display.icon).toBe("\u00d7");
    expect(display.title).toBe("Speed Arithmetic");
    expect(display.timeLimit).toBe(15);
    expect(display.prompt).toContain("\u00d7");

    const nums = display.prompt.split(" \u00d7 ").map((s) => Number(s.replace(/,/g, "")));
    expect(nums).toHaveLength(2);
    expect(answer).toBe(String(nums[0] * nums[1]));
    expect(display.answer).toBe(answer);
  });

  it("generates numbers in the 5-digit range", () => {
    for (let i = 0; i < 10; i++) {
      const { display } = multiplication.generate();
      const nums = display.prompt.split(" \u00d7 ").map((s) => Number(s.replace(/,/g, "")));
      expect(nums[0]).toBeGreaterThanOrEqual(10_000);
      expect(nums[0]).toBeLessThanOrEqual(99_999);
      expect(nums[1]).toBeGreaterThanOrEqual(10_000);
      expect(nums[1]).toBeLessThanOrEqual(99_999);
    }
  });
});

describe("stringReverse generator", () => {
  it("produces a valid challenge where the answer is the reversed prompt", () => {
    const { display, answer } = stringReverse.generate();
    expect(display.type).toBe("string");
    expect(display.timeLimit).toBe(15);
    expect(answer).toBe(display.prompt.split("").reverse().join(""));
    expect(display.prompt.length).toBeGreaterThanOrEqual(60);
    expect(display.prompt.length).toBeLessThanOrEqual(80);
  });
});

describe("charCount generator", () => {
  it("produces a valid challenge with correct count", () => {
    const { display, answer } = charCount.generate();
    expect(display.type).toBe("count");
    expect(display.timeLimit).toBe(15);

    const targetMatch = display.description.match(/letter "([a-z])"/);
    expect(targetMatch).not.toBeNull();
    const target = targetMatch![1];
    const actualCount = [...display.prompt].filter((c) => c === target).length;
    expect(answer).toBe(String(actualCount));
  });
});

describe("expression generator", () => {
  it("produces a valid challenge with correct evaluation", () => {
    const { display, answer } = expression.generate();
    expect(display.type).toBe("expression");
    expect(display.timeLimit).toBe(15);

    const match = display.prompt.match(
      /\((\d+) \u00d7 (\d+)\) \+ \((\d+) \u00d7 (\d+)\) \u2212 (\d+)/,
    );
    expect(match).not.toBeNull();
    const [, a, b, c, d, e] = match!.map(Number);
    expect(answer).toBe(String(a * b + c * d - e));
  });
});

describe("sort generator", () => {
  it("produces a valid challenge with correct k-th smallest", () => {
    const { display, answer } = sort.generate();
    expect(display.type).toBe("sort");
    expect(display.timeLimit).toBe(15);

    const nums = display.prompt.split(", ").map(Number);
    expect(nums).toHaveLength(15);

    const kMatch = display.description.match(/the (\d+)/);
    expect(kMatch).not.toBeNull();
    const k = Number(kMatch![1]);
    const sorted = [...nums].sort((a, b) => a - b);
    expect(answer).toBe(String(sorted[k - 1]));
  });
});

describe("binaryDecode generator", () => {
  it("produces a valid challenge where decoding the binary gives the answer", () => {
    const { display, answer } = binaryDecode.generate();
    expect(display.type).toBe("binary");
    expect(display.timeLimit).toBe(15);

    const decoded = display.prompt
      .split(" ")
      .map((octet) => String.fromCharCode(parseInt(octet, 2)))
      .join("");
    expect(decoded).toBe(answer);
    expect(answer).toMatch(/^[A-Z]+$/);
  });
});

describe("challenge registry", () => {
  it("returns all 6 built-in generators by default", () => {
    const all = getGenerators();
    expect(all.length).toBeGreaterThanOrEqual(6);
    const types = all.map((g) => g.type);
    expect(types).toContain("math");
    expect(types).toContain("string");
    expect(types).toContain("count");
    expect(types).toContain("expression");
    expect(types).toContain("sort");
    expect(types).toContain("binary");
  });

  it("filters generators by type", () => {
    const filtered = getGenerators(["math", "binary"]);
    expect(filtered).toHaveLength(2);
    expect(filtered.map((g) => g.type)).toEqual(
      expect.arrayContaining(["math", "binary"]),
    );
  });

  it("registers and retrieves a custom generator", () => {
    registerChallenge({
      type: "test-custom",
      generate() {
        return {
          display: {
            type: "test-custom",
            icon: "T",
            title: "Test",
            description: "A test challenge",
            prompt: "hello",
            timeLimit: 5,
            answer: "world",
          },
          answer: "world",
        };
      },
    });

    const all = getGenerators();
    expect(all.map((g) => g.type)).toContain("test-custom");
  });

  it("throws when registering a duplicate type", () => {
    expect(() =>
      registerChallenge({
        type: "math",
        generate: () => ({
          display: {
            type: "math",
            icon: "",
            title: "",
            description: "",
            prompt: "",
            timeLimit: 0,
            answer: "",
          },
          answer: "",
        }),
      }),
    ).toThrow('Challenge type "math" is already registered.');
  });
});
