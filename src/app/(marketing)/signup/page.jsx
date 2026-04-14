import { Suspense } from "react"
import SignupClient from "./SignupClient"

export const metadata = { title: "Crear cuenta | Octane Labs" }

export default function SignupPage() {
  return (
    <Suspense>
      <SignupClient />
    </Suspense>
  )
}
