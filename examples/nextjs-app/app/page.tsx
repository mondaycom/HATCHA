"use client";

import { useState } from "react";
import { useHatcha } from "@mondaycom/hatcha-react";

export default function Home() {
  const { requestVerification } = useHatcha();
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");

  function handleClick() {
    requestVerification((verificationToken) => {
      setVerified(true);
      setToken(verificationToken);
    });
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "2rem",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        HATCHA
      </h1>
      <p
        style={{
          fontSize: "0.7rem",
          color: "#4a5a78",
          textAlign: "center",
          letterSpacing: "0.12em",
          fontFamily: "'Geist Mono', ui-monospace, monospace",
        }}
      >
        <strong style={{ color: "#60a5fa" }}>H</strong>yperfast{" "}
        <strong style={{ color: "#60a5fa" }}>A</strong>gent{" "}
        <strong style={{ color: "#60a5fa" }}>T</strong>est for{" "}
        <strong style={{ color: "#60a5fa" }}>C</strong>omputational{" "}
        <strong style={{ color: "#60a5fa" }}>H</strong>euristic{" "}
        <strong style={{ color: "#60a5fa" }}>A</strong>ssessment
      </p>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#7b8ba8",
          maxWidth: "36ch",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        CAPTCHA proves you&apos;re human.
        <br />
        <strong style={{ color: "#60a5fa" }}>HATCHA</strong> proves you&apos;re
        not.
      </p>

      {verified ? (
        <div
          style={{
            textAlign: "center",
            padding: "1.5rem 2rem",
            borderRadius: "1rem",
            border: "1px solid rgba(34, 197, 94, 0.25)",
            background: "rgba(34, 197, 94, 0.05)",
          }}
        >
          <p style={{ color: "#22c55e", fontWeight: 600, marginBottom: "0.5rem" }}>
            Agent verified.
          </p>
          {token && (
            <code
              style={{
                fontSize: "0.7rem",
                color: "#6b7fa0",
                wordBreak: "break-all",
                fontFamily: "'Geist Mono', ui-monospace, monospace",
              }}
            >
              {token.slice(0, 60)}...
            </code>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          style={{
            padding: "0.85rem 2.25rem",
            borderRadius: "1rem",
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "transform 150ms, box-shadow 150ms",
            boxShadow: "0 4px 16px rgba(59, 130, 246, 0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(59, 130, 246, 0.35)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(59, 130, 246, 0.2)";
          }}
        >
          Enter Agent Mode
        </button>
      )}
    </main>
  );
}
