import { clearStoredSession, type AuthResult } from '@/authSession'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type AuthStatusProps = {
  session: AuthResult
  onSignOut: () => void
}

function AuthStatus({ session, onSignOut }: AuthStatusProps) {
  const handleSignOut = () => {
    clearStoredSession()
    onSignOut()
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Signed in</CardDescription>
        <CardTitle>Ready to print prices.</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{session.email}</p>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" className="w-full" onClick={handleSignOut}>
          Sign out
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AuthStatus
