"use client"

import { useEffect, useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { OrderSummary } from "./order-summary"
import { Button } from "@/components/ui/button"
import { useCheckout } from "../../../../../../contexts/checkout-context"
import { toast } from "sonner"
import { paymentApi } from "@/lib/api/payment"
import { authApi } from "@/lib/api/auth"
import { cartApi } from "@/lib/api/cart"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { set } from "date-fns"
import { countries } from "@/lib/country"

// Load Stripe.js asynchronously
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentProps {
  onNext: () => void
}

const cardElementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
}



// Stripe Payment Form Component
const StripePaymentForm = ({ onSubmit, isLoading, setCardholderName, setCountry, setBillingSameAsShipping, country, billingSameAsShipping, cardholderName, user, paymentLoading, setPaymentLoading }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [commandOpen, setCommandOpen] = useState(false)

  // Error states
  const [cardNumberError, setCardNumberError] = useState(null)
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null)
  const [cardCvcError, setCardCvcError] = useState(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleCardNumberChange = (event) => {
    if (event.error) {
      setCardNumberError(event.error.message)
    } else {
      setCardNumberError(null)
    }
  }

  const handleCardExpiryChange = (event) => {
    if (event.error) {
      setCardExpiryError(event.error.message)
    } else {
      // Check if the expiration date is in the past
      if (event.complete) {
        const expMonth = event.value.postalCode
        const expYear = event.value.postalCode
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth() + 1 // getMonth() returns 0-11
        const currentYear = currentDate.getFullYear() % 100 // Get last two digits

        if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
          setCardExpiryError("Your card has expired")
        } else {
          setCardExpiryError(null)
        }
      } else {
        setCardExpiryError(null)
      }
    }
  }

  const handleCardCvcChange = (event) => {
    if (event.error) {
      setCardCvcError(event.error.message)
    } else {
      setCardCvcError(null)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormSubmitted(true)

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again.")
      return
    }

    const cardNumber = elements.getElement(CardNumberElement)
    const cardExpiry = elements.getElement(CardExpiryElement)
    const cardCvc = elements.getElement(CardCvcElement)

    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please fill in all card details.")
      return
    }

    // Check for validation errors
    if (cardNumberError || cardExpiryError || cardCvcError) {
      toast.error("Please correct the errors in your card information.")
      return
    }

    if (!billingSameAsShipping && !cardholderName.trim()) {
      toast.error("Please enter the cardholder name.")
      return
    }

    setPaymentLoading(true)

    // Create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        name: billingSameAsShipping ? user?.name : cardholderName,
        address: {
          country: billingSameAsShipping ? "IN" : country,
        },
      },
    })

    if (error) {
      console.error("Error creating payment method:", error)
      toast.error("Payment failed: " + error.message)
      setPaymentLoading(false)
      return
    }

    // Call the onSubmit prop to handle the payment
    onSubmit(paymentMethod.id)
  }

  const selectedCountry = countries.find((c) => c.value === country)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment details</h3>

          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">Card information</Label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <div className="p-3 border-b border-gray-300">
                  <CardNumberElement options={cardElementStyle} onChange={handleCardNumberChange} />
                </div>
                {cardNumberError && formSubmitted && (
                  <div className="px-3 pt-1 text-red-500 text-xs">{cardNumberError}</div>
                )}
                <div className="grid grid-cols-2">
                  <div className="p-3 border-r border-gray-300">
                    <CardExpiryElement
                      options={cardElementStyle}
                      placeholder="MM / YY"
                      onChange={handleCardExpiryChange}
                    />
                    {cardExpiryError && formSubmitted && (
                      <div className="pt-1 text-red-500 text-xs">{cardExpiryError}</div>
                    )}
                  </div>
                  <div className="p-3 relative">
                    <div className="flex items-center">
                      <div className="flex-grow relative">
                        <CardCvcElement
                          options={{
                            ...cardElementStyle,
                            style: {
                              ...cardElementStyle.style,
                              base: {
                                ...cardElementStyle.style.base,
                                color: cardElementStyle.style.base.color,
                              },
                            },
                          }}
                          onChange={handleCardCvcChange}
                        />
                      </div>
                    </div>
                    {cardCvcError && formSubmitted && <div className="pt-1 text-red-500 text-xs">{cardCvcError}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="billing-same"
                className="rounded"
                checked={billingSameAsShipping}
                onCheckedChange={(checked) => setBillingSameAsShipping(checked === true)}
              />
              <Label htmlFor="billing-same" className="text-sm">
                Billing info is same as shipping
              </Label>
            </div>

            <div
              className={cn(
                "space-y-4 overflow-hidden transition-all duration-300",
                billingSameAsShipping ? "max-h-0 opacity-0" : "max-h-96 opacity-100 mt-4",
              )}
            >
              <div>
                <Label htmlFor="cardholder-name" className="block text-sm font-medium mb-1">
                  Cardholder name
                </Label>
                <Input
                  id="cardholder-name"
                  placeholder="Full name on card"
                  className="w-full"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  disabled={billingSameAsShipping}
                />
              </div>

              <div>
                <Label htmlFor="country" className="block text-sm font-medium mb-1">
                  Country or region
                </Label>
                <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={commandOpen}
                      className="w-full justify-between"
                      disabled={billingSameAsShipping}
                    >
                      {selectedCountry ? selectedCountry.label : "Select country..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full bg-white" style={{ width: "var(--radix-popover-trigger-width)" }}>
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {countries.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.label}
                              onSelect={() => {
                                setCountry(country.value)
                                setCommandOpen(false)
                              }}
                            >
                              {country.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#910973] to-[#f2bc6c] text-white py-3 rounded-md flex items-center justify-center font-semibold"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing..." : "Pay"}
      </Button>

      <div className="flex items-center justify-center text-xs text-gray-500 gap-4 mt-2">
        <span>Powered by stripe</span>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
      </div>
    </form>
  )
}

export function Payment({ onNext }: PaymentProps) {
  const { products, setProducts, orderSummary, submitOrder, isLoading, orderId, setOrderId } = useCheckout()
  const [user, setUser] = useState([])
  const [cardholderName, setCardholderName] = useState("")
  const [country, setCountry] = useState("IN")
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const response: any = await authApi.getCurrentUser()
      setUser(response)
    }
    fetchUser()
  }, [])

  const handlePayment = async (paymentMethodId: string) => {
    try {
      // Call your backend to create a checkout session
      const response = await paymentApi.createCheckoutSession({
        amount: orderSummary.total, // Convert to cents
        products: products.map((p) => ({
          id: p.productId,
          sellerId: p.product.sellerId,
          quantity: p.quantity,
          price: p.product.price,
        })),
        currency: "usd",
        customerName: billingSameAsShipping ? user?.name : cardholderName,
        customerAddress: {
          line1: "123 Main St",
          line2: "Apt 4B",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "IN",
        },
      })

      const { clientSecret, order } = await response

      if (!clientSecret) {
        throw new Error("Failed to create checkout session")
      }

      // Confirm the payment on the client side
      const stripe = await stripePromise
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      })

      if (error) {
        setPaymentLoading(false)
        throw new Error(error.message)
      }

      // Handle payment confirmation
      await fetch("/api/handle-payment-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
        }),
      })
      setPaymentLoading(false)
      onNext()
      setOrderId(order.id)
      cartApi.clearCart()
      setProducts([])
      toast.success("Payment successful!")
    } catch (error) {
      console.error("Error processing payment:", error)
      toast.error(error.message)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white px-6 pb-6 rounded-lg">
        <h2 className="text-2xl font-[900] mb-6">Payment</h2>
        {orderSummary.total}
        <Elements stripe={stripePromise}>
          <StripePaymentForm onSubmit={handlePayment} isLoading={isLoading} setCardholderName={setCardholderName} setCountry={setCountry} setBillingSameAsShipping={setBillingSameAsShipping} country={country} billingSameAsShipping={billingSameAsShipping} cardholderName={cardholderName} user={user} paymentLoading={paymentLoading} setPaymentLoading={setPaymentLoading} />
        </Elements>
      </div>

      <div>
        <OrderSummary buttonText="Complete Order" />
      </div>
    </div>
  )
}

