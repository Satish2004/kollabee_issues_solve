import React from 'react'
import ProductCard from '../../../../../components/product/product-card'

function page() {
  return (
    <div className='grid grid-cols-1 gap-4 p-4 md:grid-cols-4 bg-white p-4 rounded-xl'>
    {products.map((product, index) => (
        <ProductCard key={index} {...product} />
    ))}

    </div>
  )
}

export default page


const products = Array(4).fill({
    image: "/placeholder.svg?height=300&width=400",
    rating: 5.0,
    reviews: 11,
    priceRange: "$850.00-1,100.00",
    minOrder: "200 Pieces",
    supplier: {
      name: "Marcos Cottons Co.,Ltd",
      years: 2,
      country: "CN",
      verified: true,
    },
  })