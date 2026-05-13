import { useState } from 'react'
import { readStoredSession, type AuthResult } from '@/authSession'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AuthStatus from './AuthStatus'
import EmailOtpSetup from './EmailOtpSetup'
import PasskeySignIn from './PasskeySignIn'

function AuthPage() {
  const [session, setSession] = useState<AuthResult | null>(readStoredSession)

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-5xl content-center gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
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
          {session ? (
            <AuthStatus session={session} onSignOut={() => setSession(null)} />
          ) : (
            <>
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
                  <PasskeySignIn onSignedIn={setSession} />
                </CardContent>
              </Card>
              <EmailOtpSetup onSignedIn={setSession} />
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default AuthPage
