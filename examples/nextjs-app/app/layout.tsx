import type { Metadata } from "next";
import { HatchaProvider } from "@mondaydotcomorg/hatcha-react";
import "@mondaydotcomorg/hatcha-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HATCHA Demo",
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
