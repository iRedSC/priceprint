import { startRegistration } from '@simplewebauthn/browser'
import { useAction } from 'convex/react'
import { useState, type FormEvent } from 'react'
import { api } from '../../convex/_generated/api'
import { storeSession, type AuthResult } from '@/authSession'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'
import { storePasskeyHintEmail } from '@/lib/passkeyHintStorage'

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
      storePasskeyHintEmail(session.email)
      onSignedIn(session)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not create passkey.')
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <form
      onSubmit={codeSent ? handleCreatePasskey : handleRequestOtp}
      className="grid gap-4 touch-manipulation"
    >
      {!codeSent ? (
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
      ) : (
        <div className="grid gap-2">
          <Label id="otp-label">One-time code</Label>
          <p className="text-sm text-muted-foreground">
            Sent to <span className="font-medium text-foreground/80">{email.trim()}</span>
          </p>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            containerClassName="w-full justify-center sm:justify-start"
            aria-labelledby="otp-label"
            autoComplete="one-time-code"
          >
            <InputOTPGroup className="w-full min-w-0 justify-center sm:justify-start">
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot key={index} index={index} className="size-10 sm:size-9" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <Button
        type="submit"
        variant="secondary"
        className="w-full touch-manipulation"
        disabled={isBusy || (codeSent && code.length !== 6)}
      >
        {codeSent ? 'Create passkey' : 'Email me a code'}
      </Button>
    </form>
  )
}

export default EmailOtpSetup
