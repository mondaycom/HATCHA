"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Hatcha, type HatchaProps } from "./hatcha.js";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface HatchaCtx {
  /**
   * Show the HATCHA modal. The callback fires with the verification
   * token once the agent passes the challenge.
   */
  requestVerification: (onVerified: (token: string) => void) => void;
}

const Ctx = createContext<HatchaCtx>({
  requestVerification: () => {},
});

/** Hook to trigger a HATCHA challenge from anywhere in the tree. */
export function useHatcha() {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export interface HatchaProviderProps
  extends Pick<
    HatchaProps,
    "challengeEndpoint" | "verifyEndpoint" | "theme"
  > {
  children: ReactNode;
}

export function HatchaProvider({
  children,
  challengeEndpoint,
  verifyEndpoint,
  theme,
}: HatchaProviderProps) {
  const [open, setOpen] = useState(false);
  const [callback, setCallback] = useState<((token: string) => void) | null>(
    null,
  );

  const requestVerification = useCallback(
    (onVerified: (token: string) => void) => {
      setCallback(() => onVerified);
      setOpen(true);
    },
    [],
  );

  const handleVerified = useCallback(
    (token: string) => {
      setOpen(false);
      callback?.(token);
      setCallback(null);
    },
    [callback],
  );

  const handleClose = useCallback(() => {
    setOpen(false);
    setCallback(null);
  }, []);

  return (
    <Ctx.Provider value={{ requestVerification }}>
      {children}
      {open && (
        <Hatcha
          challengeEndpoint={challengeEndpoint}
          verifyEndpoint={verifyEndpoint}
          theme={theme}
          onVerified={handleVerified}
          onClose={handleClose}
        />
      )}
    </Ctx.Provider>
  );
}
