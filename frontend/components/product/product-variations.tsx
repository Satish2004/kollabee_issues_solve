import React from "react";

const variations = {
  prices: [
    { range: "2 - 999 pieces", price: "$0.99" },
    { range: "1000 - 4999 pieces", price: "$0.43" },
    { range: ">= 5000 pieces", price: "$0.23" },
  ],
  totalOptions: { colors: 8, sizes: 6, methods: 5 },
  colors: ["Brown", "Black", "Pink", "Light Pink", "Red", "Grey", "Blue"],
  sizes: ["S", "M", "L", "XL", "2 XL", "3 XL"],
  methods: [
    "Puff Printing",
    "Embossed",
    "Heat-transfer Printing",
    "Digital Printing",
    "Silk Screen Printing",
  ],
};

const protections = [
  {
    title: "Secure payments",
    description:
      "Every payment you make on KollaBee is secured with strict SSL encryption and PCI DSS data protection protocols",
  },
  {
    title: "Easy Return & Refund",
    description:
      "Claim a refund if your order is missing or arrives with product issues, plus free local returns for defects on qualifying purchases",
  },
];

type ProductVariationsProps = {
  setChatOpen: () => void;
};

const ProductVariations = (props: ProductVariationsProps) => {
  return (
    <div className="p-3 border rounded-lg shadow-md max-w-md h-auto font-sans bg-white self-start">
      {/* Pricing Section */}
      <div className="grid grid-cols-3 text-center text-sm font-medium gap-2 mb-4">
        {variations.prices.map((item, index) => (
          <div key={index}>
            <div>{item.range}</div>
            <div className="text-lg font-semibold">{item.price}</div>
          </div>
        ))}
      </div>

      {/* Variations Section */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Variations</h3>
        <p className="text-sm text-gray-600">
          Total options: {variations.totalOptions.colors} Color ;{" "}
          {variations.totalOptions.sizes} Size ;{" "}
          {variations.totalOptions.methods} Printing Methods
        </p>

        {/* Colors */}
        <div className="mb-3">
          <h4 className="text-sm font-bold mb-2">
            Color({variations.colors.length}): Blue
          </h4>
          <div className="flex items-center gap-1">
            {variations.colors.map((color, index) => (
              <button
                key={index}
                className="w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-xs text-gray-600"
              >
                {color[0]}
              </button>
            ))}
            <button className="w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-xs text-black">
              +1
            </button>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-3">
          <h4 className="text-sm font-bold mb-2">
            Size({variations.sizes.length}): S
          </h4>
          <div className="flex gap-1">
            {variations.sizes.map((size, index) => (
              <button
                key={index}
                className="px-2 py-1 border rounded text-sm font-medium"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Printing Methods */}
        <div>
          <h4 className="text-sm font-bold mb-2">
            Printing Methods({variations.methods.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {variations.methods.map((method, index) => (
              <button
                key={index}
                className="px-2 py-1 border rounded text-sm font-medium"
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Shipping Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Shipping</h3>
        <p className="text-sm">
          Shipping solutions for the selected quantity are currently unavailable
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-4">
        <button className="flex-1 text-white bg-gradient-to-r from-[#E10D5E] to-[#FBA533] py-2 px-4 rounded-md text-sm font-medium">
          Send Enquiry
        </button>
        <button
          className="flex-1 bg-[#f6f6f6] border border-[#DDDDDD] py-2 px-4 rounded-md text-sm font-semibold"
          onClick={props.setChatOpen}
        >
          Chat Now
        </button>
      </div>

      {/* Divider */}
      <div className="border-b my-3"></div>

      {/* Protections */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Protections for this product
        </h3>
        {protections.map((protection, index) => (
          <div key={index} className="mb-4 flex flex-col gap-2">
            <h4 className="text-sm font-semibold">{protection.title}</h4>
            <p className="text-sm">{protection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductVariations;
