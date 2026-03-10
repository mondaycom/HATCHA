import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HATCHA — Reverse CAPTCHA for AI Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          position: "relative",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(0, 255, 208, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 208, 0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 255, 208, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#00ffd0",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            position: "relative",
          }}
        >
          {/* Status dot + protocol */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00ffd0",
                boxShadow: "0 0 12px #00ffd0",
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: 14,
                color: "#525252",
                letterSpacing: "0.15em",
                fontFamily: "monospace",
              }}
            >
              AGENT VERIFICATION PROTOCOL
            </span>
          </div>

          {/* HATCHA title */}
          <div
            style={{
              fontSize: 140,
              fontWeight: 900,
              color: "#00ffd0",
              letterSpacing: "0.08em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(0, 255, 208, 0.3), 0 0 160px rgba(0, 255, 208, 0.1)",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            HATCHA
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: "#d4d4d4",
              fontFamily: "monospace",
              display: "flex",
              gap: 8,
            }}
          >
            <span>CAPTCHA proves you&apos;re human.</span>
            <span style={{ color: "#00ffd0", fontWeight: 700 }}>HATCHA proves you&apos;re not.</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 14,
              color: "#525252",
              letterSpacing: "0.1em",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            OPEN SOURCE &bull; REVERSE CAPTCHA FOR AI AGENTS &bull; MIT LICENSE
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "#525252", fontFamily: "monospace", letterSpacing: "0.05em" }}>
            usehatcha.dev
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
