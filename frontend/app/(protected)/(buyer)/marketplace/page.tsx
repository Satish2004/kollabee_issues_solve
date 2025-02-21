'use client'
import { useState } from 'react'
import Hero from '@/components/buyer/marketplace/hero'
import FilterNav from '@/components/buyer/marketplace/filterNav'
import ProductCard from '@/components/buyer/productCard'
import { type Product } from '@prisma/client'

// Extend the Product type to include nested relations
type ProductWithRelations = Product & {
  seller: {
    id: string
    businessName: string
    country: string
    yearEstablished?: number
    isVerified?: boolean
  }
  category: {
    id: string
    name: string
  }
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSort, setSelectedSort] = useState('popular')

  // Example products data matching Prisma schema
  const products: ProductWithRelations[] = [
    {
      id: '1',
      name: 'Premium Cotton T-Shirt Bulk',
      description: 'High quality cotton t-shirts for wholesale manufacturing',
      price: 1100,
      wholesalePrice: 850,
      minOrderQuantity: 200,
      availableQuantity: 10000,
      images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000"],
      sellerId: 's1',
      categoryId: 'c1',
      createdAt: new Date(),
      updatedAt: new Date(),
      seller: {
        id: 's1',
        businessName: "Marcos Cottons Co.,Ltd",
        country: "CN",
        yearEstablished: 2022,
        isVerified: true
      },
      category: {
        id: 'c1',
        name: 'Apparel'
      }
    },
    {
      id: '2',
      name: 'Organic Cotton Fabric Rolls',
      description: 'Premium organic cotton fabric for garment manufacturing',
      price: 900,
      wholesalePrice: 750,
      minOrderQuantity: 150,
      availableQuantity: 5000,
      images: ["https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000"],
      sellerId: 's2',
      categoryId: 'c2',
      createdAt: new Date(),
      updatedAt: new Date(),
      seller: {
        id: 's2',
        businessName: "Quality Textiles Ltd",
        country: "IN",
        yearEstablished: 2021,
        isVerified: true
      },
      category: {
        id: 'c2',
        name: 'Fabrics'
      }
    },
    {
      id: '3',
      name: 'Denim Collection 2024',
      description: 'Premium denim fabric in various weights and finishes',
      price: 1200,
      wholesalePrice: 950,
      minOrderQuantity: 300,
      availableQuantity: 8000,
      images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000"],
      sellerId: 's3',
      categoryId: 'c3',
      createdAt: new Date(),
      updatedAt: new Date(),
      seller: {
        id: 's3',
        businessName: "Fashion Fabrics Inc",
        country: "TR",
        yearEstablished: 2019,
        isVerified: true
      },
      category: {
        id: 'c3',
        name: 'Denim'
      }
    },
    {
      id: '4',
      name: 'Sustainable Bamboo Fabric',
      description: 'Eco-friendly bamboo textile for modern fashion',
      price: 800,
      wholesalePrice: 650,
      minOrderQuantity: 250,
      availableQuantity: 6000,
      images: ["https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000"],
      sellerId: 's4',
      categoryId: 'c4',
      createdAt: new Date(),
      updatedAt: new Date(),
      seller: {
        id: 's4',
        businessName: "Global Garments Co",
        country: "VN",
        yearEstablished: 2020,
        isVerified: true
      },
      category: {
        id: 'c4',
        name: 'Sustainable'
      }
    }
  ]

  return (
    <div className="h-full bg-white dark:bg-gray-950">
      <Hero />
      <FilterNav 
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
      />
      
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onContactClick={() => console.log('Contact clicked for product', product.id)}
              onEnquiryClick={() => console.log('Enquiry clicked for product', product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
