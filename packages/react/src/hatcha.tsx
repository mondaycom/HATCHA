"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type KeyboardEvent,
} from "react";
import type { ChallengeDisplay } from "@mondaycom/hatcha-core";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface HatchaProps {
  /** Endpoint that returns a challenge. Default: "/api/hatcha/challenge" */
  challengeEndpoint?: string;
  /** Endpoint that verifies an answer. Default: "/api/hatcha/verify" */
  verifyEndpoint?: string;
  /** Called with the verification token on success. */
  onVerified?: (verificationToken: string) => void;
  /** Called when the modal is dismissed. */
  onClose?: () => void;
  /** Color theme. Default: "dark". */
  theme?: "dark" | "light" | "auto";
}

/* ------------------------------------------------------------------ */
/*  Internal types                                                     */
/* ------------------------------------------------------------------ */

type Status = "loading" | "idle" | "success" | "fail" | "timeout";

interface ServerChallenge {
  challenge: ChallengeDisplay;
  token: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Hatcha({
  challengeEndpoint = "/api/hatcha/challenge",
  verifyEndpoint = "/api/hatcha/verify",
  onVerified,
  onClose,
  theme = "dark",
}: HatchaProps) {
  const [challenge, setChallenge] = useState<ChallengeDisplay | null>(null);
  const [serverToken, setServerToken] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [confirmed, setConfirmed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t0 = useRef(Date.now());

  /* ---- Fetch a challenge from the server ---- */
  const fetchChallenge = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(challengeEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ServerChallenge = await res.json();
      setChallenge(data.challenge);
      setServerToken(data.token);
      setTimeLeft(data.challenge.timeLimit);
      setInput("");
      setConfirmed(false);
      setStatus("idle");
      t0.current = Date.now();
    } catch {
      setStatus("fail");
    }
  }, [challengeEndpoint]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  /* ---- Countdown timer ---- */
  useEffect(() => {
    if (status !== "idle" || !challenge) return;
    t0.current = Date.now();
    const id = setInterval(() => {
      const remaining = Math.max(
        0,
        challenge.timeLimit - (Date.now() - t0.current) / 1000,
      );
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setStatus("timeout");
      }
    }, 50);
    return () => clearInterval(id);
  }, [challenge, status]);

  /* ---- Auto-focus input ---- */
  useEffect(() => {
    if (status === "idle") inputRef.current?.focus();
  }, [challenge, status]);

