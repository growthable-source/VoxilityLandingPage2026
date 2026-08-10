"use client";

import { useEffect } from "react";

/**
 * Reloads the page on an interval. Used by the static holding states so no
 * visitor is ever asked to come back later — the page checks for them.
 */
export function AutoRefresh({ ms = 15_000 }: { ms?: number }) {
  useEffect(() => {
    const id = setTimeout(() => window.location.reload(), ms);
    return () => clearTimeout(id);
  }, [ms]);

  return null;
}
