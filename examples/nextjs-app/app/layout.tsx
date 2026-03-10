import { HatchaProvider } from "@mondaycom/hatcha-react";
import "@mondaycom/hatcha-react/styles.css";

export const metadata = {
  title: "HATCHA Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HatchaProvider>{children}</HatchaProvider>
      </body>
    </html>
  );
}
