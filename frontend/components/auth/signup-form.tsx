'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSignup } from '@/hooks/use-auth'
import GoogleSignin from '@/components/auth/google-signin'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

export function SignupForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState({
    show: false,
    type: 'success',
    message1: '',
    message2: ''
  })

  const { mutate: signupMutate, isPending: signupLoading} = useSignup({
    onSuccess: () => {
      setAlert({
        show: true,
        type: 'success',
        message1: 'Verification email sent',
        message2: 'Please check your email to verify your account and sign in'
      })
    },
    onError: (error) => {
        if(error.message.includes('NEXT_REDIRECT')) return;
        if(error.message.includes('Unique constraint failed on the fields: (`email`)')){
          setAlert({
            show: true,
            type: 'error',
            message1: 'Signup failed',
            message2: 'Email/User already exists'
          })
        } else {
          setAlert({
            show: true,
            type: 'error',
            message1: 'Signup failed',
            message2: 'Something went wrong'
          })
        }
    },
  })

  const signupFunc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    signupMutate(new FormData(e.currentTarget))
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={signupFunc}>
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
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
            />
          </div>
          
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
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup defaultValue="BUYER" name="role" className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem
                  value="BUYER"
                  id="buyer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="buyer"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  )}
                >
                  <span>Buyer</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="SELLER"
                  id="seller"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="seller"
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  )}
                >
                  <span>Seller</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full" disabled={signupLoading}>
            {signupLoading ? "Signing up..." : "Sign up"}
          </Button>
          <GoogleSignin />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => router.push('/login')}
        >
          Already have an account? Sign in
        </Button>
      </CardFooter>
    </Card>
  )
}