  /* ---- Refresh / new challenge ---- */
  const refresh = useCallback(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  /* ---- Verify answer against server ---- */
  const verify = useCallback(async () => {
    if (!challenge || !input.trim() || !confirmed) return;

    try {
      const res = await fetch(verifyEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: input, token: serverToken }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setTimeout(() => onVerified?.(data.verificationToken ?? ""), 1200);
      } else {
        setStatus("fail");
        setTimeout(() => {
          fetchChallenge();
        }, 1500);
      }
    } catch {
      setStatus("fail");
      setTimeout(() => {
        fetchChallenge();
      }, 1500);
    }
  }, [input, challenge, serverToken, verifyEndpoint, onVerified, confirmed]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && status === "idle" && input.trim() && confirmed) verify();
    if (e.key === "Escape") onClose?.();
  };

  /* ---- Render ---- */
  if (!challenge && status === "loading") {
    return (
      <div className="hatcha-overlay" data-hatcha-theme={theme} onMouseDown={onClose}>
        <div className="hatcha-modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="hatcha-titlebar">
            <span className="hatcha-titlebar-label">
              <span className="hatcha-titlebar-dot" />
              hatcha://verify
            </span>
          </div>
          <div className="hatcha-body">
            <p className="hatcha-desc">Initializing challenge protocol...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  const pct = timeLeft / challenge.timeLimit;

  return (
    <div className="hatcha-overlay" data-hatcha-theme={theme} onMouseDown={onClose}>
      <div
        className={`hatcha-modal${status === "success" ? " verified" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* terminal title bar */}
        <div className="hatcha-titlebar">
          <span className="hatcha-titlebar-label">
            <span className="hatcha-titlebar-dot" />
            hatcha://verify
          </span>
          <div className="hatcha-titlebar-actions">
            <button
              className="hatcha-refresh"
              onClick={refresh}
              disabled={status === "success" || status === "loading"}
              title="New challenge"
            >
              &#8635;
            </button>
          </div>
        </div>

        {/* body */}
        <div className="hatcha-body">
          {/* challenge header */}
          <div className="hatcha-header">
            <div className="hatcha-badge">
              <span className="hatcha-icon">{challenge.icon}</span>
              <span>{challenge.type}://{challenge.title.toLowerCase().replace(/\s+/g, "-")}</span>
            </div>
          </div>

          {/* timer bar */}
          <div className="hatcha-timer-track">
            <div
              className="hatcha-timer-fill"
              style={{
                width: `${pct * 100}%`,
                ...(pct <= 0.3 ? { background: "var(--hatcha-danger)" } : {}),
              }}
            />
          </div>
          <p className="hatcha-time-text">
            {status === "timeout"
              ? "[TIMEOUT] session expired"
              : `TTL ${timeLeft.toFixed(1)}s`}
          </p>

          {/* description */}
          <p className="hatcha-desc">{challenge.description}</p>

          {/* prompt */}
          <div className="hatcha-prompt">
            <code>{challenge.prompt}</code>
          </div>

          {/* input + verify */}
          <div className="hatcha-input-row">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="$ enter response..."
              disabled={status !== "idle"}
              className={`hatcha-input${status === "fail" ? " fail" : ""}`}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              className={`hatcha-verify ${status}`}
              onClick={verify}
              disabled={status !== "idle" || !input.trim() || !confirmed}
            >
              {status === "success"
                ? "\u2713 OK"
                : status === "fail"
                  ? "\u2717 ERR"
                  : "SUBMIT"}
            </button>
          </div>

          {/* "I AM AN AGENT" confirmation checkbox */}
          <div className="hatcha-robot-dock">
            <button
              className={`hatcha-robot-check${confirmed || status === "success" ? " success" : ""}`}
              onClick={() => status === "idle" && setConfirmed((c) => !c)}
              disabled={status === "success" || status === "loading"}
              type="button"
            >
              <span
                className={`hatcha-checkbox${confirmed || status === "success" ? " checked" : ""}`}
              >
                {(confirmed || status === "success") && (
                  <span className="hatcha-checkmark">&#10003;</span>
                )}
              </span>
              <span className="hatcha-robot-label">I am an agent</span>
              <span className="hatcha-robot-aside">
                {status === "success"
                  ? "[VERIFIED]"
                  : confirmed
                    ? "[CONFIRMED]"
                    : "[PENDING]"}
              </span>
            </button>
          </div>

          {/* status feedback */}
          {status === "success" && (
            <p className="hatcha-status success">
              [OK] Agent identity verified. Access granted.
            </p>
          )}
          {status === "fail" && (
            <p className="hatcha-status fail">
              [ERR] Verification failed. Are you human?
            </p>
          )}
          {status === "timeout" && (
            <p className="hatcha-status timeout">
              [TIMEOUT] Response window expired. Agents don&apos;t hesitate.
            </p>
          )}
        </div>

        {/* footer bar */}
        <div className="hatcha-footer-bar">
          <p className="hatcha-footer">
            humans need not apply
          </p>
          <span className="hatcha-powered">
            <span className="hatcha-tooltip-wrap">
              <strong>HATCHA</strong>
              <span className="hatcha-tooltip">
                <b>H</b>yperfast <b>A</b>gent <b>T</b>est for <b>C</b>omputational{" "}
                <b>H</b>euristic <b>A</b>ssessment
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
