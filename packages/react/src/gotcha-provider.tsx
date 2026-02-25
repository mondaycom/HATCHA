"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { Gotcha, type GotchaProps } from "./gotcha.js";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface GotchaCtx {
  /**
   * Show the GOTCHA modal. The callback fires with the verification
   * token once the agent passes the challenge.
   */
  requestVerification: (onVerified: (token: string) => void) => void;
}

const Ctx = createContext<GotchaCtx>({
  requestVerification: () => {},
});

/** Hook to trigger a GOTCHA challenge from anywhere in the tree. */
export function useGotcha() {
  return useContext(Ctx);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export interface GotchaProviderProps
  extends Pick<
    GotchaProps,
    "challengeEndpoint" | "verifyEndpoint" | "theme"
  > {
  children: ReactNode;
}

export function GotchaProvider({
  children,
  challengeEndpoint,
  verifyEndpoint,
  theme,
}: GotchaProviderProps) {
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
        <Gotcha
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
