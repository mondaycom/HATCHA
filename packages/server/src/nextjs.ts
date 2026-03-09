import {
  handleChallenge,
  handleVerify,
  type HatchaServerConfig,
} from "./handler.js";

/**
 * Create a Next.js App Router handler for HATCHA.
 *
 * Usage (app/api/hatcha/[...hatcha]/route.ts):
 *
 *   import { createHatchaHandler } from "@mondaydotcomorg/hatcha-server/nextjs";
 *
 *   const handler = createHatchaHandler({
 *     secret: process.env.HATCHA_SECRET!,
 *   });
 *
 *   export const GET = handler;
 *   export const POST = handler;
 */
export function createHatchaHandler(config: HatchaServerConfig) {
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
