import type { AuthResult } from '@/authSession'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  clearPasskeyHintEmail,
  readPasskeyHintEmail,
} from '@/lib/passkeyHintStorage'
import { useState } from 'react'
import AuthPasskeyReturnView from './AuthPasskeyReturnView'
import EmailOtpSetup from './EmailOtpSetup'

type AuthSignInCardProps = {
  onSignedIn: (session: AuthResult) => void
}

function AuthSignInCard({ onSignedIn }: AuthSignInCardProps) {
  const [hintEmail, setHintEmail] = useState(() => readPasskeyHintEmail())
  const [useOtherAccount, setUseOtherAccount] = useState(false)

  const showPasskeyReturn = Boolean(hintEmail) && !useOtherAccount

  const handleDifferentAccount = () => {
    clearPasskeyHintEmail()
    setHintEmail(null)
    setUseOtherAccount(true)
  }

  return (
    <Card>
      <CardHeader>
        {showPasskeyReturn ? (
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
        {showPasskeyReturn ? (
          <AuthPasskeyReturnView
            email={hintEmail!}
            onDifferentAccount={handleDifferentAccount}
            onSignedIn={onSignedIn}
          />
        ) : (
          <EmailOtpSetup
            onSignedIn={(session) => {
              setHintEmail(session.email)
              setUseOtherAccount(false)
              onSignedIn(session)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default AuthSignInCard
