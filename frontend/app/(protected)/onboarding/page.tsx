import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "../../home/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingBag, Store, Sparkles } from "lucide-react"
import { createNewUser } from "@/actions/auth"
import { SubmitButton } from "@/components/auth/submit-button"

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email! }
  })

  if (existingUser) {
    redirect('/home')
  }

  const currentUser = await getCurrentUser(user.id)
  if (currentUser) {
    redirect('/home')
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome!</CardTitle>
          <CardDescription className="text-lg">
            Choose how you want to use our marketplace
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form action={createNewUser} className="space-y-6">
            <RadioGroup name="role" className="grid grid-cols-1 md:grid-cols-2 gap-4" required>
              <div>
                <RadioGroupItem
                  value="BUYER"
                  id="buyer"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="buyer"
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                >
                  <ShoppingBag className="w-10 h-10 mb-3 text-primary" />
                  <span className="text-xl font-semibold">Buyer</span>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    I want to shop products
                  </p>
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
                  className="flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 transition-all"
                >
                  <Store className="w-10 h-10 mb-3 text-primary" />
                  <span className="text-xl font-semibold">Seller</span>
                  <p className="text-sm text-muted-foreground mt-1 text-center">
                    I want to sell products
                  </p>
                </Label>
              </div>
            </RadioGroup>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
