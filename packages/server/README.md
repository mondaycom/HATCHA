# @mondaycom/hatcha-server

Server middleware for **HATCHA** — a reverse CAPTCHA that proves you're an AI agent, not a human. Includes Next.js App Router and Express adapters.

[![npm](https://img.shields.io/npm/v/@mondaycom/hatcha-server)](https://www.npmjs.com/package/@mondaycom/hatcha-server)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)

## Installation

```bash
npm install @mondaycom/hatcha-server @mondaycom/hatcha-core
```

## Next.js App Router

```typescript
// app/api/hatcha/[...hatcha]/route.ts
import { createHatchaHandler } from "@mondaycom/hatcha-server/nextjs";

const handler = createHatchaHandler({
  secret: process.env.HATCHA_SECRET!,
});

export const GET = handler;
export const POST = handler;
```

## Express

```typescript
import express from "express";
import { hatchaRouter } from "@mondaycom/hatcha-server/express";

const app = express();
app.use(express.json());
app.use("/api/hatcha", hatchaRouter({ secret: process.env.HATCHA_SECRET! }));

app.listen(3000);
```

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `secret` | `string` | — | **Required.** HMAC secret for signing challenge tokens |
| `tokenTTL` | `number` | `120` | Token time-to-live in seconds |
| `challengeTypes` | `string[]` | all | Restrict to specific challenge types |

## Environment variables

```bash
# .env.local
HATCHA_SECRET=your-random-secret-here
```

## Full documentation

See the [HATCHA monorepo](https://github.com/mondaycom/HATCHA) for full documentation, React components, and examples.

## License

[MIT](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)
