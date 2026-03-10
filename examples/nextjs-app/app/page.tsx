"use client";

import { useHatcha } from "@mondaycom/hatcha-react";

export default function Home() {
  const { requestVerification } = useHatcha();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>HATCHA Example</h1>
      <p>Click the button to trigger an agent verification challenge.</p>
      <button
        onClick={() => requestVerification((token) => console.log("Verified:", token))}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Verify Agent
      </button>
    </main>
  );
}
