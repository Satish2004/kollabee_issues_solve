"use client"

import  React from "react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { OrderSummary } from "./order-summary"
import { AddressCard } from "./address-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useCheckout } from "../../../../../../checkout-context"
import { useForm } from "react-hook-form"

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phone: z.string().min(1, "Phone number is required"),
  saveAsDefault: z.boolean().default(false),
})

interface ShippingAddressProps {
  onNext: () => void
}

export function ShippingAddress({ onNext }: ShippingAddressProps) {
  const {
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    currentAddress,
    updateCurrentAddress,
    addNewAddress,
    fetchAddresses,
    isLoading,
  } = useCheckout()

  const [showNewAddressForm, setShowNewAddressForm] = useState(false)

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentAddress?.firstName || "",
      lastName: currentAddress?.lastName || "",
      email: currentAddress?.email || "",
      address: currentAddress?.address || "",
      city: currentAddress?.city || "",
      state: currentAddress?.state || "",
      zipCode: currentAddress?.zipCode || "",
      phone: currentAddress?.phone || "",
      saveAsDefault: false,
    },
  })

  // Update form values when currentAddress changes
  useEffect(() => {
    if (currentAddress) {
      form.reset({
        firstName: currentAddress.firstName || "",
        lastName: currentAddress.lastName || "",
        email: currentAddress.email || "",
        address: currentAddress.address || "",
        city: currentAddress.city || "",
        state: currentAddress.state || "",
        zipCode: currentAddress.zipCode || "",
        phone: currentAddress.phone || "",
        saveAsDefault: false,
      })
    }
  }, [currentAddress, form])

  useEffect(() => {
    // Fetch saved addresses when component mounts
    if (savedAddresses.length === 0) {
      fetchAddresses()
    }
  }, [fetchAddresses, savedAddresses.length])

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    setShowNewAddressForm(false)
  }

  const handleNewAddressClick = () => {
    setSelectedAddressId(null)
    setShowNewAddressForm(true)
    updateCurrentAddress({ id: `new-${Date.now()}` })
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      saveAsDefault: false,
    })
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedAddressId) {
      // Using existing address
      onNext()
    } else if (showNewAddressForm) {
      // Save new address
      const newAddress: Address = {
        id: currentAddress?.id || `new-${Date.now()}`,
        ...values,
        isDefault: values.saveAsDefault,
      }
      addNewAddress(newAddress)
      onNext()
    } else {
      // No address selected
      alert("Please select a shipping address or add a new one")
    }
  }

  // Handle form field changes and update context
  const handleFieldChange = (field: keyof z.infer<typeof formSchema>, value: string | boolean) => {
    updateCurrentAddress({ [field]: value })
  }

  if (isLoading && savedAddresses.length === 0) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-6 rounded-lg border">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading addresses...</p>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white p-6 rounded-lg border h-64 animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-6 rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

        {savedAddresses.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Saved Addresses</h3>
            <div className="space-y-3">
              {savedAddresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isSelected={selectedAddressId === address.id}
                  onSelect={handleAddressSelect}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <Button
            type="button"
            onClick={handleNewAddressClick}
            variant="outline"
            className={`flex items-center ${showNewAddressForm ? "bg-gray-100" : ""}`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {showNewAddressForm ? "Adding New Address" : "Add New Address"}
          </Button>
        </div>

        {showNewAddressForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("firstName", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("lastName", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleFieldChange("email", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleFieldChange("address", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("city", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NY"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("state", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("zipCode", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(123) 456-7890"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleFieldChange("phone", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="saveAsDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          handleFieldChange("saveAsDefault", !!checked)
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Save as default address</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                Continue to Payment
              </Button>
            </form>
          </Form>
        )}

        {!showNewAddressForm && (
          <div className="mt-6">
            <Button
              onClick={() =>
                selectedAddressId ? onNext() : alert("Please select a shipping address or add a new one")
              }
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Continue to Payment
            </Button>
          </div>
        )}
      </div>

      <div>
        <OrderSummary onNext={onNext} buttonText={`Checkout | `} />
      </div>
    </div>
  )
}

