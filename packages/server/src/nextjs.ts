import {
  handleChallenge,
  handleVerify,
  type GotchaServerConfig,
} from "./handler.js";

/**
 * Create a Next.js App Router handler for GOTCHA.
 *
 * Usage (app/api/gotcha/[...gotcha]/route.ts):
 *
 *   import { createGotchaHandler } from "@gotcha-captcha/server/nextjs";
 *
 *   const handler = createGotchaHandler({
 *     secret: process.env.GOTCHA_SECRET!,
 *   });
 *
 *   export const GET = handler;
 *   export const POST = handler;
 */
export function createGotchaHandler(config: GotchaServerConfig) {
  return async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const action = segments[segments.length - 1];

    const headers = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    };

    if (request.method === "GET" && action === "challenge") {
      try {
        const payload = await handleChallenge(config);
        return new Response(JSON.stringify(payload), { status: 200, headers });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Challenge generation failed.";
        return new Response(
          JSON.stringify({ error: message }),
          { status: 500, headers },
        );
      }
    }

    if (request.method === "POST" && action === "verify") {
      try {
        const body = await request.json();
        const result = await handleVerify(config, body);
        const status = result.success ? 200 : 401;
        return new Response(JSON.stringify(result), { status, headers });
      } catch {
        return new Response(
          JSON.stringify({ error: "Invalid request body." }),
          { status: 400, headers },
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Not found." }),
      { status: 404, headers },
    );
  };
}
