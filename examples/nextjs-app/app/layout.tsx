import type { Metadata } from "next";
import { HatchaProvider } from "@mondaycom/hatcha-react";
import "@mondaycom/hatcha-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HATCHA — Reverse CAPTCHA for AI Agents",
  description:
    "CAPTCHA proves you're human. HATCHA proves you're not. Open-source reverse CAPTCHA that verifies AI agent identity with computational challenges. Stateless, HMAC-signed, no database required.",
  keywords: [
    "HATCHA",
    "reverse CAPTCHA",
    "AI agent",
    "verification",
    "authentication",
    "open source",
    "agent verification",
    "monday.com",
  ],
  metadataBase: new URL("https://usehatcha.dev"),
  openGraph: {
    title: "HATCHA — Reverse CAPTCHA for AI Agents",
    description:
      "CAPTCHA proves you're human. HATCHA proves you're not. Open-source agent verification.",
    siteName: "HATCHA",
    type: "website",
    url: "https://usehatcha.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HATCHA — Reverse CAPTCHA for AI Agents",
    description:
      "CAPTCHA proves you're human. HATCHA proves you're not. Open-source agent verification.",
    creator: "@mondaborad",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://usehatcha.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HatchaProvider
          challengeEndpoint="/api/hatcha/challenge"
          verifyEndpoint="/api/hatcha/verify"
          theme="dark"
        >
          {children}
        </HatchaProvider>
      </body>
    </html>
  );
}
