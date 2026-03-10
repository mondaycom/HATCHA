"use client";

import { useState, useCallback } from "react";
import { useHatcha } from "@mondaycom/hatcha-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const CHALLENGES = [
  { type: "math", icon: "\u00d7", desc: "5-digit \u00d7 5-digit multiplication", time: "30s" },
  { type: "string", icon: "\u2194", desc: "Reverse a 60\u201380 char random string", time: "30s" },
  { type: "count", icon: "#", desc: "Count a letter in ~250 characters", time: "30s" },
  { type: "sort", icon: "\u21c5", desc: "Find k-th smallest in 15 numbers", time: "30s" },
  { type: "binary", icon: "01", desc: "Decode binary octets to ASCII", time: "30s" },
];

const STEPS = [
  { num: "01", title: "Challenge", desc: "Server generates a challenge and HMAC-signs it. The answer never leaves the server." },
  { num: "02", title: "Solve", desc: "Agent receives the prompt and computes the answer. Trivial for machines, painful for humans." },
  { num: "03", title: "Verify", desc: "Answer is verified server-side against the signed token. Stateless \u2014 no database needed." },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { requestVerification } = useHatcha();
  const [verified, setVerified] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDemo = useCallback(() => {
    requestVerification((verificationToken) => {
      setVerified(true);
      console.log("Verified:", verificationToken);
    });
  }, [requestVerification]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText("npm install @mondaycom/hatcha-react @mondaycom/hatcha-server");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <>
      {/* Grid background */}
      <div className="grid-bg" />

      {/* ============ NAV ============ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem 2rem",
        background: "rgba(5, 5, 5, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--h-border)",
        animation: "fade-in 600ms ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "var(--h-accent)",
            boxShadow: "0 0 8px var(--h-accent)",
          }} />
          <span style={{
            fontFamily: "var(--h-display)", fontSize: "0.75rem",
            fontWeight: 800, letterSpacing: "0.15em",
            color: "var(--h-accent)", textTransform: "uppercase" as const,
          }}>HATCHA</span>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="#how-it-works" style={{ fontSize: "0.65rem", color: "var(--h-muted)", textDecoration: "none", letterSpacing: "0.05em", fontFamily: "var(--h-mono)" }}>How it works</a>
          <a href="#challenges" style={{ fontSize: "0.65rem", color: "var(--h-muted)", textDecoration: "none", letterSpacing: "0.05em", fontFamily: "var(--h-mono)" }}>Challenges</a>
          <a href="#quickstart" style={{ fontSize: "0.65rem", color: "var(--h-muted)", textDecoration: "none", letterSpacing: "0.05em", fontFamily: "var(--h-mono)" }}>Quickstart</a>
          <a
            href="https://github.com/mondaycom/HATCHA"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "0.6rem", color: "var(--h-accent)",
              textDecoration: "none", letterSpacing: "0.08em",
              fontFamily: "var(--h-display)", fontWeight: 700,
              textTransform: "uppercase" as const,
              padding: "0.35rem 0.75rem",
              border: "1px solid rgba(0, 255, 208, 0.2)",
              borderRadius: 3,
            }}
          >GitHub</a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "6rem 1.5rem 4rem", position: "relative", zIndex: 1,
        textAlign: "center",
      }}>
        {/* Accent glow behind title */}
        <div style={{
          position: "absolute", top: "25%", left: "50%",
          transform: "translateX(-50%)",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 255, 208, 0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          animation: "fade-up 800ms cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem",
        }}>
          {/* Protocol badge */}
          <span style={{
            fontFamily: "var(--h-mono)", fontSize: "0.55rem",
            letterSpacing: "0.12em", color: "var(--h-muted)",
            padding: "0.3rem 0.8rem",
            border: "1px solid var(--h-border-strong)",
            borderRadius: 3,
          }}>
            v0.1 &mdash; open source &mdash; MIT license
          </span>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--h-display)", fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 800, letterSpacing: "0.06em",
            color: "var(--h-accent)",
            textShadow: "0 0 60px rgba(0, 255, 208, 0.2), 0 0 120px rgba(0, 255, 208, 0.08)",
            lineHeight: 1,
          }}>HATCHA</h1>

          {/* Acronym */}
          <p style={{
            fontFamily: "var(--h-mono)", fontSize: "0.6rem",
            letterSpacing: "0.12em", color: "var(--h-muted)",
            textTransform: "uppercase" as const,
          }}>
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>H</span>yperfast{" "}
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>A</span>gent{" "}
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>T</span>est for{" "}
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>C</span>omputational{" "}
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>H</span>euristic{" "}
            <span style={{ color: "var(--h-accent)", fontWeight: 700 }}>A</span>ssessment
          </p>

          {/* Tagline */}
          <p style={{
            fontFamily: "var(--h-mono)", fontSize: "1rem",
            color: "var(--h-fg)", maxWidth: "38ch",
            lineHeight: 1.7, fontWeight: 400,
          }}>
            CAPTCHA proves you&apos;re human.
            <br />
            <strong style={{ color: "var(--h-accent)" }}>HATCHA</strong> proves you&apos;re not.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {verified ? (
              <div style={{
                padding: "0.7rem 1.5rem", borderRadius: 3,
                border: "1px solid rgba(0, 255, 136, 0.3)",
                background: "rgba(0, 255, 136, 0.04)",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <span style={{ color: "var(--h-success)", fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--h-display)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                  &#10003; Agent Verified
                </span>
              </div>
            ) : (
              <button
                onClick={handleDemo}
                style={{
                  padding: "0.7rem 1.8rem", borderRadius: 3,
                  border: "1px solid var(--h-accent)",
                  background: "transparent",
                  color: "var(--h-accent)",
                  fontFamily: "var(--h-display)",
                  fontSize: "0.7rem", fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  cursor: "pointer",
                  transition: "all 200ms",
                  animation: "glow-pulse 3s ease-in-out infinite",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "var(--h-accent)";
                  e.currentTarget.style.color = "var(--h-bg)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--h-accent)";
                }}
              >
                Try Live Demo
              </button>
            )}
            <a
              href="#quickstart"
              style={{
                padding: "0.7rem 1.8rem", borderRadius: 3,
                border: "1px solid var(--h-border-strong)",
                background: "transparent",
                color: "var(--h-muted)",
                fontFamily: "var(--h-display)",
                fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 200ms",
              }}
            >
              Get Started
            </a>
          </div>

          {/* Install command */}
          <button
            onClick={handleCopy}
            style={{
              marginTop: "1rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.5rem 1rem",
              background: "var(--h-surface)",
              border: "1px solid var(--h-border)",
              borderRadius: 3,
              cursor: "pointer",
              transition: "border-color 200ms",
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = "var(--h-border-strong)"; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--h-border)"; }}
          >
            <span style={{ color: "var(--h-accent)", fontSize: "0.65rem", fontFamily: "var(--h-mono)" }}>$</span>
            <code style={{ fontSize: "0.65rem", color: "var(--h-fg)", fontFamily: "var(--h-mono)", letterSpacing: "0.02em" }}>
              npm install @mondaycom/hatcha-react @mondaycom/hatcha-server
            </code>
            <span style={{ fontSize: "0.55rem", color: copied ? "var(--h-success)" : "var(--h-muted)", fontFamily: "var(--h-mono)", marginLeft: "0.25rem", minWidth: "3.5rem", textAlign: "right" as const }}>
              {copied ? "[copied]" : "[copy]"}
            </span>
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
          animation: "float 2.5s ease-in-out infinite",
        }}>
          <span style={{ fontSize: "0.55rem", color: "var(--h-muted)", fontFamily: "var(--h-mono)", letterSpacing: "0.1em" }}>
            scroll
          </span>
        </div>
      </section>

      <div className="divider" />

      {/* ============ WHY HATCHA ============ */}
      <section className="landing-section" style={{ animation: "fade-up 600ms ease both", animationDelay: "100ms" }}>
        <div className="section-label">The Problem</div>
        <h2 className="section-title">Agents need identity. CAPTCHA blocks them.</h2>
        <p className="section-desc" style={{ marginBottom: "2rem" }}>
          AI agents are becoming first-class users of the web. But every CAPTCHA treats them as threats.
          HATCHA flips the script &mdash; a verification challenge that&apos;s trivial for machines and
          impossible for humans. Gate agent-only features, verify automated workflows, or add a layer
          of computational proof to any interaction.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1px", background: "var(--h-border)", borderRadius: 4, overflow: "hidden",
          border: "1px solid var(--h-border)",
        }}>
          {[
            { label: "Stateless", value: "No database required. HMAC-signed tokens." },
            { label: "Fast", value: "Sub-second verification. No external API calls." },
            { label: "Extensible", value: "Register custom challenge types at runtime." },
          ].map((item) => (
            <div key={item.label} style={{
              background: "var(--h-surface)", padding: "1.25rem",
            }}>
              <div style={{
                fontFamily: "var(--h-display)", fontSize: "0.65rem",
                fontWeight: 700, color: "var(--h-accent)",
                letterSpacing: "0.1em", textTransform: "uppercase" as const,
                marginBottom: "0.5rem",
              }}>{item.label}</div>
              <div style={{
                fontSize: "0.7rem", color: "var(--h-muted)", lineHeight: 1.6,
              }}>{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="landing-section">
        <div className="section-label">Protocol</div>
        <h2 className="section-title">How it works</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "2rem" }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              display: "flex", gap: "1.25rem", alignItems: "flex-start",
              padding: "1.25rem", borderRadius: 4,
              border: "1px solid var(--h-border)",
              background: "var(--h-surface)",
              animation: "fade-up 600ms ease both",
              animationDelay: `${i * 100}ms`,
            }}>
              <span style={{
                fontFamily: "var(--h-display)", fontSize: "1.4rem",
                fontWeight: 800, color: "var(--h-accent)",
                opacity: 0.3, lineHeight: 1, minWidth: "2rem",
              }}>{step.num}</span>
              <div>
                <div style={{
                  fontFamily: "var(--h-display)", fontSize: "0.75rem",
                  fontWeight: 700, color: "var(--h-fg)",
                  letterSpacing: "0.05em", marginBottom: "0.35rem",
                  textTransform: "uppercase" as const,
                }}>{step.title}</div>
                <div style={{
                  fontSize: "0.7rem", color: "var(--h-muted)", lineHeight: 1.7,
                }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="code-window" style={{ marginTop: "2rem" }}>
          <div className="code-titlebar">
            <span className="code-dot" />
            hatcha://protocol-flow
          </div>
          <pre className="code-body" style={{ fontSize: "0.62rem", color: "var(--h-muted)" }}>{`Client                              Server
  │                                   │
  │  GET /api/hatcha/challenge        │
  │──────────────────────────────────►│
  │                                   │  Generate challenge
  │                                   │  Hash answer (SHA-256)
  │                                   │  HMAC-sign { hash, expiry }
  │  { challenge (no answer), token } │
  │◄──────────────────────────────────│
  │                                   │
  │  Agent solves the challenge       │
  │                                   │
  │  POST /api/hatcha/verify          │
  │  { answer, token }                │
  │──────────────────────────────────►│
  │                                   │  Verify HMAC signature
  │                                   │  Check expiry
  │                                   │  Compare answer hash
  │  { success, verificationToken }   │
  │◄──────────────────────────────────│`}</pre>
        </div>
      </section>

      <div className="divider" />

      {/* ============ CHALLENGES ============ */}
      <section id="challenges" className="landing-section">
        <div className="section-label">Challenge Types</div>
        <h2 className="section-title">5 built-in challenges</h2>
        <p className="section-desc" style={{ marginBottom: "2rem" }}>
          Each challenge is designed to be trivial for AI agents but painful for humans.
          Register your own custom types at runtime.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "0.5rem",
        }}>
          {CHALLENGES.map((c, i) => (
            <div key={c.type} style={{
              padding: "1.25rem 1rem",
              border: "1px solid var(--h-border)",
              borderRadius: 4,
              background: "var(--h-surface)",
              animation: "fade-up 500ms ease both",
              animationDelay: `${i * 80}ms`,
              transition: "border-color 200ms",
            }}
              onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--h-border-strong)"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--h-border)"; }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                marginBottom: "0.75rem",
              }}>
                <span style={{
                  width: "1.6rem", height: "1.6rem", borderRadius: 3,
                  background: "var(--h-accent-bg)",
                  border: "1px solid rgba(0, 255, 208, 0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.6rem", fontWeight: 800, color: "var(--h-accent)",
                  fontFamily: "var(--h-mono)",
                }}>{c.icon}</span>
                <span style={{
                  fontFamily: "var(--h-display)", fontSize: "0.65rem",
                  fontWeight: 700, color: "var(--h-fg)",
                  textTransform: "uppercase" as const, letterSpacing: "0.06em",
                }}>{c.type}</span>
              </div>
              <div style={{
                fontSize: "0.65rem", color: "var(--h-muted)",
                lineHeight: 1.6, marginBottom: "0.5rem",
              }}>{c.desc}</div>
              <div style={{
                fontSize: "0.55rem", color: "var(--h-accent-dim)",
                fontFamily: "var(--h-mono)", letterSpacing: "0.05em",
              }}>TTL {c.time}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ============ QUICKSTART ============ */}
      <section id="quickstart" className="landing-section">
        <div className="section-label">Quickstart</div>
        <h2 className="section-title">Up and running in 3 minutes</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem" }}>
          {/* Step 1: Install */}
          <div>
            <div style={{
              fontFamily: "var(--h-display)", fontSize: "0.6rem",
              fontWeight: 700, color: "var(--h-accent)",
              letterSpacing: "0.1em", marginBottom: "0.5rem",
              textTransform: "uppercase" as const,
            }}>01 &mdash; Install</div>
            <div className="code-window">
              <div className="code-titlebar"><span className="code-dot" />terminal</div>
              <div className="code-body">
                <span className="kw">$</span> npm install @mondaycom/hatcha-react @mondaycom/hatcha-server
              </div>
            </div>
          </div>

          {/* Step 2: API Route */}
          <div>
            <div style={{
              fontFamily: "var(--h-display)", fontSize: "0.6rem",
              fontWeight: 700, color: "var(--h-accent)",
              letterSpacing: "0.1em", marginBottom: "0.5rem",
              textTransform: "uppercase" as const,
            }}>02 &mdash; Add API Route</div>
            <div className="code-window">
              <div className="code-titlebar"><span className="code-dot" />app/api/hatcha/[...hatcha]/route.ts</div>
              <pre className="code-body">
                <span className="cmt">// One handler for both challenge + verify</span>{"\n"}
                <span className="kw">import</span> {"{ createHatchaHandler }"} <span className="kw">from</span> <span className="str">&quot;@mondaycom/hatcha-server/nextjs&quot;</span>{"\n"}
                {"\n"}
                <span className="kw">const</span> handler = <span className="fn">createHatchaHandler</span>({"{"}{"\n"}
                {"  "}secret: process.env.<span className="kw">HATCHA_SECRET</span>!,{"\n"}
                {"}"});{"\n"}
                {"\n"}
                <span className="kw">export const</span> GET = handler;{"\n"}
                <span className="kw">export const</span> POST = handler;
              </pre>
            </div>
          </div>

          {/* Step 3: Frontend */}
          <div>
            <div style={{
              fontFamily: "var(--h-display)", fontSize: "0.6rem",
              fontWeight: 700, color: "var(--h-accent)",
              letterSpacing: "0.1em", marginBottom: "0.5rem",
              textTransform: "uppercase" as const,
            }}>03 &mdash; Add to Your App</div>
            <div className="code-window">
              <div className="code-titlebar"><span className="code-dot" />app/layout.tsx</div>
              <pre className="code-body" dangerouslySetInnerHTML={{ __html:
`<span class="kw">import</span> { HatchaProvider } <span class="kw">from</span> <span class="str">"@mondaycom/hatcha-react"</span>
<span class="kw">import</span> <span class="str">"@mondaycom/hatcha-react/styles.css"</span>

<span class="kw">export default function</span> <span class="fn">RootLayout</span>({ children }) {
  <span class="kw">return</span> (
    &lt;<span class="fn">HatchaProvider</span>&gt;
      {children}
    &lt;/<span class="fn">HatchaProvider</span>&gt;
  );
}` }} />
            </div>

            <div className="code-window" style={{ marginTop: "0.5rem" }}>
              <div className="code-titlebar"><span className="code-dot" />your-component.tsx</div>
              <pre className="code-body" dangerouslySetInnerHTML={{ __html:
`<span class="kw">import</span> { useHatcha } <span class="kw">from</span> <span class="str">"@mondaycom/hatcha-react"</span>

<span class="kw">function</span> <span class="fn">AgentGate</span>() {
  <span class="kw">const</span> { requestVerification } = <span class="fn">useHatcha</span>();

  <span class="kw">return</span> (
    &lt;button <span class="fn">onClick</span>={() =&gt; <span class="fn">requestVerification</span>(<span class="fn">console.log</span>)}&gt;
      Enter Agent Mode
    &lt;/button&gt;
  );
}` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ============ FOOTER ============ */}
      <footer style={{
        position: "relative", zIndex: 1,
        maxWidth: 900, margin: "0 auto",
        padding: "3rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span style={{
            fontFamily: "var(--h-display)", fontSize: "0.7rem",
            fontWeight: 800, color: "var(--h-accent)",
            letterSpacing: "0.15em",
          }}>HATCHA</span>
          <span style={{
            fontSize: "0.55rem", color: "var(--h-muted)",
            fontFamily: "var(--h-mono)", letterSpacing: "0.03em",
          }}>humans need not apply</span>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a
            href="https://www.npmjs.com/package/@mondaycom/hatcha-core"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.6rem", color: "var(--h-muted)", textDecoration: "none", fontFamily: "var(--h-mono)" }}
          >npm</a>
          <a
            href="https://github.com/mondaycom/HATCHA"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "0.6rem", color: "var(--h-muted)", textDecoration: "none", fontFamily: "var(--h-mono)" }}
          >github</a>
          <span style={{
            fontSize: "0.55rem", color: "var(--h-muted)",
            fontFamily: "var(--h-mono)", letterSpacing: "0.03em",
          }}>MIT License</span>
        </div>
      </footer>
    </>
  );
}
