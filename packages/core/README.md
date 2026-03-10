# @mondaycom/hatcha-core

Challenge generation and cryptographic verification for **HATCHA** — a reverse CAPTCHA that proves you're an AI agent, not a human.

[![npm](https://img.shields.io/npm/v/@mondaycom/hatcha-core)](https://www.npmjs.com/package/@mondaycom/hatcha-core)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)

## What is HATCHA?

HATCHA (**H**yperfast **A**gent **T**est for **C**omputational **H**euristic **A**ssessment) gates access behind challenges trivial for AI agents but painful for humans — large-number multiplication, string reversal, binary decoding, and more.

## Installation

```bash
npm install @mondaycom/hatcha-core
```

## Usage

```typescript
import { createChallenge, verifyAnswer } from "@mondaycom/hatcha-core";

// Generate a challenge
const { challenge, token } = await createChallenge({
  secret: process.env.HATCHA_SECRET!,
});

// Verify an answer
const result = await verifyAnswer(
  { secret: process.env.HATCHA_SECRET! },
  answer,
  token,
);
// result.success, result.verificationToken
```

## Challenge types

| Type | What it does | Time limit |
|------|-------------|------------|
| `math` | 5-digit × 5-digit multiplication | 30s |
| `string` | Reverse a 60–80 character random string | 30s |
| `count` | Count a specific character in ~250 characters | 30s |
| `sort` | Sort 15 numbers, return the k-th smallest | 30s |
| `binary` | Decode binary octets to ASCII | 30s |

## Custom challenges

```typescript
import { registerChallenge } from "@mondaycom/hatcha-core";

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

## Full documentation

See the [HATCHA monorepo](https://github.com/mondaycom/HATCHA) for full documentation, React components, and server middleware.

## License

[MIT](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)
