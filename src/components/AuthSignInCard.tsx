import type { AuthResult } from '@/authSession'
import AuthPasskeyBootLoading from './AuthPasskeyBootLoading'
import AuthPasskeyReturnView from './AuthPasskeyReturnView'
import EmailOtpSetup from './EmailOtpSetup'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePasskeySignIn } from '@/hooks/usePasskeySignIn'
import { browserSupportsWebAuthn } from '@simplewebauthn/browser'
import {
  clearPasskeyHintEmail,
  readPasskeyHintEmail,
} from '@/lib/passkeyHintStorage'
import { useCallback, useEffect, useState } from 'react'

type AuthSignInCardProps = {
  onSignedIn: (session: AuthResult) => void
}

function AuthSignInCard({ onSignedIn }: AuthSignInCardProps) {
  const [hintEmail, setHintEmail] = useState(() => readPasskeyHintEmail())
  const [useOtherAccount, setUseOtherAccount] = useState(false)
  const [boot, setBoot] = useState<'checking' | 'ready'>('checking')

  const showPasskeyReturn = Boolean(hintEmail) && !useOtherAccount

  const onSession = useCallback(
    (session: AuthResult) => {
      setHintEmail(session.email)
      setUseOtherAccount(false)
      onSignedIn(session)
    },
    [onSignedIn],
  )

  const tryPasskeySignIn = usePasskeySignIn(onSession)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!browserSupportsWebAuthn()) {
        if (!cancelled) setBoot('ready')
        return
      }
      try {
        await tryPasskeySignIn()
      } catch {
        if (!cancelled) setBoot('ready')
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [tryPasskeySignIn])

  const handleDifferentAccount = () => {
    clearPasskeyHintEmail()
    setHintEmail(null)
    setUseOtherAccount(true)
  }

  return (
    <Card>
      <CardHeader>
        {boot === 'checking' ? (
          <>
            <CardDescription>PricePrint</CardDescription>
            <CardTitle className="text-xl sm:text-2xl">Signing in…</CardTitle>
          </>
        ) : showPasskeyReturn ? (
          <>
            <CardDescription>Returning on this device</CardDescription>
            <CardTitle>Sign in with your passkey</CardTitle>
          </>
        ) : (
          <>
            <CardDescription>Verify your email</CardDescription>
            <CardTitle>Email code, then passkey</CardTitle>
            <CardDescription>
              We email a one-time code, then your browser saves a passkey for faster sign-in next
              time.
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {boot === 'checking' ? (
          <AuthPasskeyBootLoading />
        ) : showPasskeyReturn ? (
          <AuthPasskeyReturnView
            email={hintEmail!}
            onDifferentAccount={handleDifferentAccount}
            onSignedIn={onSession}
          />
        ) : (
          <EmailOtpSetup onSignedIn={onSession} />
        )}
      </CardContent>
    </Card>
  )
}

export default AuthSignInCard
