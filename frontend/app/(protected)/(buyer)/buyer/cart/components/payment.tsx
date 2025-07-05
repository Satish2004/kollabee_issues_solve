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

// List of countries
const countries = [
  { value: "AF", label: "Afghanistan" },
  { value: "AL", label: "Albania" },
  { value: "DZ", label: "Algeria" },
  { value: "AS", label: "American Samoa" },
  { value: "AD", label: "Andorra" },
  { value: "AO", label: "Angola" },
  { value: "AI", label: "Anguilla" },
  { value: "AQ", label: "Antarctica" },
  { value: "AG", label: "Antigua and Barbuda" },
  { value: "AR", label: "Argentina" },
  { value: "AM", label: "Armenia" },
  { value: "AW", label: "Aruba" },
  { value: "AU", label: "Australia" },
  { value: "AT", label: "Austria" },
  { value: "AZ", label: "Azerbaijan" },
  { value: "BS", label: "Bahamas" },
  { value: "BH", label: "Bahrain" },
  { value: "BD", label: "Bangladesh" },
  { value: "BB", label: "Barbados" },
  { value: "BY", label: "Belarus" },
  { value: "BE", label: "Belgium" },
  { value: "BZ", label: "Belize" },
  { value: "BJ", label: "Benin" },
  { value: "BM", label: "Bermuda" },
  { value: "BT", label: "Bhutan" },
  { value: "BO", label: "Bolivia" },
  { value: "BA", label: "Bosnia and Herzegovina" },
  { value: "BW", label: "Botswana" },
  { value: "BV", label: "Bouvet Island" },
  { value: "BR", label: "Brazil" },
  { value: "IO", label: "British Indian Ocean Territory" },
  { value: "BN", label: "Brunei Darussalam" },
  { value: "BG", label: "Bulgaria" },
  { value: "BF", label: "Burkina Faso" },
  { value: "BI", label: "Burundi" },
  { value: "KH", label: "Cambodia" },
  { value: "CM", label: "Cameroon" },
  { value: "CA", label: "Canada" },
  { value: "CV", label: "Cape Verde" },
  { value: "KY", label: "Cayman Islands" },
  { value: "CF", label: "Central African Republic" },
  { value: "TD", label: "Chad" },
  { value: "CL", label: "Chile" },
  { value: "CN", label: "China" },
  { value: "CX", label: "Christmas Island" },
  { value: "CC", label: "Cocos (Keeling) Islands" },
  { value: "CO", label: "Colombia" },
  { value: "KM", label: "Comoros" },
  { value: "CG", label: "Congo" },
  { value: "CD", label: "Congo, Democratic Republic" },
  { value: "CK", label: "Cook Islands" },
  { value: "CR", label: "Costa Rica" },
  { value: "CI", label: "Cote D'Ivoire" },
  { value: "HR", label: "Croatia" },
  { value: "CU", label: "Cuba" },
  { value: "CY", label: "Cyprus" },
  { value: "CZ", label: "Czech Republic" },
  { value: "DK", label: "Denmark" },
  { value: "DJ", label: "Djibouti" },
  { value: "DM", label: "Dominica" },
  { value: "DO", label: "Dominican Republic" },
  { value: "EC", label: "Ecuador" },
  { value: "EG", label: "Egypt" },
  { value: "SV", label: "El Salvador" },
  { value: "GQ", label: "Equatorial Guinea" },
  { value: "ER", label: "Eritrea" },
  { value: "EE", label: "Estonia" },
  { value: "ET", label: "Ethiopia" },
  { value: "FK", label: "Falkland Islands (Malvinas)" },
  { value: "FO", label: "Faroe Islands" },
  { value: "FJ", label: "Fiji" },
  { value: "FI", label: "Finland" },
  { value: "FR", label: "France" },
  { value: "GF", label: "French Guiana" },
  { value: "PF", label: "French Polynesia" },
  { value: "TF", label: "French Southern Territories" },
  { value: "GA", label: "Gabon" },
  { value: "GM", label: "Gambia" },
  { value: "GE", label: "Georgia" },
  { value: "DE", label: "Germany" },
  { value: "GH", label: "Ghana" },
  { value: "GI", label: "Gibraltar" },
  { value: "GR", label: "Greece" },
  { value: "GL", label: "Greenland" },
  { value: "GD", label: "Grenada" },
  { value: "GP", label: "Guadeloupe" },
  { value: "GU", label: "Guam" },
  { value: "GT", label: "Guatemala" },
  { value: "GN", label: "Guinea" },
  { value: "GW", label: "Guinea-Bissau" },
  { value: "GY", label: "Guyana" },
  { value: "HT", label: "Haiti" },
  { value: "HM", label: "Heard Island and Mcdonald Islands" },
  { value: "VA", label: "Holy See (Vatican City State)" },
  { value: "HN", label: "Honduras" },
  { value: "HK", label: "Hong Kong" },
  { value: "HU", label: "Hungary" },
  { value: "IS", label: "Iceland" },
  { value: "IN", label: "India" },
  { value: "ID", label: "Indonesia" },
  { value: "IR", label: "Iran" },
  { value: "IQ", label: "Iraq" },
  { value: "IE", label: "Ireland" },
  { value: "IL", label: "Israel" },
  { value: "IT", label: "Italy" },
  { value: "JM", label: "Jamaica" },
  { value: "JP", label: "Japan" },
  { value: "JO", label: "Jordan" },
  { value: "KZ", label: "Kazakhstan" },
  { value: "KE", label: "Kenya" },
  { value: "KI", label: "Kiribati" },
  { value: "KP", label: "Korea, Democratic People's Republic of" },
  { value: "KR", label: "Korea, Republic of" },
  { value: "KW", label: "Kuwait" },
  { value: "KG", label: "Kyrgyzstan" },
  { value: "LA", label: "Lao People's Democratic Republic" },
  { value: "LV", label: "Latvia" },
  { value: "LB", label: "Lebanon" },
  { value: "LS", label: "Lesotho" },
  { value: "LR", label: "Liberia" },
  { value: "LY", label: "Libyan Arab Jamahiriya" },
  { value: "LI", label: "Liechtenstein" },
  { value: "LT", label: "Lithuania" },
  { value: "LU", label: "Luxembourg" },
  { value: "MO", label: "Macao" },
  { value: "MG", label: "Madagascar" },
  { value: "MW", label: "Malawi" },
  { value: "MY", label: "Malaysia" },
  { value: "MV", label: "Maldives" },
  { value: "ML", label: "Mali" },
  { value: "MT", label: "Malta" },
  { value: "MH", label: "Marshall Islands" },
  { value: "MQ", label: "Martinique" },
  { value: "MR", label: "Mauritania" },
  { value: "MU", label: "Mauritius" },
  { value: "YT", label: "Mayotte" },
  { value: "MX", label: "Mexico" },
  { value: "FM", label: "Micronesia, Federated States of" },
  { value: "MD", label: "Moldova, Republic of" },
  { value: "MC", label: "Monaco" },
  { value: "MN", label: "Mongolia" },
  { value: "MS", label: "Montserrat" },
  { value: "MA", label: "Morocco" },
  { value: "MZ", label: "Mozambique" },
  { value: "MM", label: "Myanmar" },
  { value: "NA", label: "Namibia" },
  { value: "NR", label: "Nauru" },
  { value: "NP", label: "Nepal" },
  { value: "NL", label: "Netherlands" },
  { value: "AN", label: "Netherlands Antilles" },
  { value: "NC", label: "New Caledonia" },
  { value: "NZ", label: "New Zealand" },
  { value: "NI", label: "Nicaragua" },
  { value: "NE", label: "Niger" },
  { value: "NG", label: "Nigeria" },
  { value: "NU", label: "Niue" },
  { value: "NF", label: "Norfolk Island" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "NO", label: "Norway" },
  { value: "OM", label: "Oman" },
  { value: "PK", label: "Pakistan" },
  { value: "PW", label: "Palau" },
  { value: "PS", label: "Palestinian Territory, Occupied" },
  { value: "PA", label: "Panama" },
  { value: "PG", label: "Papua New Guinea" },
  { value: "PY", label: "Paraguay" },
  { value: "PE", label: "Peru" },
  { value: "PH", label: "Philippines" },
  { value: "PN", label: "Pitcairn" },
  { value: "PL", label: "Poland" },
  { value: "PT", label: "Portugal" },
  { value: "PR", label: "Puerto Rico" },
  { value: "QA", label: "Qatar" },
  { value: "RE", label: "Reunion" },
  { value: "RO", label: "Romania" },
  { value: "RU", label: "Russian Federation" },
  { value: "RW", label: "Rwanda" },
  { value: "SH", label: "Saint Helena" },
  { value: "KN", label: "Saint Kitts and Nevis" },
  { value: "LC", label: "Saint Lucia" },
  { value: "PM", label: "Saint Pierre and Miquelon" },
  { value: "VC", label: "Saint Vincent and the Grenadines" },
  { value: "WS", label: "Samoa" },
  { value: "SM", label: "San Marino" },
  { value: "ST", label: "Sao Tome and Principe" },
  { value: "SA", label: "Saudi Arabia" },
  { value: "SN", label: "Senegal" },
  { value: "CS", label: "Serbia and Montenegro" },
  { value: "SC", label: "Seychelles" },
  { value: "SL", label: "Sierra Leone" },
  { value: "SG", label: "Singapore" },
  { value: "SK", label: "Slovakia" },
  { value: "SI", label: "Slovenia" },
  { value: "SB", label: "Solomon Islands" },
  { value: "SO", label: "Somalia" },
  { value: "ZA", label: "South Africa" },
  { value: "GS", label: "South Georgia and the South Sandwich Islands" },
  { value: "ES", label: "Spain" },
  { value: "LK", label: "Sri Lanka" },
  { value: "SD", label: "Sudan" },
  { value: "SR", label: "Suriname" },
  { value: "SJ", label: "Svalbard and Jan Mayen" },
  { value: "SZ", label: "Swaziland" },
  { value: "SE", label: "Sweden" },
  { value: "CH", label: "Switzerland" },
  { value: "SY", label: "Syrian Arab Republic" },
  { value: "TW", label: "Taiwan" },
  { value: "TJ", label: "Tajikistan" },
  { value: "TZ", label: "Tanzania, United Republic of" },
  { value: "TH", label: "Thailand" },
  { value: "TL", label: "Timor-Leste" },
  { value: "TG", label: "Togo" },
  { value: "TK", label: "Tokelau" },
  { value: "TO", label: "Tonga" },
  { value: "TT", label: "Trinidad and Tobago" },
  { value: "TN", label: "Tunisia" },
  { value: "TR", label: "Turkey" },
  { value: "TM", label: "Turkmenistan" },
  { value: "TC", label: "Turks and Caicos Islands" },
  { value: "TV", label: "Tuvalu" },
  { value: "UG", label: "Uganda" },
  { value: "UA", label: "Ukraine" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "UM", label: "United States Minor Outlying Islands" },
  { value: "UY", label: "Uruguay" },
  { value: "UZ", label: "Uzbekistan" },
  { value: "VU", label: "Vanuatu" },
  { value: "VE", label: "Venezuela" },
  { value: "VN", label: "Vietnam" },
  { value: "VG", label: "Virgin Islands, British" },
  { value: "VI", label: "Virgin Islands, U.S." },
  { value: "WF", label: "Wallis and Futuna" },
  { value: "EH", label: "Western Sahara" },
  { value: "YE", label: "Yemen" },
  { value: "ZM", label: "Zambia" },
  { value: "ZW", label: "Zimbabwe" },
]

// Stripe Payment Form Component
const StripePaymentForm = ({ onSubmit, isLoading, setCardholderName, setCountry, setBillingSameAsShipping, country, billingSameAsShipping, cardholderName, user, paymentLoading, setPaymentLoading }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [commandOpen, setCommandOpen] = useState(false)

  // Error states
  const [cardNumberError, setCardNumberError] = useState(null)
  const [cardExpiryError, setCardExpiryError] = useState(null)
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

