import React from "react";
import { ShoppingCart, CreditCard, Check, Wallet, Ticket } from "lucide-react";

interface CartProgressProps {
  stepCompleted: number;
}

const CartProgress = ({ stepCompleted }: CartProgressProps) => {
  const steps = [
    {
      icon: stepCompleted > 0 ? <Check className="p-2 rounded-full bg-white" size={30} /> : <ShoppingCart className="p-2 rounded-full bg-white" size={30} />,
      label: "Shopping Cart",
    },
    {
      icon: stepCompleted > 1 ? <Check className="p-2 rounded-full bg-white" size={30} /> : <Wallet className="p-2 rounded-full bg-white" size={30} />,
      label: "Checkout",
    },
    {
      icon: stepCompleted > 1 ? <Check className="p-2 rounded-full bg-white" size={30} /> : <Ticket className="p-2 rounded-full bg-white" size={30} />,
      label: "Order Complete",
    },
  ];

  return (
    <div className="w-full bg-[#F4F4F4] flex items-center justify-center">
      
      <div className="flex items-center px-4 py-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`flex items-center ${
                stepCompleted >= index ? "text-black" : "text-gray-400"
              }`}
            >
              {step.icon}
              <span className="ml-2">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-px bg-gray-300 mx-4"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CartProgress;
