import { startAuthentication } from '@simplewebauthn/browser'
import { useAction } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { storeSession, type AuthResult } from '@/authSession'
import { Button } from '@/components/ui/button'
import { storePasskeyHintEmail } from '@/lib/passkeyHintStorage'

type PasskeySignInProps = {
  onSignedIn: (session: AuthResult) => void
  signInLabel?: string
}

function PasskeySignIn({ onSignedIn, signInLabel = 'Sign in with passkey' }: PasskeySignInProps) {
  const startSignIn = useAction(api.auth.startPasskeySignIn)
  const completeSignIn = useAction(api.auth.completePasskeySignIn)

  const handleSignIn = async () => {
    const origin = window.location.origin
    const { options, challengeId } = await startSignIn({ origin })
    const response = await startAuthentication({ optionsJSON: options })
    const session = await completeSignIn({ challengeId, response, origin })

    storeSession(session)
    storePasskeyHintEmail(session.email)
    onSignedIn(session)
  }

  return (
    <Button type="button" size="lg" className="w-full touch-manipulation" onClick={handleSignIn}>
      {signInLabel}
    </Button>
  )
}

export default PasskeySignIn
