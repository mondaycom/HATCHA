import { createHatchaHandler } from "@mondaycom/hatcha-server/nextjs";

const handler = createHatchaHandler({
  secret: process.env.HATCHA_SECRET!,
});

export const GET = handler;
export const POST = handler;
