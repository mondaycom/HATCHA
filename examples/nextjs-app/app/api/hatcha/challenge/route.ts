import { createChallenge } from "@mondaydotcomorg/hatcha-core";

export async function GET() {
  const payload = await createChallenge({
    secret: process.env.HATCHA_SECRET!,
  });

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
