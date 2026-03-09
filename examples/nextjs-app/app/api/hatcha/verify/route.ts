import { verifyAnswer } from "@mondaydotcomorg/hatcha-core";

export async function POST(request: Request) {
  const body = await request.json();
  const { answer, token } = body;

  if (!answer || !token) {
    return Response.json(
      { success: false, error: "Missing answer or token." },
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
    headers: { "Cache-Control": "no-store" },
  });
}
