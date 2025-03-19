"use client"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CompanyProfile() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px]">
        <Image
          src=""
          alt="Company factory"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60 p-4 ">
          <div className="container">
            <div className="flex items-center gap-2 py-2 bg-white w-fit px-4 rounded-lg">
              <Button onClick={() => router.back()} className="flex items-center gap-2 font-semibold shadow-none">
                <ChevronLeft className="h-4 w-4" strokeWidth={4} />
                <span>Back</span>
              </Button>
              <span className="text-muted">•</span>
              <span>GHC International Trade (chengdu) Co., Ltd.</span>
            </div>
          </div>
          <div className="absolute bottom-0 container pb-2">
            <div className="space-y-4 text-white">
              <div className="flex flex-col gap-3 text-sm">
                <span>Top 100 Supplier on Kaliclue</span>
                <span>#1 Most popular Supplier in Men's Regular Sleeve Hoodies & Sweatshirts</span>
              </div>
              <h1 className="text-3xl font-bold">HC International Trade (chengdu) Co., Ltd.</h1>
              <div className="flex items-center gap-4 text-lg">
                <span>Sichuan, China</span>
                <span>•</span>
                <span>4 years</span>
                <span>•</span>
                <span>30 staff</span>
                <p className="text-lg">
                Main categories: Men's Suits, Wool Fabric, Formal Dress Shirts, Women's Dress, Muslim Clothing
              </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-end">
                  <span className="text-2xl font-bold">4.7</span>
                  <span>/</span><span className="text-sm">5</span>
                </div>
                <span className="text-sm text-muted-foreground">(62 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" py-6 px-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="space-x-4 ">
            <TabsTrigger value="profile" className="font-semibold text-gray-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 rounded-none data-[state=active]:border-gray-600">Profile</TabsTrigger>
            <TabsTrigger value="products" className="font-semibold text-gray-600 data-[state=active]:shadow-none data-[state=active]:border-b-2 rounded-none data-[state=active]:border-gray-600">Products</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px] ml-10">
            <TabsContent value="profile" className="space-y-8 mt-0">
              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <h2 className="text-lg font-semibold mb-4 col-span-1">Overview</h2>
                <div className="grid gap-4 text-sm col-span-2">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-lg">
                    <div>
                      <p className="text-muted-foreground font-semibold">Company registration date</p>
                      <p>2021-11-17</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold">Floor space(㎡)</p>
                      <p>500</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold">Annual export revenue (USD)</p>
                      <p>5050000</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold">Accepted languages</p>
                      <p>Chinese,English</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold">Years of exporting</p>
                      <p>4</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold">Years in Industry</p>
                      <p>4</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <h2 className="text-lg font-semibold mb-4 col-span-1">Certifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 col-span-2">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="p-4">
                      <Image
                        src="/placeholder.svg"
                        alt={`Certification ${i + 1}`}
                        width={200}
                        height={280}
                        className="w-full object-cover mb-2"
                      />
                      <p className="text-sm font-medium">ROHS</p>
                      <p className="text-xs text-muted-foreground">INSPECTION REF: CN</p>
                    </Card>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <h2 className="text-lg font-semibold mb-4 col-span-1">Production Capabilities</h2>
                <div className="grid gap-4 text-sm col-span-2">
                  <div className="grid grid-cols-2 gap-4 rounded-lg">
                    <div>
                      <p className="text-muted-foreground font-semibold">Production Lines</p>
                      <p>1</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <h2 className="text-lg font-bold mb-4 col-span-1">Quality Control</h2>
                <div className="grid gap-4 text-sm col-span-2">
                  <div className=" gap-4 rounded-lg">
                    <div className="w-full">
                      <p className="text-muted-foreground font-semibold">Production Support Traceability of raw materials</p>
                      <p>No</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                <h2 className="text-2xl font-medium mb-6 col-span-1">Reviews (62)</h2>
                <div className="flex items-end mb-6">
                  <span className="text-5xl font-[900] gradient-text">4.7</span>
                  <span className="text-3xl gradient-text">/</span><span className="text-2xl  gradient-text">5</span>
                </div>
                <h2 className="text- font-semibold col-span-1">Satisfied</h2>
                <h2 className="text- font-medium mb-4 col-span-1">62 <span className="text-sm">reviews</span></h2>
                </div>
                <div className="grid gap-4 text-sm col-span-2">
                  <div className=" gap-4 rounded-lg">
                    <div className="w-full">
                      <div className="flex gap-3 items-center">
                        <span className="text-lg font-[900]">•</span>
                        <p className="font-medium w-32">Supplier Service</p>
                        <div className="w-40 h-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] rounded-full"></div>
                        <p className="text-lg">4.7</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-lg font-[900]">•</span>
                        <p className="font-medium  w-32">Ontime Shipment</p>
                        <div className="w-40 h-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] rounded-full"></div>
                        <p className="text-lg">4.7</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <span className="text-lg font-[900]">•</span>
                        <p className="font-medium  w-32">Product Quality</p>
                        <div className="w-40 h-1 bg-gradient-to-r from-[#9e1171] to-[#f0b168] rounded-full"></div>
                        <p className="text-lg">4.7</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="text-center text-muted-foreground">No products to display</div>
            </TabsContent>

            {/* Shipping Card */}
            <div className="lg:row-span-2">
              <Card className="p-4 border-none shadow">
                <h3 className="font-semibold text-xl mb-4">Shipping</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Shipping solutions for the selected quantity are currently unavailable
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full bg-gradient-to-r from-[#940b73] to-[#f2bc6d] text-white py-5 font-semibold">Send Enquiry</Button>
                  <Button variant="outline" className="w-full gradient-border gradient-text font-semibold py-5">
                    Chat Now
                  </Button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-2xl ">Protections for this product</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">Secure payments</p>
                        <p className="text-muted-foreground">
                          Every payment on Kaliclue is secured with SSL encryption and PCI DSS data protection
                          protocols.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-semibold">Easy Return & Refund</p>
                        <p className="text-muted-foreground">
                          Claims refund if your order is missing or arrives with product issues.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </main>
  )
}

