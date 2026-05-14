import type { AuthResult } from '@/authSession'
import { maskEmail } from '@/lib/maskEmail'
import { Button } from '@/components/ui/button'
import PasskeySignIn from './PasskeySignIn'

type AuthPasskeyReturnViewProps = {
  email: string
  onDifferentAccount: () => void
  onSignedIn: (session: AuthResult) => void
}

function AuthPasskeyReturnView({
  email,
  onDifferentAccount,
  onSignedIn,
}: AuthPasskeyReturnViewProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted-foreground">
        You will sign in as{' '}
        <span
          className="select-none font-medium tracking-tight text-foreground/65"
          aria-label="Obscured email address"
        >
          {maskEmail(email)}
        </span>
      </p>
      <p className="text-sm text-muted-foreground">
        Your browser may ask for your fingerprint, face, PIN, or security key.
      </p>
      <PasskeySignIn signInLabel="Sign in" onSignedIn={onSignedIn} />
      <Button
        type="button"
        variant="link"
        className="h-auto touch-manipulation justify-self-center px-1 py-1 text-muted-foreground"
        onClick={onDifferentAccount}
      >
        Sign into a different account
      </Button>
    </div>
  )
}

export default AuthPasskeyReturnView
