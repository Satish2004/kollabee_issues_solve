const sellerData = {
  name: "Guangzhou Duoxi Trading Firm (Sole Proprietorship)",
  country: "CN",
  years: "1 yr",
  location: "Located in CN",
  about:
    "Welcome to Guangzhou Duoxi Trading Firm, The Apparel Manufacturing Company, where style, quality, and innovation intersect to create exceptional clothing for every occasion. With a legacy of excellence spanning over a decade, our company has established itself as a leading player in the fashion industry. At our state-of-the-art manufacturing facility, we blend cutting-edge technology with skilled craftsmanship to produce a diverse range of apparel that caters to a wide customer base. From trendy casual wear to sophisticated formal attire, we take pride in offering versatile and stylish clothing options for individuals of all ages and preferences. Our commitment to sustainability and ethical practices sets us apart in the industry. We prioritize using eco-friendly materials and implementing responsible manufacturing processes to minimize our environmental footprint while ensuring the well-being of our employees and communities. Driven by a passion for creativity and a keen eye for fashion trends, our design team constantly strives to push boundaries and deliver collections that inspire and delight. With a focus on innovation and customer satisfaction, we aim to exceed expectations and set new standards in the apparel industry. As a company dedicated to excellence, we are honored to play a part in shaping the wardrobes of our customers and creating lasting impressions through our clothing. Join us on this journey of style, quality, and innovation as we continue to redefine the world of fashion. Thank you for considering our Apparel Manufacturing Company. Ascending Sports",
};

const faqs = [
  {
    question: "Who are we?",
    answer:
      "We are based in Punjab, Pakistan, start from 2024, sell to North America(40.00%), South America(20.00%), Eastern Europe(20.00%), Western Europe(5.00%), Central America(5.00%), Northern Europe(5.00%), Southern Europe(5.00%). There are total about 11-50 people in our office.",
  },
  {
    question: "How can we guarantee quality?",
    answer:
      "Always a pre-production sample before mass production; Always final inspection before shipment.",
  },
  {
    question: "What can you buy from us?",
    answer: "Hoodies, T-Shirts, Jackets, Tracksuits, Uniforms.",
  },
  {
    question: "Why should you buy from us not from other suppliers?",
    answer:
      "We have many years of experience in which we stand as a beacon of reliability and quality craftsmanship. Our longstanding experience gives us insight into trends, preferences, and technology, helping us lead and set standards.",
  },
  {
    question: "What services can we provide?",
    answer:
      "Accepted Delivery Terms: FOB, CIF; Accepted Payment Currency: USD, EUR, CAD, AUD, GBP; Accepted Payment Type: T/T, MoneyGram, Western Union; Language Spoken: English.",
  },
];

export default function SupplierCard() {
  return (
    <div className="max-w-3xl rounded-lg flex flex-col gap-4">
      {/* Header */}
      <h2 className="text-sm font-semibold mt-2">Know your supplier</h2>

      <div className="px-6 py-4 bg-white rounded-lg">
        {/* Seller Info */}
        <div className="flex place-items-start">
          {/* Seller Logo */}
          <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>

          {/* Seller Details */}
          <div>
            <div className="flex gap-4 text-sm font-semibold text-gray-900">
              <p>{sellerData.name}</p>
              <div className="flex items-center">
                <span className="w-5 h-5 bg-red-600 rounded-sm mr-2"></span>
                <span className="text-sm font-medium text-gray-700">
                  {sellerData.country}
                </span>
              </div>
            </div>
            <p className="text-lg">{`${sellerData.years} - ${sellerData.location}`}</p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-white from-10% via-gray-200 via-50% to-white to-90% my-2"></div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around mt-6 gap-3">
          <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#E10D5E] to-[#FBA533] rounded-lg">
            Contact supplier
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium bg-[#f6f6f6] rounded-lg">
            Send enquiry
          </button>
          <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-[#DDDDDD] rounded-lg">
            View Profile
          </button>
        </div>
      </div>

      {/* About Section */}
      <p>{sellerData.about}</p>

      {/* FAQ Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">FAQs</h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h4 className="text-sm font-semibold text-gray-900">
                {faq.question}
              </h4>
              <p className="text-sm mt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
