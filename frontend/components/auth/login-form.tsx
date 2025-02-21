'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { authApi } from '@/lib/api/auth'
import { toast } from "sonner"
// import GoogleSignin from '@/components/auth/google-signin'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginError {
  message: string;
  details?: string;
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'error';
    message1: string;
    message2: string;
  }>({
    show: false,
    type: 'error',
    message1: '',
    message2: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setAlert({ ...alert, show: false })

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      await authApi.login({ email, password })
      
      toast.success('Signed in successfully')
      router.push('/dashboard') // or appropriate route based on user role
    } catch (error) {
      const err = error as LoginError
      setAlert({
        show: true,
        type: 'error',
        message1: 'Login failed',
        message2: err.message || 'Invalid credentials'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email to sign in to your account
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="m@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
            />
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white hover:opacity-90" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          {/* <GoogleSignin /> */}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push('/signup')}
        >
          Don&apos;t have an account? Sign up
        </Button>
      </CardFooter>
    </Card>
  )
}
