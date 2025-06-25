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
import { useCheckout } from "../../../../../../contexts/checkout-context"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
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
  const [hasFetchedAddresses, setHasFetchedAddresses] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName:  "",
      lastName: "",
      email: "",
      companyName:  "",
      address: "",
      city:  "",
      state: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
    },
  })

  useEffect(() => {
    if (currentAddress) {
      form.reset(currentAddress);
    }
  }, [currentAddress, form])

  useEffect(() => {
    if (savedAddresses.length === 0 && !hasFetchedAddresses) {
      fetchAddresses().then(() => {
        setHasFetchedAddresses(true)
        console.log(savedAddresses.length)
        // if (savedAddresses.length === 0) {
        //   setShowNewAddressForm(true)
        // }
      }) 
      //TODO: WE HAVE TO MAKE SURE WHEN NO ADDRESS IS THERE, THE ADD NEW ADDRESS SHALL AUTO OPEN
    }
  }, [savedAddresses, hasFetchedAddresses, fetchAddresses])



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
      companyName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phoneNumber: "",
    })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedAddressId) {
      onNext()
    } else if (showNewAddressForm) {
      const newAddress: any = {
        id: currentAddress?.id || `new-${Date.now()}`,
        ...values,
      }
      try {
        await addNewAddress(newAddress)
        toast('Address added successfully')
        onNext()
      } catch (error) {
        toast('Failed to add address')
      }
    } else {
      alert("Please select a shipping address or add a new one")
    }
  }

  const handleFieldChange = (field: keyof z.infer<typeof formSchema>, value: string | boolean) => {
    updateCurrentAddress({ [field]: value })
  }

  const handleOrderSummaryNext = () => {
    if (showNewAddressForm) {
      form.handleSubmit(onSubmit)()
    } else {
      onNext()
    }
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
      <div className="md:col-span-2 bg-white px-6 pb-6 rounded-lg">
        <h2 className="text-2xl font-[900] mb-6">Shipping Address</h2>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Corp"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("companyName", e.target.value)
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="America"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            handleFieldChange("country", e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(123) 456-7890"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleFieldChange("phoneNumber", e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Submit Address
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>

      <div>
        <OrderSummary onNext={handleOrderSummaryNext} buttonText={`Checkout | `} />
      </div>
    </div>
  )
}

