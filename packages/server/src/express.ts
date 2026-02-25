import {
  handleChallenge,
  handleVerify,
  type GotchaServerConfig,
} from "./handler.js";

/**
 * Create an Express router for GOTCHA.
 *
 * Usage:
 *
 *   import express from "express";
 *   import { gotchaRouter } from "@gotcha-captcha/server/express";
 *
 *   const app = express();
 *   app.use(express.json());
 *   app.use("/api/gotcha", gotchaRouter({ secret: process.env.GOTCHA_SECRET! }));
 *
 * Returns a function(app) that registers GET /challenge and POST /verify.
 */
export function gotchaRouter(config: GotchaServerConfig) {
  /* Return a standard middleware/router factory that works without
     importing Express as a dependency. We use the raw (req, res, next)
     signature so this package stays dependency-free. */
  return function middleware(
    req: { method: string; url: string; body?: unknown },
    res: {
      status: (code: number) => { json: (data: unknown) => void };
      setHeader: (name: string, value: string) => void;
    },
    next?: () => void,
  ) {
    const path = req.url.split("?")[0].replace(/\/$/, "");

    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET" && path === "/challenge") {
      handleChallenge(config)
        .then((payload) => res.status(200).json(payload))
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Challenge generation failed.";
          res.status(500).json({ error: message });
        });
      return;
    }

    if (req.method === "POST" && path === "/verify") {
      const body = req.body as { answer?: string; token?: string } | undefined;
      if (!body) {
        res.status(400).json({ error: "Missing request body." });
        return;
      }
      handleVerify(config, body)
        .then((result) => {
          const code = result.success ? 200 : 401;
          res.status(code).json(result);
        })
        .catch(() => {
          res.status(400).json({ error: "Invalid request." });
        });
      return;
    }

    if (next) next();
    else res.status(404).json({ error: "Not found." });
  };
}
