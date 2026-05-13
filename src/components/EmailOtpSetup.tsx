import { startRegistration } from '@simplewebauthn/browser'
import { useAction } from 'convex/react'
import { useState, type FormEvent } from 'react'
import { api } from '../../convex/_generated/api'
import { storeSession, type AuthResult } from '@/authSession'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type EmailOtpSetupProps = {
  onSignedIn: (session: AuthResult) => void
}

function EmailOtpSetup({ onSignedIn }: EmailOtpSetupProps) {
  const requestOtp = useAction(api.auth.requestEmailOtp)
  const startSetup = useAction(api.auth.verifyOtpAndStartPasskeySetup)
  const completeSetup = useAction(api.auth.completePasskeySetup)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [message, setMessage] = useState('')
  const [isBusy, setIsBusy] = useState(false)

  const handleRequestOtp = async (event: FormEvent) => {
    event.preventDefault()
    setIsBusy(true)
    setMessage('')

    try {
      await requestOtp({ email })
      setCodeSent(true)
      setMessage('Check your email for a 6-digit code.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not send code.')
    } finally {
      setIsBusy(false)
    }
  }

  const handleCreatePasskey = async (event: FormEvent) => {
    event.preventDefault()
    setIsBusy(true)
    setMessage('')

    try {
      const origin = window.location.origin
      const { options, challengeId } = await startSetup({ email, code, origin })
      const response = await startRegistration({ optionsJSON: options })
      const session = await completeSetup({ challengeId, response, origin })

      storeSession(session)
      onSignedIn(session)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create passkey.')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <form onSubmit={codeSent ? handleCreatePasskey : handleRequestOtp}>
      <Card>
        <CardHeader>
          <CardDescription>New device or first sign-up</CardDescription>
          <CardTitle>Email code, then passkey</CardTitle>
          <CardDescription>
            We will email a one-time code, then your browser will save a passkey
            for future sign-ins.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email webauthn"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          {codeSent ? (
            <div className="grid gap-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                onChange={(event) => setCode(event.target.value)}
                placeholder="123456"
                required
                value={code}
              />
            </div>
          ) : null}
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="secondary" className="w-full" disabled={isBusy}>
            {codeSent ? 'Create passkey' : 'Email me a code'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

export default EmailOtpSetup
