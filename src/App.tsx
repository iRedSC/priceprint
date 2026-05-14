import { useState } from "react"

import { readStoredSession, type AuthResult } from "@/authSession"
import AuthPage from "@/components/AuthPage"
import DashboardPage from "@/components/dashboard/DashboardPage"
import { Toaster } from "@/components/ui/sonner"

function App() {
  const [session, setSession] = useState<AuthResult | null>(readStoredSession)

  return (
    <>
      {session ? <DashboardPage /> : <AuthPage onSignedIn={setSession} />}
      <Toaster richColors position="top-center" />
    </>
  )
}

export default App
