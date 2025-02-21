'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForgotPassword } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export function ForgotPasswordForm() {
  const router = useRouter()
  const [alert, setAlert] = useState({
    show: false,
    type: 'error' as 'error' | 'success',
    message1: '',
    message2: ''
  })

  const { mutate: forgotPasswordMutate, isPending } = useForgotPassword({
    onSuccess: () => {
      setAlert({
        show: true,
        type: 'success',
        message1: 'Reset email sent',
        message2: 'Please check your email to reset your password'
      })
    },
    onError: (error) => {
      setAlert({
        show: true,
        type: 'error',
        message1: 'Failed to send reset email',
        message2: error.message
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(new FormData(e.currentTarget));
    forgotPasswordMutate(new FormData(e.currentTarget))
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {alert.show && (
            <Alert className={cn(
              "mb-6 border-2",
              alert.type === 'success' ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-500 bg-red-50 dark:bg-red-900/20"
            )}>
              {alert.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Info className="h-5 w-5" />}
              <AlertTitle className="font-medium">{alert.message1}</AlertTitle>
              <AlertDescription>
                {alert.message2}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="m@example.com"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending || (alert.type === 'success' && alert.show)}>
            {isPending ? "Sending reset email..." : "Send reset email"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Back to login
        </Button>
      </CardFooter>
    </Card>
  )
}
