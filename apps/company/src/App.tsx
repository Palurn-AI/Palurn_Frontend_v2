import { useIdleSession, useSessionStore } from '@palurn/api'
import { SignInView, Toaster, WorkspacePage } from '@palurn/ui'

export default function App() {
  const token = useSessionStore((state) => state.token)
  const loggedOut = useSessionStore((state) => state.loggedOut)
  useIdleSession()

  return (
    <>
      {!token || loggedOut ? (
        <SignInView />
      ) : (
        <WorkspacePage sections={["dashboard", "meetings", "tasks", "projects", "team", "integration", "report", "settings", "account"]} />
      )}
      <Toaster />
    </>
  )
}
