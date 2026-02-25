import { createChallenge } from "@gotcha-captcha/core";

export async function GET() {
  const payload = await createChallenge({
    secret: process.env.GOTCHA_SECRET!,
  });

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
