import { verifyAnswer } from "@mondaycom/hatcha-core";
import { rateLimit } from "../../_rate-limit";

const limiter = rateLimit({ windowMs: 60_000, max: 20 });

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!limiter.check(ip)) {
    return Response.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let body: { answer?: string; token?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const { answer, token } = body;

  if (!answer || !token) {
    return Response.json(
      { success: false, error: "Missing answer or token." },
      { status: 400 },
    );
  }

  if (typeof answer !== "string" || answer.length > 1000) {
    return Response.json(
      { success: false, error: "Invalid answer." },
      { status: 400 },
    );
  }

  if (typeof token !== "string" || token.length > 2000) {
    return Response.json(
      { success: false, error: "Invalid token." },
      { status: 400 },
    );
  }

  const result = await verifyAnswer(
    { secret: process.env.HATCHA_SECRET! },
    answer,
    token,
  );

  return Response.json(result, {
    status: result.success ? 200 : 401,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}
