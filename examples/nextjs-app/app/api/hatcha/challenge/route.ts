import { createChallenge } from "@mondaycom/hatcha-core";
import { rateLimit } from "../../_rate-limit";

const limiter = rateLimit({ windowMs: 60_000, max: 30 });

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.check(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const payload = await createChallenge({
    secret: process.env.HATCHA_SECRET!,
  });

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}
