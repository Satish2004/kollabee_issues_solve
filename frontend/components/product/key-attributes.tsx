import React from "react";

const keyAttributes = {
  industrySpecific: [
    { attribute: "Material", value: "Polyester / Cotton" },
    {
      attribute: "Fabric Weight",
      value: "280 grams, 380 grams, 400 grams, 480 grams, 500 grams, 330 grams",
    },
    {
      attribute: "Technics",
      value:
        "embroidered, Printed, 3D embroidery, Affixed cloth embroidery, towel embroidery",
    },
  ],
  otherAttributes: [
    { attribute: "Collar", value: "Hooded" },
    { attribute: "Fabric Type", value: "Fleece/Terry" },
    { attribute: "Fit Type", value: "Regular Fit" },
  ],
};

const KeyAttributes = () => {
  return (
    <div className="w-full max-w-2xl rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Key attributes</h2>

      {/* Industry-specific attributes */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-600 mb-2">
          Industry-specific attributes
        </h3>
        <table className="w-full text-sm border-collapse border-[#DDDDDD]">
          <tbody>
            {keyAttributes.industrySpecific.map((item, index) => (
              <tr key={index}>
                {/* First column */}
                <td className="w-[40%] border p-3 font-medium text-gray-700 border-r">
                  {item.attribute}
                </td>
                <td className="border border-l w-1"></td>
                {/* Second column */}
                <td className="border p-3 border-l text-gray-600">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Other attributes */}
      <div>
        <h3 className="text-md font-semibold text-gray-600 mb-2">
          Other attributes
        </h3>
        <table className="w-full text-sm border-collapse border-[#DDDDDD]">
          <tbody>
            {keyAttributes.otherAttributes.map((item, index) => (
              <tr key={index}>
                {/* First column */}
                <td className="w-[40%] border p-3 font-medium text-gray-700 border-r-1">
                  {item.attribute}
                </td>
                <td className="border border-l w-1" />
                {/* Second column */}
                <td className="border p-3 border-l-1 text-gray-600">
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeyAttributes;
