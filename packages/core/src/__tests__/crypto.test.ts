import { describe, it, expect } from "vitest";
import { sha256, randomId, signToken, verifyToken, signVerification } from "../crypto.js";

describe("sha256", () => {
  it("produces a 64-char hex string", async () => {
    const hash = await sha256("hello");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic", async () => {
    const a = await sha256("test-input");
    const b = await sha256("test-input");
    expect(a).toBe(b);
  });

  it("produces different hashes for different inputs", async () => {
    const a = await sha256("input-a");
    const b = await sha256("input-b");
    expect(a).not.toBe(b);
  });
});

describe("randomId", () => {
  it("produces a 32-char hex string", () => {
    const id = randomId();
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it("produces unique values", () => {
    const ids = new Set(Array.from({ length: 50 }, () => randomId()));
    expect(ids.size).toBe(50);
  });
});

describe("signToken / verifyToken", () => {
  const secret = "test-secret-key";
  const payload = {
    cid: "abc123",
    typ: "math",
    ans: "deadbeef",
    exp: Date.now() + 60_000,
  };

  it("round-trips a payload through sign and verify", async () => {
    const token = await signToken(secret, payload);
    const decoded = await verifyToken(secret, token);
    expect(decoded).toEqual(payload);
  });

  it("returns null for a tampered token", async () => {
    const token = await signToken(secret, payload);
    const tampered = token.slice(0, -4) + "XXXX";
    const decoded = await verifyToken(secret, tampered);
    expect(decoded).toBeNull();
  });

  it("returns null for a wrong secret", async () => {
    const token = await signToken(secret, payload);
    const decoded = await verifyToken("wrong-secret", token);
    expect(decoded).toBeNull();
  });

  it("returns null for garbage input", async () => {
    expect(await verifyToken(secret, "not-a-token")).toBeNull();
    expect(await verifyToken(secret, "")).toBeNull();
    expect(await verifyToken(secret, "a.b.c")).toBeNull();
  });

  it("returns null for invalid base64", async () => {
    expect(await verifyToken(secret, "!!!.???")).toBeNull();
  });
});

describe("signVerification", () => {
  it("produces a verifiable token string", async () => {
    const secret = "verify-secret";
    const token = await signVerification(secret, "challenge-42");
    expect(typeof token).toBe("string");
    expect(token).toContain(".");
    expect(token.split(".")).toHaveLength(2);
  });
});
