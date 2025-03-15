"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  { id: "all", label: "All" },
  { id: "apparel", label: "Apparel & Accessories" },
  { id: "fabric", label: "Fabric" },
  { id: "accessories", label: "Accessories" },
  { id: "packaging", label: "Packaging and Printing" },
]

const tags = [
  { id: "most-popular", label: "Most Popular" },
  { id: "hot-selling", label: "Hot Selling" },
]

const products = [
  {
    id: 1,
    name: "Gregor Metal Chair (Black)",
    price: 4399,
    originalPrice: 7399,
    discount: 41,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Gregor Metal Chair (Black)",
    price: 4399,
    originalPrice: 7399,
    discount: 41,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Gregor Metal Chair (Black)",
    price: 4399,
    originalPrice: 7399,
    discount: 41,
    image: "/placeholder.svg",
  },
]

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState("all")
  const [tag, setTag] = useState("most-popular")

  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all"
    const tagParam = searchParams.get("tag") || "most-popular"
    setCategory(categoryParam)
    setTag(tagParam)
  }, [searchParams])

  const updateURL = useCallback(
    (newCategory?: string, newTag?: string) => {
      const params = new URLSearchParams(searchParams)
      if (newCategory) params.set("category", newCategory)
      if (newTag) params.set("tag", newTag)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-tr from-[#f4eadc] via-[#f1c2ca] to-[#f4eadc] pb-12">
        <div className="container px-4 pt-8 mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Outdoor Furniture for Balcony</h1>
            <p className="text-muted-foreground mb-4">Transform your outdoors with durable and stylish furniture</p>
            <Button  className="bg-gradient-to-r from-[#9e1171] to-[#f0b168] text-white rounded-[6px] p-5 hover:bg-gradient-to-r hover:from-[#9e1171] hover:to-[#f0b168] hover:border-none hover:text-white font-semibold">
          Upto 41% Off
        </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {products.map((product) => (
              <div key={product.id} className="relative bg-white rounded-lg p-4 shadow-sm">
                <div className="aspect-square relative mb-3 bg-stone-300 rounded-md">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                <button className="absolute right-2 bottom-2 z-10 rounded-full bg-white p-1.5 shadow-sm">
                  <Heart className="h-4 w-4" />
                </button>
                </div>
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">₹{product.price}</span>
                  <span className="text-muted-foreground line-through text-sm">₹{product.originalPrice}</span>
                  <span className="text-red-500 text-sm">{product.discount}%off</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" bg-white mt-8 p-6 mx-auto rounded-xl">
        <Tabs value={category} className="w-full mb-6 border-b-2 border-gray-200 pb-6">
          <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => updateURL(cat.id)}
                className={cn(
                  "data-[state=active]:border-b-4 border-orange-600  shadow-none ",
                  "",
                )}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex gap-4 mb-8">
          {tags.map((t) => (
            <Button
              key={t.id}
              onClick={() => updateURL(undefined, t.id)}
              className={`rounded-full shadow-none ${tag === t.id ? "bg-zinc-800 text-white" : "bg-gray-100"}`}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      <div className=" mt-8 p-6 bg-white rounded-xl min-h-[400px] flex items-center justify-center text-muted-foreground">
          Product grid will be displayed here based on selected filters: Category: {category}, Tag: {tag}
        </div>
    </main>
  )
}

