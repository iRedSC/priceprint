import { startAuthentication } from "@simplewebauthn/browser";
import { useAction } from "convex/react";
import { useCallback, useEffect, useRef } from "react";
import type { AuthResult } from "@/authSession";
import { storeSession } from "@/authSession";
import { storePasskeyHintEmail } from "@/lib/passkeyHintStorage";
import { api } from "../../convex/_generated/api";

/** Shared passkey sign-in (discoverable credentials). Used by the primary button and the automatic boot attempt. */
export function usePasskeySignIn(onSignedIn: (session: AuthResult) => void) {
  const onSignedInRef = useRef(onSignedIn);

  useEffect(() => {
    onSignedInRef.current = onSignedIn;
  }, [onSignedIn]);

  const startSignIn = useAction(api.auth.startPasskeySignIn);
  const completeSignIn = useAction(api.auth.completePasskeySignIn);

  return useCallback(async () => {
    const origin = window.location.origin;
    const { options, challengeId } = await startSignIn({ origin });
    const response = await startAuthentication({ optionsJSON: options });
    const session = await completeSignIn({ challengeId, response, origin });
    storeSession(session);
    storePasskeyHintEmail(session.email);
    onSignedInRef.current(session);
  }, [startSignIn, completeSignIn]);
}
