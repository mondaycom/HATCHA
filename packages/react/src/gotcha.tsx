"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type KeyboardEvent,
} from "react";
import type { ChallengeDisplay } from "@gotcha-captcha/core";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

export interface GotchaProps {
  /** Endpoint that returns a challenge. Default: "/api/gotcha/challenge" */
  challengeEndpoint?: string;
  /** Endpoint that verifies an answer. Default: "/api/gotcha/verify" */
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

const STRIKES_TO_REVEAL = 3;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function Gotcha({
  challengeEndpoint = "/api/gotcha/challenge",
  verifyEndpoint = "/api/gotcha/verify",
  onVerified,
  onClose,
  theme = "dark",
}: GotchaProps) {
  const [challenge, setChallenge] = useState<ChallengeDisplay | null>(null);
  const [serverToken, setServerToken] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [strikes, setStrikes] = useState(0);
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
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
      setStatus("idle");
      t0.current = Date.now();
    } catch {
      setStatus("fail");
    }
  }, [challengeEndpoint]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  /* ---- Dodging "I AM A ROBOT" checkbox ---- */
  const movedRight = useRef(false);
  const [dodgeInstant, setDodgeInstant] = useState(false);
  const handleDodge = useCallback(() => {
    if (status === "success") return;
    setDodgeInstant(true);
    movedRight.current = !movedRight.current;
    setDodge({ x: movedRight.current ? 80 : 0, y: 0 });
    setDodgeCount((c) => c + 1);
    requestAnimationFrame(() => setDodgeInstant(false));
  }, [status]);

  const showHumanEscape = strikes >= STRIKES_TO_REVEAL;

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
        setStrikes((s) => s + 1);
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
    setStrikes((s) => s + 1);
    fetchChallenge();
  }, [fetchChallenge]);

  /* ---- Verify answer against server ---- */
  const verify = useCallback(async () => {
    if (!challenge || !input.trim()) return;

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
        setStrikes((s) => s + 1);
        setTimeout(() => {
          setStatus("idle");
          setInput("");
        }, 1500);
      }
    } catch {
      setStatus("fail");
      setStrikes((s) => s + 1);
    }
  }, [input, challenge, serverToken, verifyEndpoint, onVerified]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && status === "idle" && input.trim()) verify();
    if (e.key === "Escape") onClose?.();
  };

  /* ---- Render ---- */
  if (!challenge && status === "loading") {
    return (
      <div className="gotcha-overlay" data-gotcha-theme={theme} onMouseDown={onClose}>
        <div className="gotcha-modal" onMouseDown={(e) => e.stopPropagation()}>
          <p className="gotcha-desc">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  const pct = timeLeft / challenge.timeLimit;

  return (
    <div className="gotcha-overlay" data-gotcha-theme={theme} onMouseDown={onClose}>
      <div
        className={`gotcha-modal${status === "success" ? " verified" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* challenge header */}
        <div className="gotcha-header">
          <div className="gotcha-badge">
            <span className="gotcha-icon">{challenge.icon}</span>
            <span>{challenge.title}</span>
          </div>
          <button
            className="gotcha-refresh"
            onClick={refresh}
            disabled={status === "success" || status === "loading"}
            title="New challenge"
          >
            &#8635;
          </button>
        </div>

        {/* timer bar */}
        <div className="gotcha-timer-track">
          <div
            className="gotcha-timer-fill"
            style={{
              width: `${pct * 100}%`,
              ...(pct <= 0.3 ? { background: "var(--gotcha-danger, #ef4444)" } : {}),
            }}
          />
        </div>
        <p className="gotcha-time-text">
          {status === "timeout"
            ? "Time\u2019s up!"
            : `${timeLeft.toFixed(1)}s remaining`}
        </p>

        {/* description */}
        <p className="gotcha-desc">{challenge.description}</p>

        {/* prompt */}
        <div className="gotcha-prompt">
          <code>{challenge.prompt}</code>
        </div>

        {/* "I AM A ROBOT" checkbox */}
        <div className="gotcha-robot-dock">
          <button
            className={`gotcha-robot-check${status === "success" ? " success" : ""}${status === "fail" ? " fail" : ""}`}
            onClick={verify}
            type="button"
            style={{
              transform:
                status === "success"
                  ? "translate(0, 0)"
                  : `translate(${dodge.x}px, ${dodge.y}px)`,
              transition: dodgeInstant
                ? "none"
                : "transform 200ms cubic-bezier(0.19, 1, 0.22, 1), border-color 250ms, background 250ms, box-shadow 250ms",
            }}
          >
            <span
              className={`gotcha-checkbox${status === "success" ? " checked" : ""}`}
              onMouseEnter={handleDodge}
            >
              {status === "success" && (
                <span className="gotcha-checkmark">&#10003;</span>
              )}
            </span>
            <span className="gotcha-robot-label">I AM A ROBOT</span>
            <span className="gotcha-robot-aside">
              {status === "success"
                ? "confirmed."
                : dodgeCount > 4
                  ? "too slow, human!"
                  : dodgeCount > 1
                    ? "can\u2019t catch me!"
                    : "click to prove it."}
            </span>
          </button>
        </div>

        {/* input + verify */}
        <div className="gotcha-input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Enter answer\u2026"
            disabled={status !== "idle"}
            className="gotcha-input"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            className={`gotcha-verify ${status}`}
            onClick={verify}
            disabled={status !== "idle" || !input.trim()}
          >
            {status === "success"
              ? "\u2713"
              : status === "fail"
                ? "\u2717"
                : "Verify"}
          </button>
        </div>

        {/* status feedback */}
        {status === "success" && (
          <p className="gotcha-status success">
            Agent verified. Access granted.
          </p>
        )}
        {status === "fail" && (
          <p className="gotcha-status fail">Incorrect. Are you human?</p>
        )}
        {status === "timeout" && (
          <p className="gotcha-status timeout">
            Too slow. Agents don&apos;t hesitate.
          </p>
        )}

        {/* human escape hatch */}
        {showHumanEscape && (
          <button
            className="gotcha-human-btn"
            onClick={() => onVerified?.("")}
          >
            &#128591; I&apos;m a human, but I&apos;m curious &mdash; let me peek
          </button>
        )}

        {/* footer */}
        <p className="gotcha-footer">
          {showHumanEscape
            ? "Fine, we\u2019ll let you through. This time."
            : "Prove you\u2019re not human \u2014 only agents may pass."}
        </p>
        <p className="gotcha-footer gotcha-powered">
          powered by{" "}
          <span className="gotcha-tooltip-wrap">
            <strong>GOTCHA</strong>
            <span className="gotcha-tooltip">
              <b>G</b>ate-<b>O</b>nly <b>T</b>est for <b>C</b>omputational{" "}
              <b>H</b>yperfast <b>A</b>gents
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}
