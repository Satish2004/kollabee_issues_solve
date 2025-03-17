"use client"

import React from "react"

import Image from "next/image"
import { useState, useEffect } from "react"

interface CartItemProps {
  id: string
  name: string
  image: string
  price: number
  initialQuantity: number
  minQuantity?: number
  onQuantityChange: (id: string, quantity: number) => void
}

export function CartItem({
  id,
  name,
  image,
  price,
  initialQuantity,
  minQuantity = 1,
  onQuantityChange,
}: CartItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onQuantityChange(id, newQuantity)
    }
  }

  const handleIncrease = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onQuantityChange(id, newQuantity)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number.parseInt(e.target.value.replace(/,/g, "")) || minQuantity
    if (newQuantity >= minQuantity) {
      setQuantity(newQuantity)
      onQuantityChange(id, newQuantity)
    }
  }

  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  return (
    <div className="flex items-center py-4 border-b">
      <div className="flex items-center flex-1">
        <div className="w-12 h-12 mr-4 relative">
          <Image src={"/placeholder.png"} alt={name} fill className="object-cover rounded-md" />
        </div>
        <span className="font-medium">{name}</span>
      </div>

      <div className="flex items-center justify-center w-40">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-500 hover:bg-gray-100"
        >
          −
        </button>
        <input
          type="text"
          value={quantity.toLocaleString()}
          onChange={handleChange}
          className="w-24 mx-2 px-2 py-1 text-center border rounded-md"
        />
        <button
          onClick={handleIncrease}
          className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-500 hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="w-24 text-right font-medium">${(price * quantity).toFixed(2)}</div>
    </div>
  )
}

