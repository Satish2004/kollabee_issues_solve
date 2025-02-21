import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default async function ForgotPasswordPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <ForgotPasswordForm />
    </div>
  )
}