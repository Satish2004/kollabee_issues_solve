import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"

export default async function BuyerSignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/home')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <SignupForm />
    </div>
  )
}