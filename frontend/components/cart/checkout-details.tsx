import React from "react";

interface CheckoutDetailsProps {
  subtotal: number;
  discount: number;
  shipping: number;
  totalQuantity: number; // Total quantity of items in the cart
  goalQuantity?: number; // Default goal quantity is 100,000
  steps: number;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  handlePayment: () => Promise<void>;
  isProcessing: boolean;
}

const CheckoutDetails = ({
  subtotal,
  discount,
  shipping,
  totalQuantity,
  goalQuantity = 100000,
  steps,
  setSteps,
  handlePayment,
  isProcessing,
}: CheckoutDetailsProps) => {
  const progressPercentage = Math.min(
    (totalQuantity / goalQuantity) * 100,
    100
  );

  

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-[420px] h-[345px] flex flex-col justify-between">
      {/* Details */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Discount</span>
          <span>${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping Costs</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-md">
          <span className="font-extrabold">Total</span>
          <span>${(subtotal + discount + shipping).toFixed(2)}</span>
        </div>
        <div className="border-t border-[#F4F4F4]"></div>

        {/* Progress Bar */}
        <div className="mb-4">
          {/* <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#F7931A] h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div> */}
          <p className="text-sm my-2 text-gray-600">
            Get Free <span className="text-black font-semibold">Shipping</span>{" "}
            for orders over{" "}
            <span className="text-black font-semibold">1000 Quantitiy</span>
          </p>
          <p>Continue Shopping</p>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        disabled={isProcessing}
        className="w-full bg-black text-white py-2 rounded-lg font-medium  transition"
        onClick={async() => {
          if (steps == 0) {
            setSteps(p => p + 1)
            return
          }
          if (steps == 1) {
            await handlePayment()          }
        }}
      >{steps == 0 ? "Next" : isProcessing ? "Processing..." : "Checkout"}
        {/* {isProcessing ? "Processing..." : "Checkout"} */}
      </button>
      <div className="border-t border-[#F4F4F4]"></div>
    </div>
  );
};

export default CheckoutDetails;