"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "./use-hydrated";

/**
 * Sends the customer back to an earlier wizard step when something the current
 * step needs is missing (for example after a refresh). Returns a function to
 * call right before you navigate away on purpose, so a state reset doesn't
 * trigger the redirect.
 */
export function useGuard(ok: boolean, redirectTo: string): () => void {
  const router = useRouter();
  const hydrated = useHydrated();
  const leaving = useRef(false);

  useEffect(() => {
    if (hydrated && !ok && !leaving.current) router.replace(redirectTo);
  }, [hydrated, ok, redirectTo, router]);

  return useCallback(() => {
    leaving.current = true;
  }, []);
}
