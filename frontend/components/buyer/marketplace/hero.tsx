'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';

// Product type definition
interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
}

// Product card component
const ProductCard = ({ title, image, price, originalPrice }: Product) => {
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-[1.02]">
      <div className="relative">
        <div className="aspect-[4/3] relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <button 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="px-4 py-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-gray-500 line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-red-500">{discount}% off</span>
        </div>
      </div>
    </div>
  );
};

// Update the static products with Unsplash images
const staticProducts: Product[] = [
  {
    id: '1',
    title: "Modern Lounge Chair (Black)",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&auto=format&fit=crop&q=60",
    price: 4399,
    originalPrice: 7399,
  },
  {
    id: '2',
    title: "Outdoor Dining Set",
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&auto=format&fit=crop&q=60",
    price: 4399,
    originalPrice: 7399,
  },
  {
    id: '3',
    title: "Rattan Garden Chair",
    image: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?w=800&auto=format&fit=crop&q=60",
    price: 4399,
    originalPrice: 7399,
  }
];

const Banner = () => {
  const [products, setProducts] = useState<Product[]>(staticProducts); // Initialize with static data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) console.log('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Keep using static products if fetch fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative px-4 py-4" style={{background: "radial-gradient(60.76% 66.63% at 39.24% 33.37%, rgba(234, 61, 79, 0.3) 0%, rgba(225, 13, 94, 0.12) 50%, rgba(251, 165, 51, 0.12) 100%)"}}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-4">
            Outdoor Furniture for Balcony
          </h1>
          <p className="text-gray-600 mb-3">
            Transform your outdoors with durable and stylish furniture
          </p>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-800 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Upto 41% Off
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner; 