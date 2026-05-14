import type { AuthResult } from '@/authSession'
import { Button } from '@/components/ui/button'
import { usePasskeySignIn } from '@/hooks/usePasskeySignIn'

type PasskeySignInProps = {
  onSignedIn: (session: AuthResult) => void
  signInLabel?: string
}

function PasskeySignIn({ onSignedIn, signInLabel = 'Sign in with passkey' }: PasskeySignInProps) {
  const trySignIn = usePasskeySignIn(onSignedIn)

  return (
    <Button type="button" size="lg" className="w-full touch-manipulation" onClick={() => void trySignIn()}>
      {signInLabel}
    </Button>
  )
}

export default PasskeySignIn
