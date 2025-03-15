import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CompanyProfile() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-U7e3HiixblqP4accAil3boZOZH5IN7.png"
          alt="Company factory"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60">
          <div className="container">
            <div className="flex items-center gap-2 py-4 text-white">
              <Link href="/companies" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
              <span className="text-muted">•</span>
              <span>GHC International Trade (chengdu) Co., Ltd.</span>
            </div>
          </div>
          <div className="absolute bottom-0 container pb-8">
            <div className="space-y-1 text-white">
              <div className="flex items-center gap-2 text-sm">
                <span>Top 100 Supplier on Kaliclue</span>
                <span>•</span>
                <span>#1 Most popular Supplier in Men's Regular Sleeve Hoodies & Sweatshirts</span>
              </div>
              <h1 className="text-3xl font-bold">HC International Trade (chengdu) Co., Ltd.</h1>
              <div className="flex items-center gap-4 text-sm">
                <span>Sichuan, China</span>
                <span>•</span>
                <span>4 years</span>
                <span>•</span>
                <span>30 staff</span>
              </div>
              <p className="text-sm">
                Main categories: Men's Suits, Wool Fabric, Formal Dress Shirts, Women's Dress, Muslim Clothing
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <span className="text-xl font-bold">4.7</span>
                  <span className="text-sm">/5</span>
                </div>
                <span className="text-sm text-muted-foreground">(62 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
            <TabsContent value="profile" className="space-y-8 mt-0">
              <section>
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                <div className="grid gap-4 text-sm">
                  <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
                    <div>
                      <p className="text-muted-foreground">Company registration date</p>
                      <p>2021-11-17</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Floor space(㎡)</p>
                      <p>500</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annual export revenue (USD)</p>
                      <p>5050000</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Accepted languages</p>
                      <p>Chinese,English</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="text-center text-muted-foreground">No products to display</div>
            </TabsContent>

            {/* Shipping Card */}
            <div className="lg:row-span-2">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Shipping</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Shipping solutions for the selected quantity are currently unavailable
                </p>
                <div className="space-y-4">
                  <Button className="w-full">Send Enquiry</Button>
                  <Button variant="outline" className="w-full">
                    Chat Now
                  </Button>
                  <div className="space-y-3">
                    <h4 className="font-medium">Protections for this product</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Secure payments</p>
                        <p className="text-muted-foreground">
                          Every payment on Kaliclue is secured with SSL encryption and PCI DSS data protection
                          protocols.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 mt-1 text-primary" />
                      <div>
                        <p className="font-medium">Easy Return & Refund</p>
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

