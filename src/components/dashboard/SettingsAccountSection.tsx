import { useState } from "react"
import { LogOut } from "lucide-react"

import {
  clearStoredSession,
  readStoredSession,
} from "@/authSession"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type SettingsAccountSectionProps = {
  onSignOut: () => void
}

function SettingsAccountSection({ onSignOut }: SettingsAccountSectionProps) {
  const [session] = useState(readStoredSession)

  const handleLogout = () => {
    clearStoredSession()
    onSignOut()
  }

  if (!session) return null

  return (
    <Card>
      <CardHeader>
        <CardDescription>Account</CardDescription>
        <CardTitle>Signed in</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{session.email}</p>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          className="w-full touch-manipulation gap-2"
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </Button>
      </CardFooter>
    </Card>
  )
}

export default SettingsAccountSection
