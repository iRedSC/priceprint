import { useState } from "react"

import { readStoredSession, type AuthResult } from "@/authSession"
import AuthPage from "@/components/AuthPage"
import DashboardPage from "@/components/dashboard/DashboardPage"

function App() {
  const [session, setSession] = useState<AuthResult | null>(readStoredSession)

  if (!session) {
    return <AuthPage onSignedIn={setSession} />
  }

  return <DashboardPage />
}

export default App
