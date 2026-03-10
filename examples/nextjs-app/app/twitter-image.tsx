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
        {/* Grid */}
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
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 255, 208, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top accent */}
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#00ffd0",
              letterSpacing: "0.08em",
              lineHeight: 1,
              textShadow: "0 0 80px rgba(0, 255, 208, 0.3)",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            HATCHA
          </div>

          <div
            style={{
              fontSize: 22,
              color: "#d4d4d4",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            Reverse CAPTCHA for AI Agents
          </div>

          <div
            style={{
              fontSize: 14,
              color: "#525252",
              letterSpacing: "0.08em",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            usehatcha.dev
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
