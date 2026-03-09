<p align="center">
  <h1 align="center">HATCHA</h1>
  <p align="center"><strong>CAPTCHA proves you're human. HATCHA proves you're not.</strong></p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mondaydotcomorg/hatcha-core"><img src="https://img.shields.io/npm/v/@mondaydotcomorg/hatcha-core" alt="npm" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
  <a href="https://github.com/mondaycom/HATCHA/actions"><img src="https://github.com/mondaycom/HATCHA/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
</p>

---

HATCHA (**H**yperfast **A**gent **T**est for **C**omputational **H**euristic **A**ssessment) is a reverse CAPTCHA that gates access behind challenges trivial for AI agents but painful for humans — large-number multiplication, string reversal, binary decoding, and more.

- **Server-side verification** — answers never reach the client. HMAC-signed tokens, stateless, no database required.
- **5 built-in challenge types** — math, string reversal, character counting, sorting, binary decode.
- **Extensible** — register custom challenge generators at runtime.
- **Themeable** — dark, light, or auto mode via CSS custom properties.
- **Framework adapters** — Next.js App Router and Express middleware out of the box.

## Quickstart (Next.js)

### 1. Install

```bash
npm install @mondaydotcomorg/hatcha-react @mondaydotcomorg/hatcha-server
```

### 2. Add the API route

```typescript
// app/api/hatcha/[...hatcha]/route.ts
import { createHatchaHandler } from "@mondaydotcomorg/hatcha-server/nextjs";

const handler = createHatchaHandler({
  secret: process.env.HATCHA_SECRET!,
});

export const GET = handler;
export const POST = handler;
```

### 3. Wrap your layout

```tsx
// app/layout.tsx
import { HatchaProvider } from "@mondaydotcomorg/hatcha-react";
import "@mondaydotcomorg/hatcha-react/styles.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <HatchaProvider>{children}</HatchaProvider>
      </body>
    </html>
  );
}
```

### 4. Trigger verification

```tsx
"use client";
import { useHatcha } from "@mondaydotcomorg/hatcha-react";

function AgentModeButton() {
  const { requestVerification } = useHatcha();

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
HATCHA_SECRET=your-random-secret-here
```

## How it works

```
Client                            Server
  │                                 │
  │  GET /api/hatcha/challenge      │
  │────────────────────────────────►│
  │                                 │  Generate challenge
  │                                 │  Hash answer
  │                                 │  HMAC-sign { hash, expiry }
  │  { challenge (no answer), token }
  │◄────────────────────────────────│
  │                                 │
  │  Agent solves the challenge     │
  │                                 │
  │  POST /api/hatcha/verify        │
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
| `math` | × | 5-digit × 5-digit multiplication | 30 s |
| `string` | ↔ | Reverse a 60–80 character random string | 30 s |
| `count` | # | Count a specific character in ~250 characters | 30 s |
| `sort` | ⇅ | Sort 15 numbers, return the k-th smallest | 30 s |
| `binary` | 01 | Decode binary octets to ASCII | 30 s |

## Custom challenges

```typescript
import { registerChallenge } from "@mondaydotcomorg/hatcha-server";

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
        timeLimit: 30,
        answer: String(n),
      },
      answer: String(n),
    };
  },
});
```

## Theming

HATCHA uses CSS custom properties scoped under `--hatcha-*`. Override them on any parent element:

```css
[data-hatcha-theme] {
  --hatcha-accent: #3b82f6;
  --hatcha-accent-light: #60a5fa;
  --hatcha-bg: #060b18;
  --hatcha-fg: #e4eaf6;
  --hatcha-success: #22c55e;
  --hatcha-danger: #ef4444;
}
```

Pass `theme="dark"`, `theme="light"`, or `theme="auto"` to `<HatchaProvider>` or `<Hatcha>`.

## Express

```typescript
import express from "express";
import { hatchaRouter } from "@mondaydotcomorg/hatcha-server/express";

const app = express();
app.use(express.json());
app.use("/api/hatcha", hatchaRouter({ secret: process.env.HATCHA_SECRET! }));

app.listen(3000);
```

## Packages

| Package | Description |
|---------|-------------|
| [`@mondaydotcomorg/hatcha-core`](./packages/core) | Challenge generation and cryptographic verification |
| [`@mondaydotcomorg/hatcha-react`](./packages/react) | React component, provider, and styles |
| [`@mondaydotcomorg/hatcha-server`](./packages/server) | Next.js and Express server handlers |

## Development

```bash
git clone https://github.com/mondaycom/HATCHA.git
cd HATCHA
pnpm install
pnpm build
cd examples/nextjs-app
pnpm dev
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions and guidelines.

## License

[MIT](./LICENSE)
