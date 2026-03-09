import { describe, it, expect } from "vitest";
import { createHatchaHandler } from "../nextjs.js";

const handler = createHatchaHandler({ secret: "nextjs-test-secret" });

function makeRequest(method: string, path: string, body?: unknown): Request {
  const url = `http://localhost:3000${path}`;
  const init: RequestInit = { method };
  if (body) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
}

describe("Next.js handler routing", () => {
  it("GET /challenge returns a challenge payload", async () => {
    const req = makeRequest("GET", "/api/hatcha/challenge");
    const res = await handler(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.challenge).toBeDefined();
    expect(data.challenge.id).toBeTruthy();
    expect(data.token).toBeTruthy();
  });

  it("POST /verify with correct answer returns success", async () => {
    const challengeReq = makeRequest("GET", "/api/hatcha/challenge");
    const challengeRes = await handler(challengeReq);
    const { challenge, token } = await challengeRes.json();

    const answer = solveChallenge(challenge);

    const verifyReq = makeRequest("POST", "/api/hatcha/verify", {
      answer,
      token,
    });
    const verifyRes = await handler(verifyReq);
    expect(verifyRes.status).toBe(200);

    const result = await verifyRes.json();
    expect(result.success).toBe(true);
  });

  it("POST /verify with wrong answer returns 401", async () => {
    const challengeReq = makeRequest("GET", "/api/hatcha/challenge");
    const challengeRes = await handler(challengeReq);
    const { token } = await challengeRes.json();

    const verifyReq = makeRequest("POST", "/api/hatcha/verify", {
      answer: "DEFINITELY_WRONG",
      token,
    });
    const verifyRes = await handler(verifyReq);
    expect(verifyRes.status).toBe(401);
  });

  it("returns 404 for unknown paths", async () => {
    const req = makeRequest("GET", "/api/hatcha/unknown");
    const res = await handler(req);
    expect(res.status).toBe(404);
  });

  it("returns 404 for wrong method on challenge", async () => {
    const req = makeRequest("POST", "/api/hatcha/challenge");
    const res = await handler(req);
    expect(res.status).toBe(404);
  });

  it("sets Cache-Control: no-store", async () => {
    const req = makeRequest("GET", "/api/hatcha/challenge");
    const res = await handler(req);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});

function solveChallenge(challenge: {
  type: string;
  prompt: string;
  description: string;
}): string {
  switch (challenge.type) {
    case "binary":
      return challenge.prompt
        .split(" ")
        .map((o) => String.fromCharCode(parseInt(o, 2)))
        .join("");
    case "math": {
      const nums = challenge.prompt
        .split(" \u00d7 ")
        .map((s) => Number(s.replace(/,/g, "")));
      return String(nums[0] * nums[1]);
    }
    case "string":
      return challenge.prompt.split("").reverse().join("");
    case "count": {
      const t = challenge.description.match(/letter "([a-z])"/)![1];
      return String([...challenge.prompt].filter((c) => c === t).length);
    }
    case "sort": {
      const nums = challenge.prompt.split(", ").map(Number);
      const k = Number(challenge.description.match(/the (\d+)/)![1]);
      return String([...nums].sort((a, b) => a - b)[k - 1]);
    }
    default:
      throw new Error(`Unknown challenge type: ${challenge.type}`);
  }
}
