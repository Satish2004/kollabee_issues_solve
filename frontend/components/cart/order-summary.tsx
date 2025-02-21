import React from "react";

type orderSummaryProps = {
    cartItems: any;
    shippingAddress: string;
    subtotal: number;
    discount: number;
    shippingCost: number;
    points: number;
}

const OrderSummary = ({
  cartItems,
  shippingAddress,
  subtotal,
  discount,
  shippingCost,
  points,
}: orderSummaryProps) => {
  const total = subtotal - discount - points + shippingCost;

  return (
    <div className="max-w-5xl bg-white p-6 rounded-lg">
      {/* Order Items Table */}
      <div className="mb-8">
        {cartItems.map((item: any, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="text-gray-700">{item.name}</span>
            <span className="text-gray-700 flex gap-2">
              <span className="text-[f4f4f4]">Quantity</span>
              {item.quantity}
            </span>
            <span className="text-gray-700 font-semibold">
              ${item.quantity * item.price.toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <span className="font-semibold text-lg text-gray-800">Total:</span>
          <span className="text-red-500">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping and Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Shipping Summary */}
        <div className="p-4 rounded-lg">
          <p className="text-gray-700 flex justify-between">
            <span className="font-semibold">Shipping Address:</span>{" "}
            <span className="text-right">{shippingAddress}</span>
          </p>
          <p className="text-gray-700 mt-2 flex justify-between">
            <span className="font-semibold">Shipping Options:</span> Same Day
            Dispatching
          </p>
          <p className="text-gray-700 mt-2 flex justify-between">
            <span className="font-semibold">Email Money Transfer</span>Interac
          </p>
        </div>

        {/* Payment Summary */}
        <div className="p-4 rounded-lg text-sm">
          <p className="text-gray-700 flex justify-between">
            <span className="font-semibold text-gray-500">Subtotal</span> $
            {subtotal.toFixed(2)}
          </p>
          <p className="text-gray-700 flex justify-between">
            <span className="font-semibold text-gray-500">Discount</span> -$
            {discount.toFixed(2)}
          </p>
          <p className="text-gray-700 flex justify-between">
            <span className="font-semibold text-gray-500">Shipping Cost</span> $
            {shippingCost.toFixed(2)}
          </p>
          <p className="text-gray-700 flex justify-between">
            <span className="font-semibold text-gray-500">Points Applied</span>{" "}
            -$
            {points.toFixed(2)}
          </p>
          <p className="text-gray-800 font-semibold text-lg mt-4 flex justify-between">
            Total:
            <span className="text-red-500">${total.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
