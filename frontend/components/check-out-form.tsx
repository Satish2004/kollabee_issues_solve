'use client'

import React from 'react'
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckOutForm = () => {
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Create an order
      const response = await fetch("/api/create-order", {
        method: "POST"
      });
      const data = await response.json();

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: totalAmount,
        Currency: "INR",
        name: "Kollabee",
        descriptions: "Test Transaction",
        orderId: data.orderId,
        handler: function (response) {
          alert("payment successful");
          console.log(response);
        },
        prefill: {...formData}
      }
      const rzp = window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed ", error);
    } finally {
      setIsProcessing(false);
    }
   }
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
      />

      <div className="bg-gray-100 ">
        <div className="w-full max-w-3xl mx-auto p-8">
          <div className="bg-white  p-8 rounded-lg shadow-md border">
            <h1 className="text-2xl font-bold text-gray-800  mb-4">Checkout</h1>

            <form>
              {/* Shipping Address */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700  mb-2">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Address"
                    className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City"
                    className="w-full rounded-lg border py-2 pl-10 pr-3   "
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      id="state"
                      name="state"
                      placeholder="State"
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      placeholder="ZIP Code"
                      className="w-full rounded-lg border py-2 pl-10 pr-3   "
                      value={formData.zip}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 grid md:grid-cols-2">
                <p className="text-lg font-semibold my-2 md:my-0">
                  Total Amount:{" "}
                  <span className="text-xl font-bold ">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
            border-blue-600
            border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* {pay && <Checkout data={totalAmount} user={allData} />} */}
    </>
  );
}

export default CheckOutForm;
