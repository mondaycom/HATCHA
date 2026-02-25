import type { Metadata } from "next";
import { GotchaProvider } from "@gotcha-captcha/react";
import "@gotcha-captcha/react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOTCHA Demo",
  description: "Reverse CAPTCHA that proves you're not human",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GotchaProvider
          challengeEndpoint="/api/gotcha/challenge"
          verifyEndpoint="/api/gotcha/verify"
          theme="dark"
        >
          {children}
        </GotchaProvider>
      </body>
    </html>
  );
}
