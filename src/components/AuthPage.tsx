import type { AuthResult } from '@/authSession'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import EmailOtpSetup from './EmailOtpSetup'
import PasskeySignIn from './PasskeySignIn'

type AuthPageProps = {
  onSignedIn: (session: AuthResult) => void
}

function AuthPage({ onSignedIn }: AuthPageProps) {
  return (
    <main className="safe-area-auth-page min-h-svh bg-muted/30 text-foreground">
      <div className="mx-auto grid min-h-[calc(100svh-3rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px))] w-full max-w-5xl content-center gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="max-w-2xl text-left">
          <p className="mb-3 text-sm font-medium text-muted-foreground">PricePrint</p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Sign in to scan, review, and print labels.
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Use a passkey for fast return access. If this is your first time,
            verify your email and create a passkey for this device.
          </p>
        </section>

        <section className="grid gap-4" aria-label="Authentication options">
          <Card>
            <CardHeader>
              <CardDescription>Returning user</CardDescription>
              <CardTitle>Use your passkey</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                Your browser will ask for your fingerprint, face, PIN, or
                security key.
              </p>
              <PasskeySignIn onSignedIn={onSignedIn} />
            </CardContent>
          </Card>
          <EmailOtpSetup onSignedIn={onSignedIn} />
        </section>
      </div>
    </main>
  )
}

export default AuthPage
