<p align="center">
  <h1 align="center">GOTCHA</h1>
  <p align="center"><strong>CAPTCHA proves you're human. GOTCHA proves you're not.</strong></p>
</p>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
</p>

---

GOTCHA (**G**ate-**O**nly **T**est for **C**omputational **H**yperfast **A**gents) is a reverse CAPTCHA that gates access behind challenges trivial for AI agents but painful for humans — large-number multiplication, string reversal, binary decoding, and more.

- **Server-side verification** — answers never reach the client. HMAC-signed tokens, stateless, no database required.
- **6 built-in challenge types** — math, string reversal, character counting, expression evaluation, sorting, binary decode.
- **Extensible** — register custom challenge generators at runtime.
- **Themeable** — dark, light, or auto mode via CSS custom properties.
- **Framework adapters** — Next.js App Router and Express middleware out of the box.

## Quickstart (Next.js)

### 1. Install

```bash
npm install @gotcha-captcha/react @gotcha-captcha/server
```

### 2. Add the API route

```typescript
// app/api/gotcha/[...gotcha]/route.ts
import { createGotchaHandler } from "@gotcha-captcha/server/nextjs";

const handler = createGotchaHandler({
  secret: process.env.GOTCHA_SECRET!,
});

export const GET = handler;
export const POST = handler;
```

### 3. Wrap your layout

```tsx
// app/layout.tsx
import { GotchaProvider } from "@gotcha-captcha/react";
import "@gotcha-captcha/react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GotchaProvider>{children}</GotchaProvider>
      </body>
    </html>
  );
}
```

### 4. Trigger verification

```tsx
"use client";
import { useGotcha } from "@gotcha-captcha/react";

function AgentModeButton() {
  const { requestVerification } = useGotcha();

  return (
    <button
      onClick={() =>
        requestVerification((token) => {
          console.log("Agent verified!", token);
        })
      }
    >
      Enter Agent Mode
    </button>
  );
}
```

### 5. Set your secret

```bash
# .env.local
GOTCHA_SECRET=your-random-secret-here
```

## How it works

```
Client                            Server
  │                                 │
  │  GET /api/gotcha/challenge      │
  │────────────────────────────────►│
  │                                 │  Generate challenge
  │                                 │  Hash answer
  │                                 │  HMAC-sign { hash, expiry }
  │  { challenge (no answer), token }
  │◄────────────────────────────────│
  │                                 │
  │  Agent solves the challenge     │
  │                                 │
  │  POST /api/gotcha/verify        │
  │  { answer, token }              │
  │────────────────────────────────►│
  │                                 │  Verify HMAC signature
  │                                 │  Check expiry
  │                                 │  Compare answer hash
  │  { success, verificationToken } │
  │◄────────────────────────────────│
```

The answer **never** reaches the client. The signed token is opaque and contains only a hashed answer + expiry. Verification is stateless — no database needed.

## Challenge types

| Type | Icon | What it does | Time limit |
|------|------|-------------|------------|
| `math` | × | 5-digit × 5-digit multiplication | 15 s |
| `string` | ↔ | Reverse a 60–80 character random string | 15 s |
| `count` | # | Count a specific character in ~250 characters | 15 s |
| `expression` | f(x) | Evaluate `(a × b) + (c × d) − e` | 15 s |
| `sort` | ⇅ | Sort 15 numbers, return the k-th smallest | 15 s |
| `binary` | 01 | Decode binary octets to ASCII | 15 s |

## Custom challenges

```typescript
import { registerChallenge } from "@gotcha-captcha/server";

registerChallenge({
  type: "hex",
  generate() {
    const n = Math.floor(Math.random() * 0xffffff);
    return {
      display: {
        type: "hex",
        icon: "0x",
        title: "Hex Decode",
        description: "Convert this hex number to decimal.",
        prompt: `0x${n.toString(16).toUpperCase()}`,
        timeLimit: 15,
        answer: String(n),
      },
      answer: String(n),
    };
  },
});
```

## Theming

GOTCHA uses CSS custom properties scoped under `--gotcha-*`. Override them on any parent element:

```css
[data-gotcha-theme] {
  --gotcha-accent: #3b82f6;
  --gotcha-accent-light: #60a5fa;
  --gotcha-bg: #060b18;
  --gotcha-fg: #e4eaf6;
  --gotcha-success: #22c55e;
  --gotcha-danger: #ef4444;
}
```

Pass `theme="dark"`, `theme="light"`, or `theme="auto"` to `<GotchaProvider>` or `<Gotcha>`.

## Express

```typescript
import express from "express";
import { gotchaRouter } from "@gotcha-captcha/server/express";

const app = express();
app.use(express.json());
app.use("/api/gotcha", gotchaRouter({ secret: process.env.GOTCHA_SECRET! }));

app.listen(3000);
```

## Packages

| Package | Description |
|---------|-------------|
| [`@gotcha-captcha/core`](./packages/core) | Challenge generation and cryptographic verification |
| [`@gotcha-captcha/react`](./packages/react) | React component, provider, and styles |
| [`@gotcha-captcha/server`](./packages/server) | Next.js and Express server handlers |

## Development

```bash
git clone https://github.com/mondaycom/gotcha-captcha.git
cd gotcha-captcha
pnpm install
pnpm build
cd examples/nextjs-app
pnpm dev
```

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

## License

[MIT](./LICENSE)
