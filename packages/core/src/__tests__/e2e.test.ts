import { describe, it, expect } from "vitest";
import { createChallenge } from "../generate.js";
import { verifyAnswer } from "../verify.js";
import { signToken } from "../crypto.js";
import type { HatchaConfig } from "../types.js";

const config: HatchaConfig = {
  secret: "e2e-test-secret-key",
};

describe("createChallenge", () => {
  it("returns a challenge display and a signed token", async () => {
    const { challenge, token } = await createChallenge(config);

    expect(challenge.id).toMatch(/^[0-9a-f]{32}$/);
    expect(typeof challenge.type).toBe("string");
    expect(typeof challenge.title).toBe("string");
    expect(typeof challenge.description).toBe("string");
    expect(typeof challenge.prompt).toBe("string");
    expect(typeof challenge.timeLimit).toBe("number");
    expect(challenge.timeLimit).toBeGreaterThan(0);
    expect((challenge as Record<string, unknown>).answer).toBeUndefined();
    expect(typeof token).toBe("string");
    expect(token).toContain(".");
  });

  it("respects challengeTypes filter", async () => {
    const { challenge } = await createChallenge({
      ...config,
      challengeTypes: ["binary"],
    });
    expect(challenge.type).toBe("binary");
  });

  it("throws when no generators match", async () => {
    await expect(
      createChallenge({ ...config, challengeTypes: ["nonexistent"] }),
    ).rejects.toThrow("No challenge generators registered.");
  });
});

describe("createChallenge -> verifyAnswer", () => {
  it("succeeds with the correct answer", async () => {
    const { challenge, token } = await createChallenge({
      ...config,
      challengeTypes: ["binary"],
    });

    const decoded = challenge.prompt
      .split(" ")
      .map((octet) => String.fromCharCode(parseInt(octet, 2)))
      .join("");

    const result = await verifyAnswer(config, decoded, token);
    expect(result.success).toBe(true);
    expect(result.challengeId).toBe(challenge.id);
    expect(typeof result.verificationToken).toBe("string");
  });

  it("fails with a wrong answer", async () => {
    const { token } = await createChallenge({
      ...config,
      challengeTypes: ["binary"],
    });

    const result = await verifyAnswer(config, "WRONG", token);
    expect(result.success).toBe(false);
    expect(result.verificationToken).toBeUndefined();
  });

  it("fails with a tampered token", async () => {
    const result = await verifyAnswer(config, "anything", "bad.token");
    expect(result.success).toBe(false);
    expect(result.challengeId).toBe("");
  });

  it("fails when the token has expired", async () => {
    const { challenge, token } = await createChallenge({
      ...config,
      challengeTypes: ["binary"],
      tokenTTL: 0,
    });

    await new Promise((r) => setTimeout(r, 50));

    const decoded = challenge.prompt
      .split(" ")
      .map((octet) => String.fromCharCode(parseInt(octet, 2)))
      .join("");

    const result = await verifyAnswer(config, decoded, token);
    expect(result.success).toBe(false);
    expect(result.challengeId).toBe(challenge.id);
  });

  it("works with math challenges", async () => {
    const { challenge, token } = await createChallenge({
      ...config,
      challengeTypes: ["math"],
    });

    const nums = challenge.prompt
      .split(" \u00d7 ")
      .map((s) => Number(s.replace(/,/g, "")));
    const answer = String(nums[0] * nums[1]);

    const result = await verifyAnswer(config, answer, token);
    expect(result.success).toBe(true);
  });

  it("works with string reversal challenges", async () => {
    const { challenge, token } = await createChallenge({
      ...config,
      challengeTypes: ["string"],
    });

    const answer = challenge.prompt.split("").reverse().join("");
    const result = await verifyAnswer(config, answer, token);
    expect(result.success).toBe(true);
  });

});
