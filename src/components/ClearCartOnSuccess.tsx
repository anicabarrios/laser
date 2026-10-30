"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/store";

/** After Stripe sends the customer back with a session id, the cart has been paid for. */
export function ClearCartOnSuccess() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("session_id")) {
      useCart.getState().clear();
    }
  }, []);
  return null;
}
