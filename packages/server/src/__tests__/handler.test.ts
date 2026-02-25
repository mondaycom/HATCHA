import { describe, it, expect } from "vitest";
import { handleChallenge, handleVerify } from "../handler.js";

const config = { secret: "server-test-secret" };

describe("handleChallenge", () => {
  it("returns a challenge payload with display and token", async () => {
    const result = await handleChallenge(config);
    expect(result.challenge).toBeDefined();
    expect(result.challenge.id).toMatch(/^[0-9a-f]{32}$/);
    expect(typeof result.challenge.type).toBe("string");
    expect(typeof result.challenge.prompt).toBe("string");
    expect(typeof result.token).toBe("string");
    expect((result.challenge as Record<string, unknown>).answer).toBeUndefined();
  });

  it("respects challengeTypes option", async () => {
    const result = await handleChallenge({
      ...config,
      challengeTypes: ["binary"],
    });
    expect(result.challenge.type).toBe("binary");
  });
});

describe("handleVerify", () => {
  it("returns success for a correct answer", async () => {
    const { challenge, token } = await handleChallenge({
      ...config,
      challengeTypes: ["binary"],
    });

    const answer = challenge.prompt
      .split(" ")
      .map((octet) => String.fromCharCode(parseInt(octet, 2)))
      .join("");

    const result = await handleVerify(config, { answer, token });
    expect(result.success).toBe(true);
  });

  it("returns failure for a wrong answer", async () => {
    const { token } = await handleChallenge(config);
    const result = await handleVerify(config, { answer: "WRONG", token });
    expect(result.success).toBe(false);
  });

  it("returns error when answer is missing", async () => {
    const result = await handleVerify(config, { token: "some-token" });
    expect(result.success).toBe(false);
    expect((result as Record<string, unknown>).error).toBe(
      "Missing answer or token.",
    );
  });

  it("returns error when token is missing", async () => {
    const result = await handleVerify(config, { answer: "some-answer" });
    expect(result.success).toBe(false);
    expect((result as Record<string, unknown>).error).toBe(
      "Missing answer or token.",
    );
  });

  it("returns error when both are missing", async () => {
    const result = await handleVerify(config, {});
    expect(result.success).toBe(false);
  });
});
