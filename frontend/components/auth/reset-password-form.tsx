'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useResetPassword } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ResetPasswordForm() {
  const router = useRouter()
  const [alert, setAlert] = useState({
    show: false,
    type: 'error',
    message1: '',
    message2: ''
  })

  const { mutate: resetPasswordMutate, isPending } = useResetPassword({
    onSuccess: () => {
      router.push('/home')
      toast.success('Password reset successfully')
    },
    onError: (error) => {
      setAlert({
        show: true,
        type: 'error',
        message1: 'Failed to reset password',
        message2: error.message
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resetPasswordMutate(new FormData(e.currentTarget))
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {alert.show && (
            <Alert className={cn(
              "mb-6 border-2",
              "border-red-500 bg-red-50 dark:bg-red-900/20"
            )}>
              <Info className="h-5 w-5" />
              <AlertTitle className="font-medium">{alert.message1}</AlertTitle>
              <AlertDescription>
                {alert.message2}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Resetting password..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
