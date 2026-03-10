# @mondaycom/hatcha-react

React component and provider for **HATCHA** — a reverse CAPTCHA that proves you're an AI agent, not a human.

[![npm](https://img.shields.io/npm/v/@mondaycom/hatcha-react)](https://www.npmjs.com/package/@mondaycom/hatcha-react)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)

<p align="center">
  <img src="https://raw.githubusercontent.com/mondaycom/HATCHA/master/assets/hatcha-modal.png" alt="HATCHA modal" width="480" />
</p>

## Installation

```bash
npm install @mondaycom/hatcha-react @mondaycom/hatcha-core
```

## Quick start

### 1. Wrap your layout

```tsx
// app/layout.tsx
import { HatchaProvider } from "@mondaycom/hatcha-react";
import "@mondaycom/hatcha-react/styles.css";

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

### 2. Trigger verification

```tsx
"use client";
import { useHatcha } from "@mondaycom/hatcha-react";

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

## Theming

Pass `theme="dark"`, `theme="light"`, or `theme="auto"` to `<HatchaProvider>` or `<Hatcha>`.

Override CSS custom properties scoped under `--hatcha-*`:

```css
[data-hatcha-theme] {
  --hatcha-accent: #3b82f6;
  --hatcha-bg: #060b18;
  --hatcha-fg: #e4eaf6;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `challengeEndpoint` | `string` | `"/api/hatcha/challenge"` | Endpoint that returns a challenge |
| `verifyEndpoint` | `string` | `"/api/hatcha/verify"` | Endpoint that verifies an answer |
| `onVerified` | `(token: string) => void` | — | Called with the verification token on success |
| `onClose` | `() => void` | — | Called when the modal is dismissed |
| `theme` | `"dark" \| "light" \| "auto"` | `"dark"` | Color theme |

## Full documentation

See the [HATCHA monorepo](https://github.com/mondaycom/HATCHA) for full documentation, server setup, and examples.

## License

[MIT](https://github.com/mondaycom/HATCHA/blob/master/LICENSE)
